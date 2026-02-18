import { NextResponse } from 'next/server';
import { generateResumeHtml } from '@/lib/htmlTemplates';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { dados, template_id, customizacao } = body;

        if (!dados || !dados.pessoal) {
            return NextResponse.json({ error: 'Dados inválidos ou incompletos.' }, { status: 400 });
        }

        // Optimizing Background Images for Puppeteer
        // 1. Presets: Read directly from filesystem and embed as Base64 (avoids network/DNS issues)
        // 2. External URLs: Keep as is (Puppeteer will fetch them)
        const resolvedCustomizacao = { ...customizacao };

        if (resolvedCustomizacao?.imagem_fundo?.url) {
            const bgUrl = resolvedCustomizacao.imagem_fundo.url;

            // Check if it's a local preset (starts with /backgrounds/ or contains it)
            if (bgUrl.includes('/backgrounds/')) {
                try {
                    const filename = bgUrl.split('/').pop(); // e.g., '4.png'
                    if (filename) {
                        const filePath = path.join(process.cwd(), 'public', 'backgrounds', filename);
                        if (fs.existsSync(filePath)) {
                            const fileBuffer = fs.readFileSync(filePath);
                            const base64Image = `data:image/png;base64,${fileBuffer.toString('base64')}`;
                            resolvedCustomizacao.imagem_fundo.url = base64Image;
                            console.log(`[API] Embedded preset ${filename} as Base64`);
                        } else {
                            console.warn(`[API] Preset file not found: ${filePath}`);
                        }
                    }
                } catch (e) {
                    console.error('[API] Error reading preset file:', e);
                }
            }
            // Logic for resolving other relative paths (if any) could stay here, 
            // but effectively we only have presets as relative paths now.
        }

        // Generate HTML using pure template strings (no React SSR)
        const fullHtml = generateResumeHtml(dados, template_id || 'template_1', resolvedCustomizacao || {});

        // Send to Puppeteer URL
        const puppeteerUrl = process.env.PUPPETEER_API_URL;
        if (!puppeteerUrl) {
            return NextResponse.json({ error: 'Serviço de PDF não configurado (PUPPETEER_API_URL missing)' }, { status: 503 });
        }

        let targetUrl = puppeteerUrl;
        if (targetUrl.includes('/image-from-html')) {
            targetUrl = targetUrl.replace('/image-from-html', '/pdf-from-html');
        } else if (!targetUrl.endsWith('/pdf-from-html')) {
            targetUrl = targetUrl.replace(/\/$/, '') + '/pdf-from-html';
        }

        let response;
        try {
            console.log(`[API] Calling Puppeteer at: ${targetUrl}`);
            response = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    html: fullHtml,
                    singlePage: true,
                    pageWidth: 794
                })
            });
        } catch (fetchError: any) {
            console.error(`[API] Network Error connecting to Puppeteer: ${fetchError.message}`);
            return NextResponse.json({
                error: `Erro de conexão com serviço de PDF: ${fetchError.message}`,
                details: 'Verifique se o serviço Puppeteer está online e acessível.'
            }, { status: 503 });
        }

        if (!response.ok) {
            const errText = await response.text();
            console.error(`[API] Puppeteer Error: ${response.status} ${response.statusText} - ${errText}`);
            return NextResponse.json({
                error: `Erro no serviço de PDF (${response.status})`,
                details: errText,
                url_used: targetUrl
            }, { status: 500 });
        }

        const data = await response.json();
        const base64Pdf = data.pdf || data.file || (typeof data === 'string' ? data : null);

        if (!base64Pdf) {
            throw new Error('PDF não retornado pelo serviço.');
        }

        const buffer = Buffer.from(base64Pdf, 'base64');

        // Sanitize filename to strict ASCII to avoid header errors
        const safeFilename = `curriculo-${(dados.pessoal.nome || 'download').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]/g, '')}.pdf`;

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${safeFilename}"`
            }
        });

    } catch (err: any) {
        console.error('Erro ao gerar PDF:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
