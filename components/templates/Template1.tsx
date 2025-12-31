import React from 'react';
import { CurriculoData, Customizacao } from '@/lib/types';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

interface TemplateProps {
    data: CurriculoData;
    customizacao: Customizacao;
}

export default function Template1({ data, customizacao }: TemplateProps) {
    const { cores, fonte, espacamento } = customizacao;

    // Dynamic style variables
    const containerStyle = {
        '--color-primary': cores.primaria,
        '--color-secondary': cores.secundaria,
        '--color-text': cores.texto,
        fontFamily: fonte,
    } as React.CSSProperties;

    const spacingClass = {
        'compacto': 'gap-2',
        'normal': 'gap-4',
        'amplo': 'gap-6'
    }[espacamento];

    const pyClass = {
        'compacto': 'py-1',
        'normal': 'py-2',
        'amplo': 'py-3'
    }[espacamento];

    return (
        <>
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

            <div
                className="w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto flex overflow-hidden text-sm"
                style={{
                    ...containerStyle,
                    printColorAdjust: 'exact',
                    WebkitPrintColorAdjust: 'exact'
                }}
                id="resume-content"
            >
                {/* Left Sidebar */}
                <div
                    className="w-1/3 text-white p-6 flex flex-col gap-6"
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white'
                    }}
                >
                    <div className="text-center">
                        {data.pessoal.foto_url && (
                            <img
                                src={data.pessoal.foto_url}
                                alt="Foto"
                                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white/20"
                            />
                        )}
                        <h2 className="text-lg font-bold">Contato</h2>
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> <span>{data.pessoal.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" /> <span>{data.pessoal.telefone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> <span>{data.pessoal.localizacao}</span>
                        </div>
                        {data.pessoal.linkedin && (
                            <div className="flex items-center gap-2">
                                <Linkedin className="w-4 h-4" /> <span>{data.pessoal.linkedin}</span>
                            </div>
                        )}
                    </div>

                    {customizacao.secoes_visiveis.skills && data.skills.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold border-b border-white/30 pb-1 mb-2">Habilidades</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="bg-white/20 px-2 py-1 rounded text-xs">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.idiomas && data.idiomas.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold border-b border-white/30 pb-1 mb-2">Idiomas</h2>
                            <div className="flex flex-col gap-2">
                                {data.idiomas.map((lang, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span>{lang.idioma}</span>
                                        <span className="opacity-90">{lang.nivel}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="w-2/3 p-8 flex flex-col" style={{ color: 'var(--color-text)' }}>
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                            {data.pessoal.nome} <span style={{ color: 'var(--color-secondary)' }}>{data.pessoal.sobrenome}</span>
                        </h1>
                    </div>

                    {customizacao.secoes_visiveis.perfil && (
                        <div className={`mb-6 ${spacingClass}`}>
                            <h3 className="text-lg font-bold uppercase border-b-2 pb-1 mb-2" style={{ borderColor: 'var(--color-secondary)' }}>Resumo</h3>
                            <p className="text-justify leading-relaxed">{data.resumo}</p>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.experiencias && data.experiencias.length > 0 && (
                        <div className={`mb-6`}>
                            <h3 className="text-lg font-bold uppercase border-b-2 pb-1 mb-3" style={{ borderColor: 'var(--color-secondary)' }}>Experiência Profissional</h3>
                            <div className={`flex flex-col ${spacingClass}`}>
                                {data.experiencias.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-base">{exp.cargo}</h4>
                                            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded">{exp.periodo}</span>
                                        </div>
                                        <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-secondary)' }}>{exp.empresa}</div>

                                        {exp.formato === 'topicos' ? (
                                            <ul className="list-disc list-inside text-sm pl-2">
                                                {exp.descricao.split('•').filter(Boolean).map((line, idx) => (
                                                    <li key={idx}>{line.trim()}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm mb-2 whitespace-pre-line">{exp.descricao}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.certificacoes && data.certificacoes && (
                        <div className={`mb-6`}>
                            <h3 className="text-lg font-bold uppercase border-b-2 pb-1 mb-3" style={{ borderColor: 'var(--color-secondary)' }}>Certificações</h3>
                            <p className="text-sm whitespace-pre-line">{data.certificacoes}</p>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.educacao && data.educacao.length > 0 && (
                        <div className={`mb-6`}>
                            <h3 className="text-lg font-bold uppercase border-b-2 pb-1 mb-3" style={{ borderColor: 'var(--color-secondary)' }}>Educação</h3>
                            <div className="flex flex-col gap-3">
                                {data.educacao.map((edu, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold">{edu.curso}</h4>
                                            <span className="text-xs">{edu.periodo}</span>
                                        </div>
                                        <div className="opacity-75">{edu.instituicao}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}