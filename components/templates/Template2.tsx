import React from 'react';
import { CurriculoData, Customizacao } from '@/lib/types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface TemplateProps {
    data: CurriculoData;
    customizacao: Customizacao;
}

export default function Template2({ data, customizacao }: TemplateProps) {
    const { cores, fonte, espacamento } = customizacao;

    const containerStyle = {
        '--color-primary': cores.primaria,
        '--color-secondary': cores.secundaria,
        '--color-text': cores.texto,
        fontFamily: fonte,
    } as React.CSSProperties;

    const spacingClass = {
        'compacto': 'gap-3',
        'normal': 'gap-5',
        'amplo': 'gap-8'
    }[espacamento];

    return (
        <div
            className="w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto flex flex-col text-sm"
            style={containerStyle}
        >
            {/* Heavy Header */}
            <div
                className="text-white p-8 flex items-center justify-between"
                style={{ backgroundColor: 'var(--color-primary)' }}
            >
                <div>
                    <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{data.pessoal.nome}</h1>
                    <h2 className="text-2xl font-light opacity-90">{data.pessoal.sobrenome}</h2>
                    <p className="mt-4 max-w-md opacity-80 text-sm">{data.resumo}</p>
                </div>
                {data.pessoal.foto_url && (
                    <img
                        src={data.pessoal.foto_url}
                        alt="Foto"
                        className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                )}
            </div>

            {/* Info Bar */}
            <div className="bg-gray-100 p-4 flex justify-around text-gray-700 font-medium text-xs border-b border-gray-200">
                <div className="flex items-center gap-1"><Mail size={14} /> {data.pessoal.email}</div>
                <div className="flex items-center gap-1"><Phone size={14} /> {data.pessoal.telefone}</div>
                <div className="flex items-center gap-1"><MapPin size={14} /> {data.pessoal.localizacao}</div>
            </div>

            {/* Two Columns Body */}
            <div className="flex flex-1 p-8 gap-8">

                {/* Main Column */}
                <div className={`w-2/3 flex flex-col ${spacingClass}`}>
                    {customizacao.secoes_visiveis.experiencias && (
                        <div>
                            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                                <span className="w-2 h-8 rounded" style={{ backgroundColor: 'var(--color-secondary)' }}></span>
                                Experiência
                            </h3>
                            <div className="flex flex-col gap-6">
                                {data.experiencias.map((exp, i) => (
                                    <div key={i} className="relative pl-4 border-l-2 border-gray-200">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
                                        <h4 className="font-bold text-lg">{exp.cargo}</h4>
                                        <div className="text-sm font-semibold text-gray-500 mb-1">{exp.empresa} | {exp.periodo}</div>
                                        {exp.formato === 'topicos' ? (
                                            <ul className="list-disc list-inside text-gray-600 pl-2">
                                                {exp.descricao.split('•').filter(Boolean).map((line, idx) => (
                                                    <li key={idx}>{line.trim()}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-600 mb-2 whitespace-pre-line">{exp.descricao}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.certificacoes && data.certificacoes && (
                        <div>
                            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                                <span className="w-2 h-8 rounded" style={{ backgroundColor: 'var(--color-secondary)' }}></span>
                                Certificações
                            </h3>
                            <p className="whitespace-pre-line text-gray-600">{data.certificacoes}</p>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.educacao && (
                        <div>
                            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                                <span className="w-2 h-8 rounded" style={{ backgroundColor: 'var(--color-secondary)' }}></span>
                                Educação
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {data.educacao.map((edu, i) => (
                                    <div key={i} className="flex flex-col">
                                        <h4 className="font-bold">{edu.curso}</h4>
                                        <div className="text-gray-500">{edu.instituicao}</div>
                                        <div className="text-xs text-gray-400">{edu.periodo}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Side Column */}
                <div className={`w-1/3 flex flex-col ${spacingClass}`}>
                    {customizacao.secoes_visiveis.skills && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-primary)' }}>Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-600 shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.idiomas && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-primary)' }}>Idiomas</h3>
                            <ul className="space-y-2">
                                {data.idiomas.map((lang, i) => (
                                    <li key={i} className="flex justify-between border-b border-gray-200 pb-1 last:border-0">
                                        <span>{lang.idioma}</span>
                                        <span className="font-bold" style={{ color: 'var(--color-secondary)' }}>{lang.nivel}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
