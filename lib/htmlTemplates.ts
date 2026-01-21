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

// Helper to generate background
function generateBackgroundHtml(custom: Customizacao): string {
    if (!custom.imagem_fundo?.url) return '';

    const { url, tipo, opacidade, escala = 1, posicao_x = 50, posicao_y = 50, rotacao = 0 } = custom.imagem_fundo;

    let clipPath = 'none';
    if (tipo === 'lateral_esquerda') clipPath = 'polygon(0 0, 33.33% 0, 33.33% 100%, 0 100%)';
    if (tipo === 'lateral_direita') clipPath = 'polygon(66.66% 0, 100% 0, 100% 100%, 66.66% 100%)';
    if (tipo === 'cabecalho') clipPath = 'polygon(0 0, 100% 0, 100% 150px, 0 150px)';

    return `
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; overflow: hidden; pointer-events: none; clip-path: ${clipPath}; -webkit-clip-path: ${clipPath};">
        <img src="${url}" style="position: absolute; width: 100%; height: 100%; object-fit: cover; opacity: ${opacidade}; transform-origin: center center; transform: translate(${posicao_x - 50}%, ${posicao_y - 50}%) scale(${escala}) rotate(${rotacao}deg);">
    </div>
    `;
}

// Template 1 - Professional Modern (Sidebar Style)
function generateTemplate1(data: CurriculoData, custom: Customizacao): string {
    const { pessoal, resumo, experiencias, skills, idiomas, educacao, certificacoes } = data;
    const { cores, modelo_foto, secoes_visiveis } = custom;

    const photoRadius = modelo_foto === 'circular' ? 'border-radius: 50%;' : 'border-radius: 8px;';

    const sidebarBg = (custom.imagem_fundo?.tipo === 'lateral_esquerda' || custom.imagem_fundo?.tipo === 'inteiro')
        ? `rgba(${parseInt(cores.primaria.slice(1, 3), 16)}, ${parseInt(cores.primaria.slice(3, 5), 16)}, ${parseInt(cores.primaria.slice(5, 7), 16)}, 0.85)`
        : cores.primaria;

    const backgroundHtml = generateBackgroundHtml({
        ...custom,
        imagem_fundo: custom.imagem_fundo?.tipo === 'lateral_esquerda'
            ? { ...custom.imagem_fundo, tipo: 'lateral_esquerda' } // Ensure clip matches 33% roughly
            : custom.imagem_fundo
    });

    const skillsHtml = skills.filter(Boolean).map(s =>
        `<span style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; font-size: 12px; margin: 2px;">${escapeHtml(s)}</span>`
    ).join('');

    const idiomasHtml = idiomas.filter(i => i.idioma && i.nivel).map(i =>
        `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>${escapeHtml(i.idioma)}</span>
            <span style="opacity: 0.8;">${escapeHtml(i.nivel)}</span>
        </div>`
    ).join('');

    const educacaoSidebarHtml = educacao.map(edu => `
        <div style="margin-bottom: 8px;">
            <div style="font-weight: bold;">${escapeHtml(edu.grau)}</div>
            <div style="font-size: 12px; opacity: 0.9;">${escapeHtml(edu.instituicao)}</div>
            <div style="font-size: 11px; opacity: 0.75;">${escapeHtml(edu.ano_inicio)} - ${escapeHtml(edu.ano_fim || 'Atualmente')}</div>
        </div>
    `).join('');

    const certificacoesSidebarHtml = certificacoes.map(cert => `
        <div style="margin-bottom: 8px; font-size: 13px;">
            <div style="font-weight: bold;">${escapeHtml(cert.nome)}</div>
            <div style="opacity: 0.8;">${escapeHtml(cert.emissor)}</div>
            <div style="font-size: 11px; font-weight: 600;">${escapeHtml(cert.ano_obtencao)}</div>
        </div>
    `).join('');

    const experienciasHtml = experiencias.map(exp => `
        <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h4 style="font-weight: bold; margin: 0;">${escapeHtml(exp.cargo)}</h4>
                <span style="font-size: 11px; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; white-space: nowrap;">
                    ${escapeHtml(exp.ano_inicio)} - ${escapeHtml(exp.ano_fim || 'Atualmente')}
                </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0;">
                <div style="color: ${cores.secundaria}; font-weight: 600;">${escapeHtml(exp.empresa)}</div>
                ${exp.localizacao ? `<div style="font-size: 11px; font-style: italic; opacity: 0.7;">${escapeHtml(exp.localizacao)}</div>` : ''}
            </div>
            ${exp.formato === 'topicos'
            ? `<ul style="margin: 4px 0 0 0; padding-left: 20px; font-size: 13px;">
                    ${exp.descricao.split('•').filter(Boolean).map(line => `<li style="margin-bottom: 2px;">${escapeHtml(line.trim())}</li>`).join('')}
                   </ul>`
            : `<div style="font-size: 13px; white-space: pre-line; text-align: justify;">${nl2br(exp.descricao)}</div>`
        }
        </div>
    `).join('');

    return `
        <div style="width: 210mm; min-height: 297mm; display: flex; font-family: ${custom.fonte}; font-size: 14px; color: ${cores.texto}; background: white; position: relative; overflow: hidden;">
            ${backgroundHtml}
            
            <!-- Sidebar -->
            <div style="width: 33%; background: ${sidebarBg}; color: white; padding: 24px; display: flex; flex-direction: column; gap: 20px; position: relative; z-index: 10;">
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

                ${secoes_visiveis.educacao && educacao.length > 0 ? `
                <div>
                    <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 4px; margin-bottom: 8px;">Educação</h2>
                    ${educacaoSidebarHtml}
                </div>
                ` : ''}

                ${secoes_visiveis.certificacoes && certificacoes.length > 0 ? `
                <div>
                    <h2 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 4px; margin-bottom: 8px;">Certificações</h2>
                    ${certificacoesSidebarHtml}
                </div>
                ` : ''}
            </div>
            
            <!-- Main Content -->
            <div style="width: 67%; padding: 32px; position: relative; z-index: 10;">
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
            </div>
        </div>
    `;
}

