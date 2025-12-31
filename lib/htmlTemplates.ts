// Pure HTML template generation - no React SSR needed
// These functions return HTML strings directly

import { CurriculoData, Customizacao } from '@/lib/types';

const DEFAULT_CUSTOMIZACAO: Customizacao = {
    cores: { primaria: '#1e3a8a', secundaria: '#64748b', texto: '#0f172a' },
    fonte: 'system-ui, -apple-system, sans-serif',
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

function escapeHtml(text: string | undefined): string {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function nl2br(text: string | undefined): string {
    if (!text) return '';
    return escapeHtml(text).replace(/\n/g, '<br>');
}

// Template 1 - Professional Modern (Sidebar Style)
function generateTemplate1(data: CurriculoData, custom: Customizacao): string {
    const { pessoal, resumo, experiencias, skills, idiomas, educacao, certificacoes } = data;
    const { cores, modelo_foto, secoes_visiveis } = custom;

    const photoRadius = modelo_foto === 'circular' ? 'border-radius: 50%;' : 'border-radius: 8px;';

    const skillsHtml = skills.filter(Boolean).map(s =>
        `<span style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; font-size: 12px; margin: 2px;">${escapeHtml(s)}</span>`
    ).join('');

    const idiomasHtml = idiomas.filter(i => i.idioma && i.nivel).map(i =>
        `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>${escapeHtml(i.idioma)}</span>
            <span style="opacity: 0.8;">${escapeHtml(i.nivel)}</span>
        </div>`
    ).join('');

    const experienciasHtml = experiencias.map(exp => `
        <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h4 style="font-weight: bold; margin: 0;">${escapeHtml(exp.cargo)}</h4>
                <span style="font-size: 11px; background: #f1f5f9; padding: 2px 8px; border-radius: 4px;">${escapeHtml(exp.periodo)}</span>
            </div>
            <div style="color: ${cores.secundaria}; font-weight: 600; margin: 4px 0;">${escapeHtml(exp.empresa)}</div>
            <div style="font-size: 13px; white-space: pre-line;">${nl2br(exp.descricao)}</div>
        </div>
    `).join('');

    return `
        <div style="width: 210mm; min-height: 297mm; display: flex; font-family: ${custom.fonte}; font-size: 14px; color: ${cores.texto}; background: white;">
            <!-- Sidebar -->
            <div style="width: 33%; background: ${cores.primaria}; color: white; padding: 24px; display: flex; flex-direction: column; gap: 20px;">
                <div style="text-align: center;">
                    ${pessoal.foto_url ? `<img src="${pessoal.foto_url}" alt="Foto" style="width: 120px; height: 120px; object-fit: cover; ${photoRadius} border: 2px solid rgba(255,255,255,0.3); margin-bottom: 12px;">` : ''}
                </div>
                
                <div>
                    <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">Contato</h2>
                    <div style="font-size: 13px; display: flex; flex-direction: column; gap: 8px;">
                        <div>📧 ${escapeHtml(pessoal.email)}</div>
                        <div>📱 ${escapeHtml(pessoal.telefone)}</div>
                        <div>📍 ${escapeHtml(pessoal.localizacao)}</div>
                        ${pessoal.linkedin ? `<div>💼 ${escapeHtml(pessoal.linkedin)}</div>` : ''}
                    </div>
                </div>
                
                ${secoes_visiveis.skills && skills.length > 0 ? `
                <div>
                    <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 4px; margin-bottom: 8px;">Habilidades</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">${skillsHtml}</div>
                </div>
                ` : ''}
                
                ${secoes_visiveis.idiomas && idiomas.length > 0 ? `
                <div>
                    <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 4px; margin-bottom: 8px;">Idiomas</h2>
                    ${idiomasHtml}
                </div>
                ` : ''}
            </div>
            
            <!-- Main Content -->
            <div style="width: 67%; padding: 32px;">
                <div style="margin-bottom: 24px;">
                    <h1 style="font-size: 28px; font-weight: bold; color: ${cores.primaria}; margin: 0;">
                        ${escapeHtml(pessoal.nome)} <span style="color: ${cores.secundaria};">${escapeHtml(pessoal.sobrenome)}</span>
                    </h1>
                    <p style="color: ${cores.secundaria}; margin-top: 4px;">${escapeHtml(pessoal.cargo)}</p>
                </div>
                
                ${secoes_visiveis.perfil && resumo ? `
                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 16px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid ${cores.secundaria}; padding-bottom: 4px; margin-bottom: 8px;">Resumo</h3>
                    <p style="text-align: justify; line-height: 1.6;">${nl2br(resumo)}</p>
                </div>
                ` : ''}
                
                ${secoes_visiveis.experiencias && experiencias.length > 0 ? `
                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 16px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid ${cores.secundaria}; padding-bottom: 4px; margin-bottom: 12px;">Experiência Profissional</h3>
                    ${experienciasHtml}
                </div>
                ` : ''}
                
                ${secoes_visiveis.certificacoes && certificacoes ? `
                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 16px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid ${cores.secundaria}; padding-bottom: 4px; margin-bottom: 8px;">Certificações</h3>
                    <p style="white-space: pre-line;">${nl2br(certificacoes)}</p>
                </div>
                ` : ''}
                
                ${secoes_visiveis.educacao && educacao ? `
                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 16px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid ${cores.secundaria}; padding-bottom: 4px; margin-bottom: 8px;">Educação</h3>
                    <p style="white-space: pre-line;">${nl2br(educacao)}</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Template 2 - Header Bold Style
function generateTemplate2(data: CurriculoData, custom: Customizacao): string {
    const { pessoal, resumo, experiencias, skills, idiomas, educacao, certificacoes } = data;
    const { cores, modelo_foto, secoes_visiveis } = custom;

    const photoRadius = modelo_foto === 'circular' ? 'border-radius: 50%;' : 'border-radius: 8px;';

    return `
        <div style="width: 210mm; min-height: 297mm; font-family: ${custom.fonte}; font-size: 14px; color: ${cores.texto}; background: white;">
            <!-- Header -->
            <div style="background: ${cores.primaria}; padding: 32px; color: white; display: flex; align-items: center; gap: 24px;">
                ${pessoal.foto_url ? `<img src="${pessoal.foto_url}" alt="Foto" style="width: 120px; height: 120px; object-fit: cover; ${photoRadius} border: 4px solid rgba(255,255,255,0.2);">` : ''}
                <div>
                    <h1 style="font-size: 36px; font-weight: 900; margin: 0; text-transform: uppercase;">${escapeHtml(pessoal.nome)} ${escapeHtml(pessoal.sobrenome)}</h1>
                    <p style="font-size: 18px; opacity: 0.9; margin-top: 4px;">${escapeHtml(pessoal.cargo)}</p>
                </div>
            </div>
            
            <!-- Contact Bar -->
            <div style="background: #f1f5f9; padding: 12px 32px; display: flex; justify-content: space-around; font-size: 12px; color: #475569;">
                <span>📧 ${escapeHtml(pessoal.email)}</span>
                <span>📱 ${escapeHtml(pessoal.telefone)}</span>
                <span>📍 ${escapeHtml(pessoal.localizacao)}</span>
            </div>
            
            <!-- Body -->
            <div style="padding: 32px; display: flex; gap: 32px;">
                <!-- Main Column -->
                <div style="flex: 2;">
                    ${secoes_visiveis.perfil && resumo ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: ${cores.primaria}; margin-bottom: 8px;">Resumo Profissional</h3>
                        <p style="line-height: 1.6;">${nl2br(resumo)}</p>
                    </div>
                    ` : ''}
                    
                    ${secoes_visiveis.experiencias && experiencias.length > 0 ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: ${cores.primaria}; margin-bottom: 12px;">Experiência</h3>
                        ${experiencias.map(exp => `
                            <div style="margin-bottom: 16px; padding-left: 12px; border-left: 3px solid ${cores.secundaria};">
                                <h4 style="font-weight: bold; margin: 0;">${escapeHtml(exp.cargo)}</h4>
                                <div style="color: ${cores.secundaria}; font-size: 13px;">${escapeHtml(exp.empresa)} | ${escapeHtml(exp.periodo)}</div>
                                <p style="font-size: 13px; margin-top: 8px; white-space: pre-line;">${nl2br(exp.descricao)}</p>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                
                <!-- Side Column -->
                <div style="flex: 1; background: #f8fafc; padding: 16px; border-radius: 8px;">
                    ${secoes_visiveis.skills && skills.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${cores.primaria}; margin-bottom: 8px;">Habilidades</h3>
                        ${skills.filter(Boolean).map(s => `<div style="font-size: 12px; margin-bottom: 4px;">• ${escapeHtml(s)}</div>`).join('')}
                    </div>
                    ` : ''}
                    
                    ${secoes_visiveis.idiomas && idiomas.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${cores.primaria}; margin-bottom: 8px;">Idiomas</h3>
                        ${idiomas.filter(i => i.idioma).map(i => `<div style="font-size: 12px; margin-bottom: 4px;">${escapeHtml(i.idioma)} - ${escapeHtml(i.nivel)}</div>`).join('')}
                    </div>
                    ` : ''}
                    
                    ${secoes_visiveis.educacao && educacao ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${cores.primaria}; margin-bottom: 8px;">Educação</h3>
                        <p style="font-size: 12px; white-space: pre-line;">${nl2br(educacao)}</p>
                    </div>
                    ` : ''}
                    
                    ${secoes_visiveis.certificacoes && certificacoes ? `
                    <div>
                        <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${cores.primaria}; margin-bottom: 8px;">Certificações</h3>
                        <p style="font-size: 12px; white-space: pre-line;">${nl2br(certificacoes)}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Template 3 - Minimalist
function generateTemplate3(data: CurriculoData, custom: Customizacao): string {
    const { pessoal, resumo, experiencias, skills, idiomas, educacao, certificacoes } = data;
    const { modelo_foto, secoes_visiveis } = custom;

    const photoRadius = modelo_foto === 'circular' ? 'border-radius: 50%;' : 'border-radius: 8px;';

    return `
        <div style="width: 210mm; min-height: 297mm; font-family: ${custom.fonte}; font-size: 14px; color: #000; background: white; padding: 48px;">
            <!-- Header -->
            <div style="border-bottom: 2px solid #000; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="display: flex; align-items: center; gap: 24px;">
                    ${pessoal.foto_url ? `<img src="${pessoal.foto_url}" alt="Foto" style="width: 100px; height: 100px; object-fit: cover; ${photoRadius} border: 1px solid #e5e7eb;">` : ''}
                    <div>
                        <h1 style="font-size: 40px; font-weight: 300; margin: 0;">${escapeHtml(pessoal.nome)}</h1>
                        <h1 style="font-size: 40px; font-weight: 700; margin: 0;">${escapeHtml(pessoal.sobrenome)}</h1>
                    </div>
                </div>
                <div style="text-align: right; font-size: 12px; line-height: 1.8;">
                    <div>${escapeHtml(pessoal.email)}</div>
                    <div>${escapeHtml(pessoal.telefone)}</div>
                    <div>${escapeHtml(pessoal.localizacao)}</div>
                </div>
            </div>
            
            <!-- Two Columns -->
            <div style="display: flex; gap: 48px;">
                <!-- Left Column -->
                <div style="width: 25%;">
                    ${secoes_visiveis.skills && skills.length > 0 ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">Habilidades</h3>
                        ${skills.filter(Boolean).map(s => `<div style="font-size: 12px; margin-bottom: 6px;">${escapeHtml(s)}</div>`).join('')}
                    </div>
                    ` : ''}
                    
                    ${secoes_visiveis.idiomas && idiomas.length > 0 ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">Idiomas</h3>
                        ${idiomas.filter(i => i.idioma).map(i => `<div style="font-size: 12px; margin-bottom: 6px;">${escapeHtml(i.idioma)} <span style="opacity: 0.6;">(${escapeHtml(i.nivel)})</span></div>`).join('')}
                    </div>
                    ` : ''}
                </div>
                
                <!-- Right Column -->
                <div style="flex: 1;">
                    ${secoes_visiveis.perfil && resumo ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">Perfil</h3>
                        <p style="line-height: 1.7; text-align: justify;">${nl2br(resumo)}</p>
                    </div>
                    ` : ''}
                    
                    ${secoes_visiveis.experiencias && experiencias.length > 0 ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">Experiência</h3>
                        ${experiencias.map(exp => `
                            <div style="margin-bottom: 16px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <strong>${escapeHtml(exp.cargo)}</strong>
                                    <span style="font-size: 12px; opacity: 0.7;">${escapeHtml(exp.periodo)}</span>
                                </div>
                                <div style="font-size: 13px; opacity: 0.8;">${escapeHtml(exp.empresa)}</div>
                                <p style="font-size: 13px; margin-top: 8px; white-space: pre-line;">${nl2br(exp.descricao)}</p>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${secoes_visiveis.educacao && educacao ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">Educação</h3>
                        <p style="font-size: 13px; white-space: pre-line;">${nl2br(educacao)}</p>
                    </div>
                    ` : ''}
                    
                    ${secoes_visiveis.certificacoes && certificacoes ? `
                    <div>
                        <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">Certificações</h3>
                        <p style="font-size: 13px; white-space: pre-line;">${nl2br(certificacoes)}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Main export function
export function generateResumeHtml(
    dados: CurriculoData,
    templateId: string,
    customizacao?: Partial<Customizacao>
): string {
    const mergedCustom: Customizacao = { ...DEFAULT_CUSTOMIZACAO, ...customizacao };

    let bodyHtml: string;
    switch (templateId) {
        case 'template_2':
            bodyHtml = generateTemplate2(dados, mergedCustom);
            break;
        case 'template_3':
            bodyHtml = generateTemplate3(dados, mergedCustom);
            break;
        case 'template_1':
        default:
            bodyHtml = generateTemplate1(dados, mergedCustom);
            break;
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page { size: A4; margin: 0; }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    margin: 0; 
                    padding: 0; 
                    -webkit-print-color-adjust: exact; 
                    print-color-adjust: exact;
                }
            </style>
        </head>
        <body>
            ${bodyHtml}
        </body>
        </html>
    `;
}
