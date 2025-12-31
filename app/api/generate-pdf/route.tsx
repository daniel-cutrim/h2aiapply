import { NextResponse } from 'next/server';
import { renderToStaticMarkup } from 'react-dom/server';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import Template3 from '@/components/templates/Template3';
import { CurriculoData, Customizacao } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Default Styles for SSR
const DEFAULT_CUSTOMIZACAO: Customizacao = {
    cores: { primario: '#1e3a8a', secundario: '#64748b', texto: '#0f172a' } as any,
    fonte: 'sans-serif',
    espacamento: 'normal',
    modelo_foto: 'circular',
    secoes_visiveis: {
        perfil: true,
        experiencias: true,
        educacao: true,
        skills: true,
        idiomas: true,
        certificacoes: true
    },
    ordem_secoes: []
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { dados, template_id, customizacao } = body;

        if (!dados || !dados.pessoal) {
            return NextResponse.json({ error: 'Dados inválidos ou incompletos.' }, { status: 400 });
        }

        // Merge defaults
        const finalCustomizacao = { ...DEFAULT_CUSTOMIZACAO, ...customizacao };

        // Select Template
        let Component;
        switch (template_id) {
            case 'template_2':
                Component = Template2;
                break;
            case 'template_3':
                Component = Template3;
                break;
            case 'template_1':
            default:
                Component = Template1;
                break;
        }

        // Render React to HTML String (Server-Side)
        const componentHtml = renderToStaticMarkup(
            <Component data={dados as CurriculoData} customizacao={finalCustomizacao} />
        );

        // Wrap in full HTML document with Tailwind
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    @page { size: A4; margin: 0; }
                    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; zoom: 1.25; }
                </style>
            </head>
            <body>
                ${componentHtml}
            </body>
            </html>
        `;

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
                waitFor: 1000 // Give tailwind CDN a second to load
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
