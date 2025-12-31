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
        '--color-text': '#333',
        fontFamily: fonte,
    } as React.CSSProperties;

    return (
        <div
            className="w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto p-12 text-sm flex flex-col"
            style={containerStyle}
        >
            {/* Minimal Header */}
            <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-light tracking-tight">{data.pessoal.nome}</h1>
                    <h1 className="text-5xl font-bold tracking-tight">{data.pessoal.sobrenome}</h1>
                </div>
                <div className="text-right text-xs leading-loose">
                    <div>{data.pessoal.email}</div>
                    <div>{data.pessoal.telefone}</div>
                    <div>{data.pessoal.localizacao}</div>
                </div>
            </div>

            <div className="flex gap-12">
                {/* Left Col */}
                <div className="w-1/4 space-y-8">
                    {customizacao.secoes_visiveis.skills && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-3 border-b pb-1">Habilidades</h3>
                            <ul className="space-y-1 text-xs">
                                {data.skills.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.idiomas && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-3 border-b pb-1">Idiomas</h3>
                            <ul className="space-y-1 text-xs">
                                {data.idiomas.map((l, i) => <li key={i}>{l.idioma} - {l.nivel}</li>)}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Col (Main) */}
                <div className="flex-1 space-y-8">
                    <div>
                        <h3 className="font-bold uppercase tracking-widest text-xs mb-4 border-b border-black pb-1">Perfil</h3>
                        <p className="text-justify text-gray-600">{data.resumo}</p>
                    </div>

                    {customizacao.secoes_visiveis.experiencias && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-4 border-b border-black pb-1">Experiência</h3>
                            <div className="space-y-6">
                                {data.experiencias.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-base">{exp.cargo}</h4>
                                            <span className="text-xs italic">{exp.periodo}</span>
                                        </div>
                                        <div className="text-xs uppercase tracking-wide mb-2">{exp.empresa}</div>
                                        {exp.formato === 'topicos' ? (
                                            <ul className="list-disc list-inside text-gray-600 pl-2">
                                                {exp.descricao.split('•').filter(Boolean).map((line, idx) => (
                                                    <li key={idx}>{line.trim()}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-600 whitespace-pre-line">{exp.descricao}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.certificacoes && data.certificacoes && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-4 border-b border-black pb-1">Certificações</h3>
                            <p className="text-gray-600 whitespace-pre-line text-sm">{data.certificacoes}</p>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.educacao && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-4 border-b border-black pb-1">Educação</h3>
                            <div className="space-y-4">
                                {data.educacao.map((edu, i) => (
                                    <div key={i}>
                                        <h4 className="font-bold">{edu.instituicao}</h4>
                                        <div>{edu.curso}</div>
                                        <div className="text-xs text-gray-500">{edu.periodo}</div>
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
