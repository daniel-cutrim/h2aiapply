import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import Template3 from '@/components/templates/Template3';
import { CurriculoData, Customizacao } from '@/lib/types';

// Default Styles for SSR
const DEFAULT_CUSTOMIZACAO: Customizacao = {
    cores: { primaria: '#1e3a8a', secundaria: '#64748b', texto: '#0f172a' } as any,
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

export function generateResumeHtml(dados: CurriculoData, template_id: string, customizacao: Partial<Customizacao>) {
    // Merge defaults
    const finalCustomizacao = { ...DEFAULT_CUSTOMIZACAO, ...customizacao };

    // Select Template
    let Component: any;
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
    const element = React.createElement(Component, {
        data: dados,
        customizacao: finalCustomizacao
    });

    const componentHtml = renderToStaticMarkup(element);

    // Wrap in full HTML document with Tailwind
    return `
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
}
