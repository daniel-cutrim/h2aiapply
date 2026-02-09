import React from 'react';
import { CurriculoData, Customizacao } from '@/lib/types';
import { typography, spacingMap, SpacingLevel } from '@/lib/designSystem';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

interface TemplateProps {
    data: CurriculoData;
    customizacao: Customizacao;
}

export default function Template3({ data, customizacao }: TemplateProps) {
    const { cores, fonte, espacamento } = customizacao;

    const containerStyle = {
        '--color-primary': cores.primaria,
        '--color-secondary': cores.secundaria,
        '--color-text': cores.texto,
        fontFamily: fonte,
    } as React.CSSProperties;

    // Use design system spacing
    const spacing = spacingMap[espacamento as SpacingLevel] || spacingMap.normal;

    return (
        <div
            className="w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto flex flex-col text-sm relative overflow-hidden"
            style={{ ...containerStyle, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
        >
            <style>{`
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                }
            `}</style>

            {/* Background Image Layer */}
            {customizacao.imagem_fundo?.url && (
                <div
                    className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
                    style={{
                        clipPath: customizacao.imagem_fundo.tipo === 'lateral_direita' ? 'polygon(70% 0, 100% 0, 100% 100%, 70% 100%)' :
                            customizacao.imagem_fundo.tipo === 'cabecalho' ? 'polygon(0 0, 100% 0, 100% 200px, 0 200px)' :
                                'none'
                    }}
                >
                    <img
                        src={customizacao.imagem_fundo.url}
                        alt="Background"
                        className="absolute object-cover w-full h-full"
                        style={{
                            opacity: customizacao.imagem_fundo.opacidade,
                            transform: `translate(${customizacao.imagem_fundo.posicao_x ? customizacao.imagem_fundo.posicao_x - 50 : 0}%, ${customizacao.imagem_fundo.posicao_y ? customizacao.imagem_fundo.posicao_y - 50 : 0}%) scale(${customizacao.imagem_fundo.escala || 1}) rotate(${customizacao.imagem_fundo.rotacao || 0}deg)`,
                            transformOrigin: 'center center'
                        }}
                    />
                </div>
            )}

            {/* Header / Top */}
            <div className="flex flex-col items-center pt-10 pb-6 text-center border-b-2" style={{ borderColor: 'var(--color-primary)' }}>
                {/* Photo */}
                <div className="mb-4 relative z-10">
                    {data.pessoal.foto_url && (
                        <div className="relative">
                            <div className="absolute inset-0 bg-[var(--color-primary)] rounded-full blur opacity-20 transform translate-y-2"></div>
                            <img
                                src={data.pessoal.foto_url}
                                alt="Profile"
                                className={`w-32 h-32 object-cover border-4 border-white shadow-lg ${customizacao.modelo_foto === 'circular' ? 'rounded-full' : 'rounded-lg'}`}
                            />
                        </div>
                    )}
                </div>

                {/* Name & Role */}
                <div className="mb-4">
                    <h1 className={typography.header.name} style={{ color: 'var(--color-primary)' }}>{data.pessoal.nome} <span className="font-light">{data.pessoal.sobrenome}</span></h1>
                    <p className={`${typography.header.role} mt-2 text-gray-600`}>{data.pessoal.cargo}</p>
                </div>

                {/* Contacts Row - Centered */}
                <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 uppercase tracking-widest font-semibold px-8">
                    <div className="flex items-center gap-1"><Mail size={12} /> {data.pessoal.email}</div>
                    <div className="flex items-center gap-1"><Phone size={12} /> {data.pessoal.telefone}</div>
                    {data.pessoal.localizacao && <div className="flex items-center gap-1"><MapPin size={12} /> {data.pessoal.localizacao}</div>}
                    {data.pessoal.linkedin && <div className="flex items-center gap-1"><Linkedin size={12} /> {data.pessoal.linkedin}</div>}
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 p-8 gap-10 relative z-10">
                {/* Left (Main) Column */}
                <div className={`w-2/3 flex flex-col ${spacing.gap}`}>

                    {customizacao.secoes_visiveis.perfil && (
                        <div>
                            <h3 className={`${typography.section.title} border-b-2 pb-2 mb-3`} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                Profile
                            </h3>
                            <p className={`${typography.body.text} text-gray-700 whitespace-pre-line text-justify`}>{data.resumo}</p>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.experiencias && (
                        <div>
                            <h3 className={`${typography.section.title} border-b-2 pb-2 mb-4`} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                Work Experience
                            </h3>
                            <div className="flex flex-col gap-6">
                                {data.experiencias.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-lg text-gray-800">{exp.cargo}</h4>
                                            <span className="text-xs font-bold text-gray-500">{exp.ano_inicio} - {exp.ano_fim || 'Atualmente'}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-sm font-semibold text-[var(--color-secondary)]">{exp.empresa}</div>
                                            {exp.localizacao && <div className="text-xs italic text-gray-400">{exp.localizacao}</div>}
                                        </div>
                                        {exp.formato === 'topicos' ? (
                                            <ul className={`list-disc list-inside ${typography.body.text} text-gray-600 pl-2`}>
                                                {exp.descricao.split('•').filter(Boolean).map((line, idx) => (
                                                    <li key={idx}>{line.trim()}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className={`${typography.body.text} text-gray-600 mb-2 whitespace-pre-line text-justify`}>{exp.descricao}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.educacao && Array.isArray(data.educacao) && data.educacao.length > 0 && (
                        <div>
                            <h3 className={`${typography.section.title} border-b-2 pb-2 mb-4`} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                Education
                            </h3>
                            <div className="flex flex-col gap-4">
                                {data.educacao.map((edu, i) => (
                                    <div key={i} className="flex justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{edu.grau}</h4>
                                            <div className="text-sm text-gray-600">{edu.instituicao}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-gray-500">{edu.ano_inicio} - {edu.ano_fim || 'Atualmente'}</div>
                                            {edu.area_estudo && <div className="text-xs text-gray-400 max-w-[150px] truncate">{edu.area_estudo}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right (Sidebar like) Column */}
                <div className={`w-1/3 flex flex-col ${spacing.gap}`}>

                    {customizacao.secoes_visiveis.skills && (
                        <div>
                            <h3 className={`${typography.section.title} border-b-2 pb-2 mb-3`} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.idiomas && (
                        <div>
                            <h3 className={`${typography.section.title} border-b-2 pb-2 mb-3`} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                Languages
                            </h3>
                            <div className="grid gap-2">
                                {data.idiomas.map((lang, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-gray-700">{lang.idioma}</span>
                                        <span className="text-xs font-bold text-[var(--color-secondary)] uppercase">{lang.nivel}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.certificacoes && Array.isArray(data.certificacoes) && data.certificacoes.length > 0 && (
                        <div>
                            <h3 className={`${typography.section.title} border-b-2 pb-2 mb-3`} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                Certifications
                            </h3>
                            <div className="flex flex-col gap-3">
                                {data.certificacoes.map((cert, i) => (
                                    <div key={i} className="text-sm">
                                        <div className="font-bold text-gray-800">{cert.nome}</div>
                                        <div className="flex justify-between text-xs mt-1">
                                            <span className="text-gray-600">{cert.emissor}</span>
                                            <span className="font-semibold text-gray-400">{cert.ano_obtencao}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