// Template 2 - Header Bold Style
function generateTemplate2(data: CurriculoData, custom: Customizacao): string {
    const { pessoal, resumo, experiencias, skills, idiomas, educacao, certificacoes } = data;
    const { cores, modelo_foto, secoes_visiveis } = custom;

    const photoRadius = modelo_foto === 'circular' ? 'border-radius: 50%;' : 'border-radius: 8px;';

    // Customize background for Right Sidebar logic (66% clip)
    const backgroundHtml = generateBackgroundHtml({
        ...custom,
        imagem_fundo: custom.imagem_fundo?.tipo === 'lateral_direita'
            ? { ...custom.imagem_fundo, tipo: 'lateral_direita' }
            : custom.imagem_fundo
    });

    return `
        <div style="width: 210mm; min-height: 297mm; font-family: ${custom.fonte}; font-size: 14px; color: ${cores.texto}; background: white; position: relative; overflow: hidden;">
            ${backgroundHtml}

            <!-- Header -->
            <div style="background: ${cores.primaria}; padding: 32px; color: white; display: flex; align-items: center; gap: 24px; position: relative; z-index: 10; margin: 32px 32px 0 32px; border-radius: 12px;">
                ${pessoal.foto_url ? `<img src="${pessoal.foto_url}" alt="Foto" style="width: 120px; height: 120px; object-fit: cover; ${photoRadius} border: 4px solid rgba(255,255,255,0.2);">` : ''}
                <div>
                    <h1 style="font-size: 36px; font-weight: 900; margin: 0; text-transform: uppercase;">${escapeHtml(pessoal.nome)} ${escapeHtml(pessoal.sobrenome)}</h1>
                    <p style="font-size: 18px; opacity: 0.9; margin-top: 4px;">${escapeHtml(pessoal.cargo)}</p>
                </div>
            </div>
            
            <!-- Contact Bar -->
            <div style="background: #f1f5f9; padding: 12px 32px; display: flex; justify-content: space-around; font-size: 12px; color: #475569; position: relative; z-index: 10; margin: 32px 32px 32px 32px; border-radius: 8px;">
                <span>📧 ${escapeHtml(pessoal.email)}</span>
                <span>📱 ${escapeHtml(pessoal.telefone)}</span>
                <span>📍 ${escapeHtml(pessoal.localizacao)}</span>
            </div>
            
            <!-- Body -->
            <div style="padding: 0 32px 32px 32px; display: flex; gap: 32px; position: relative; z-index: 10;">
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
                                <div style="color: ${cores.secundaria}; font-size: 13px; display: flex; flex-wrap: wrap; gap: 4px;">
                                    <span>${escapeHtml(exp.empresa)}</span>
                                    <span>|</span>
                                    <span>${escapeHtml(exp.ano_inicio)} - ${escapeHtml(exp.ano_fim || 'Atualmente')}</span>
                                    ${exp.localizacao ? `<span>|</span><span style="font-style: italic;">${escapeHtml(exp.localizacao)}</span>` : ''}
                                </div>
                                ${exp.formato === 'topicos'
            ? `<ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13px;">
                                        ${exp.descricao.split('•').filter(Boolean).map(line => `<li style="margin-bottom: 2px;">${escapeHtml(line.trim())}</li>`).join('')}
                                       </ul>`
            : `<p style="font-size: 13px; margin-top: 8px; white-space: pre-line;">${nl2br(exp.descricao)}</p>`
        }
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                
                <!-- Side Column (Right) -->
                <div style="flex: 1; background: transparent; padding-top: 0;">
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
                        ${secoes_visiveis.skills && skills.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${cores.primaria}; margin-bottom: 8px;">Habilidades</h3>
                            ${skills.filter(Boolean).map(s => `<div style="font-size: 12px; margin-bottom: 4px; background: white; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; display: inline-block; margin: 2px;">${escapeHtml(s)}</div>`).join('')}
                        </div>
                        ` : ''}
                        
                        ${secoes_visiveis.idiomas && idiomas.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${cores.primaria}; margin-bottom: 8px;">Idiomas</h3>
                            ${idiomas.filter(i => i.idioma).map(i => `<div style="font-size: 12px; margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 2px;"><b>${escapeHtml(i.idioma)}</b> <span style="float:right">${escapeHtml(i.nivel)}</span></div>`).join('')}
                        </div>
                        ` : ''}
                        
                        ${secoes_visiveis.educacao && educacao && educacao.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${cores.primaria}; margin-bottom: 8px;">Educação</h3>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${educacao.map(edu => `
                                    <div>
                                        <h4 style="font-weight: bold; font-size: 13px; margin: 0;">${escapeHtml(edu.grau)}</h4>
                                        <div style="font-size: 12px; font-weight: 500;">${escapeHtml(edu.instituicao)}</div>
                                        <div style="font-size: 11px; opacity: 0.8;">${escapeHtml(edu.ano_inicio)} - ${escapeHtml(edu.ano_fim || 'Atualmente')}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                        
                        ${secoes_visiveis.certificacoes && certificacoes && certificacoes.length > 0 ? `
                        <div>
                            <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${cores.primaria}; margin-bottom: 8px;">Certificações</h3>
                            <div style="display: flex; flex-direction: column; gap: 6px;">
                                ${certificacoes.map(cert => `
                                    <div style="padding-left: 8px; border-left: 2px solid ${cores.secundaria};">
                                        <div style="font-weight: bold; font-size: 12px;">${escapeHtml(cert.nome)}</div>
                                        <div style="font-size: 11px; opacity: 0.8;">${escapeHtml(cert.emissor)} • ${escapeHtml(cert.ano_obtencao)}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
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

    // Check if background image needs clip for template 3 left sidebar (25% width approx)
    let backgroundHtml = '';
    if (custom.imagem_fundo?.url) {
        const { url, tipo, opacidade, escala = 1, posicao_x = 50, posicao_y = 50, rotacao = 0 } = custom.imagem_fundo;
        let clipPath = 'none';
        if (tipo === 'lateral_esquerda') clipPath = 'polygon(0 0, 30% 0, 30% 100%, 0 100%)'; // Approx 25% + padding
        if (tipo === 'cabecalho') clipPath = 'polygon(0 0, 100% 0, 100% 200px, 0 200px)';

        backgroundHtml = `
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; overflow: hidden; pointer-events: none; clip-path: ${clipPath}; -webkit-clip-path: ${clipPath};">
            <img src="${url}" style="position: absolute; width: 100%; height: 100%; object-fit: cover; opacity: ${opacidade}; transform-origin: center center; transform: translate(${posicao_x - 50}%, ${posicao_y - 50}%) scale(${escala}) rotate(${rotacao}deg);">
        </div>
        `;
    }

    return `
        <div style="width: 210mm; min-height: 297mm; font-family: ${custom.fonte}; font-size: 14px; color: #000; background: white; padding: 48px; position: relative; overflow: hidden;">
            ${backgroundHtml}
            
            <!-- Header -->
            <div style="border-bottom: 2px solid #000; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end; position: relative; z-index: 10;">
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
            <div style="display: flex; gap: 48px; position: relative; z-index: 10;">
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
                    
                     ${secoes_visiveis.educacao && educacao && educacao.length > 0 ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">Educação</h3>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${educacao.map(edu => `
                                <div>
                                    <div style="font-weight: bold; font-size: 12px; margin: 0;">${escapeHtml(edu.grau)}</div>
                                    <div style="font-size: 11px; text-transform: uppercase; opacity: 0.8;">${escapeHtml(edu.instituicao)}</div>
                                    <div style="font-size: 10px; opacity: 0.7; font-style: italic;">${escapeHtml(edu.ano_inicio)} - ${escapeHtml(edu.ano_fim || 'Atualmente')}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${secoes_visiveis.certificacoes && certificacoes && certificacoes.length > 0 ? `
                    <div>
                        <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">Certificações</h3>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${certificacoes.map(cert => `
                                <div>
                                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                        <span style="font-weight: bold; font-size: 13px;">${escapeHtml(cert.nome)}</span>
                                        <span style="font-size: 11px; opacity: 0.7;">${escapeHtml(cert.ano_obtencao)}</span>
                                    </div>
                                    <div style="font-size: 11px; text-transform: uppercase; opacity: 0.8;">${escapeHtml(cert.emissor)}</div>
                                </div>
                            `).join('')}
                        </div>
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
                                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                    <strong>${escapeHtml(exp.cargo)}</strong>
                                    <span style="font-size: 12px; opacity: 0.7; white-space: nowrap;">${escapeHtml(exp.ano_inicio)} - ${escapeHtml(exp.ano_fim || 'Atualmente')}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                    <div style="font-size: 13px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(exp.empresa)}</div>
                                    ${exp.localizacao ? `<div style="font-size: 11px; opacity: 0.6;">${escapeHtml(exp.localizacao)}</div>` : ''}
                                </div>
                                ${exp.formato === 'topicos'
            ? `<ul style="margin: 4px 0 0 0; padding-left: 20px; font-size: 13px;">
                                        ${exp.descricao.split('•').filter(Boolean).map(line => `<li style="margin-bottom: 2px;">${escapeHtml(line.trim())}</li>`).join('')}
                                       </ul>`
            : `<p style="font-size: 13px; margin-top: 4px; white-space: pre-line; text-align: justify;">${nl2br(exp.descricao)}</p>`
        }
                            </div>
                        `).join('')}
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
