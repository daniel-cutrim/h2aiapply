import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { dados, template_id, customizacao } = body;

        if (!dados || !dados.pessoal) {
            return NextResponse.json({ error: 'Dados inválidos ou incompletos.' }, { status: 400 });
        }

        // Dynamic import to bypass Turbopack static analysis
        const { generateResumeHtml } = await import('@/lib/generateHtml');
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

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                html: fullHtml,
                format: 'A4',
                margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
                waitFor: 1000
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Erro no serviço de PDF: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        const base64Pdf = data.pdf || data.file || (typeof data === 'string' ? data : null);

        if (!base64Pdf) {
            throw new Error('PDF não retornado pelo serviço.');
        }

        const buffer = Buffer.from(base64Pdf, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="curriculo-${dados.pessoal.nome}.pdf"`
            }
        });

    } catch (err: any) {
        console.error('Erro ao gerar PDF:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
