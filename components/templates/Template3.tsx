import React from 'react';
import { CurriculoData, Customizacao } from '@/lib/types';

interface TemplateProps {
    data: CurriculoData;
    customizacao: Customizacao;
}

export default function Template3({ data, customizacao }: TemplateProps) {
    const { cores, fonte, espacamento } = customizacao;

    const containerStyle = {
        '--color-primary': 'black', // Force minimalist black/gray mostly, or use custom but subtle
        '--color-secondary': '#666',
        '--color-text': '#000',
        fontFamily: fonte,
    } as React.CSSProperties;

    const spacingClass = {
        'compacto': 'space-y-4',
        'normal': 'space-y-8',
        'amplo': 'space-y-12'
    }[espacamento];

    return (
        <div
            className="w-[210mm] min-h-[297mm] bg-white shadow-xl mx-auto p-12 text-sm flex flex-col print:shadow-none print:print-color-adjust-exact text-black relative overflow-hidden"
            style={{ ...containerStyle, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', border: '1px solid #e5e7eb' }}
        >
            {/* Background Image Layer */}
            {customizacao.imagem_fundo?.url && (
                <div
                    className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
                    style={{
                        clipPath: customizacao.imagem_fundo.tipo === 'lateral_esquerda' ? 'polygon(0 0, 30% 0, 30% 100%, 0 100%)' :
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

            {/* Minimal Header */}
            <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end relative z-10">
                <div className="flex items-center gap-6">
                    {data.pessoal.foto_url && (
                        <img
                            src={data.pessoal.foto_url}
                            alt="Foto"
                            className={`w-32 h-32 object-cover border border-gray-200 shadow-sm ${customizacao.modelo_foto === 'circular' ? 'rounded-full' : 'rounded-lg'}`}
                        />
                    )}
                    <div>
                        <h1 className="text-5xl font-light tracking-tight">{data.pessoal.nome}</h1>
                        <h1 className="text-5xl font-bold tracking-tight">{data.pessoal.sobrenome}</h1>
                    </div>
                </div>
                <div className="text-right text-xs leading-loose">
                    <div>{data.pessoal.email}</div>
                    <div>{data.pessoal.telefone}</div>
                    <div>{data.pessoal.localizacao}</div>
                </div>
            </div>

            <div className="flex gap-12 relative z-10">
                {/* Left Col */}
                <div className={`w-1/4 ${spacingClass}`}>
                    {customizacao.secoes_visiveis.skills && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-3 border-b pb-1">Skills</h3>
                            <ul className="space-y-1 text-xs">
                                {data.skills.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.idiomas && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-3 border-b pb-1">Languages</h3>
                            <ul className="space-y-1 text-xs">
                                {data.idiomas.map((l, i) => <li key={i}>{l.idioma} - {l.nivel}</li>)}
                            </ul>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.educacao && Array.isArray(data.educacao) && data.educacao.length > 0 && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-3 border-b pb-1">Education</h3>
                            <div className="space-y-4">
                                {data.educacao.map((edu, i) => (
                                    <div key={i}>
                                        <div className="font-bold text-xs text-gray-900">{edu.grau}</div>
                                        <div className="text-[10px] text-gray-600 uppercase">{edu.instituicao}</div>
                                        <div className="text-[10px] text-gray-500 italic mt-0.5">{edu.ano_inicio} - {edu.ano_fim || 'Atualmente'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.certificacoes && Array.isArray(data.certificacoes) && data.certificacoes.length > 0 && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-3 border-b pb-1">Certifications</h3>
                            <div className="space-y-3">
                                {data.certificacoes.map((cert, i) => (
                                    <div key={i}>
                                        <div className="font-bold text-xs">{cert.nome}</div>
                                        <div className="text-[10px] text-gray-600 uppercase">{cert.emissor}</div>
                                        <div className="text-[10px] text-gray-500">{cert.ano_obtencao}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Col (Main) */}
                <div className={`flex-1 ${spacingClass}`}>
                    <div>
                        <h3 className="font-bold uppercase tracking-widest text-xs mb-4 border-b border-black pb-1">Profile</h3>
                        <p className="text-justify text-gray-900">{data.resumo}</p>
                    </div>

                    {customizacao.secoes_visiveis.experiencias && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-4 border-b border-black pb-1">Work Experience</h3>
                            <div className="space-y-6">
                                {data.experiencias.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-base">{exp.cargo}</h4>
                                            <span className="text-xs italic">{exp.ano_inicio} - {exp.ano_fim || 'Atualmente'}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-xs uppercase tracking-wide">{exp.empresa}</div>
                                            {exp.localizacao && <div className="text-[10px] text-gray-500">{exp.localizacao}</div>}
                                        </div>
                                        {exp.formato === 'topicos' ? (
                                            <ul className="list-disc list-inside text-gray-900 pl-2">
                                                {exp.descricao.split('•').filter(Boolean).map((line, idx) => (
                                                    <li key={idx}>{line.trim()}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-900 whitespace-pre-line">{exp.descricao}</p>
                                        )}
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
