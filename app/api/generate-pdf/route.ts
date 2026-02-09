import { NextResponse } from 'next/server';
import { generateResumeHtml } from '@/lib/htmlTemplates';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { dados, template_id, customizacao } = body;

        if (!dados || !dados.pessoal) {
            return NextResponse.json({ error: 'Dados inválidos ou incompletos.' }, { status: 400 });
        }

        // Generate HTML using pure template strings (no React SSR)
        const fullHtml = generateResumeHtml(dados, template_id || 'template_1', customizacao || {});

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
                    format: 'A4',
                    margin: { top: '0', right: '0', bottom: '0', left: '0' },
                    waitFor: 500
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
