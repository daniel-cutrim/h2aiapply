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

    // Define consistent spacing classes
    const gapClass = {
        'compacto': 'gap-2',
        'normal': 'gap-4',
        'amplo': 'gap-6'
    }[espacamento];

    const sidebarGapClass = {
        'compacto': 'gap-4',
        'normal': 'gap-8',
        'amplo': 'gap-12'
    }[espacamento];

    const mbClass = {
        'compacto': 'mb-3',
        'normal': 'mb-6',
        'amplo': 'mb-8'
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
                    className={`w-1/3 text-white p-6 flex flex-col ${sidebarGapClass}`}
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white'
                    }}
                >
                    <div className="text-center w-full flex flex-col gap-4">
                        {/* Header / Sidebar Top */}
                        <div className="flex flex-col items-center">
                            {data.pessoal.foto_url && (
                                <img
                                    src={data.pessoal.foto_url}
                                    alt="Profile"
                                    className={`w-32 h-32 object-cover mb-4 border-2 border-white/20 ${customizacao.modelo_foto === 'circular' ? 'rounded-full' : 'rounded-lg'}`}
                                />
                            )}
                        </div>

                        <div className="flex flex-col gap-3 text-sm">
                            <h2 className="text-lg font-bold">Contact</h2>
                            <div className="flex items-center gap-2 break-all">
                                <Mail className="w-4 h-4 shrink-0" /> <span>{data.pessoal.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 shrink-0" /> <span>{data.pessoal.telefone}</span>
                            </div>
                            {data.pessoal.localizacao && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 shrink-0" /> <span>{data.pessoal.localizacao}</span>
                                </div>
                            )}
                            {data.pessoal.linkedin && (
                                <div className="flex items-center gap-2 break-all">
                                    <Linkedin className="w-4 h-4 shrink-0" /> <span>{data.pessoal.linkedin}</span>
                                </div>
                            )}
                        </div>

                        {customizacao.secoes_visiveis.skills && data.skills.length > 0 && (
                            <div className="mt-4">
                                <h2 className="text-lg font-bold border-b border-white/30 pb-1 mb-2">Skills</h2>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {data.skills.map((skill, i) => (
                                        <span key={i} className="bg-white/20 px-2 py-1 rounded text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {customizacao.secoes_visiveis.idiomas && data.idiomas.length > 0 && (
                            <div className="mt-4">
                                <h2 className="text-lg font-bold border-b border-white/30 pb-1 mb-2">Languages</h2>
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
                </div>

                {/* Main Content */}
                <div className="w-2/3 p-8 flex flex-col" style={{ color: 'var(--color-text)' }}>
                    <div className={mbClass}>
                        <h1 className="text-3xl font-bold uppercase tracking-wider leading-tight" style={{ color: 'var(--color-primary)' }}>
                            {data.pessoal.nome} <span style={{ color: 'var(--color-secondary)' }}>{data.pessoal.sobrenome}</span>
                        </h1>
                        <p className="text-lg font-medium mt-1 opacity-80">{data.pessoal.cargo}</p>
                    </div>

                    {customizacao.secoes_visiveis.perfil && (
                        <div className={`${mbClass} flex flex-col ${gapClass}`}>
                            <h3 className="text-lg font-bold uppercase border-b-2 pb-1" style={{ borderColor: 'var(--color-secondary)' }}>Profile</h3>
                            <p className="text-justify leading-relaxed whitespace-pre-line">{data.resumo}</p>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.experiencias && data.experiencias.length > 0 && (
                        <div className={mbClass}>
                            <h3 className="text-lg font-bold uppercase border-b-2 pb-1 mb-3" style={{ borderColor: 'var(--color-secondary)' }}>Work Experience</h3>
                            <div className={`flex flex-col ${gapClass}`}>
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
                                            <p className="text-sm mb-2 whitespace-pre-line text-justify">{exp.descricao}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.certificacoes && data.certificacoes && (
                        <div className={`${mbClass} flex flex-col ${gapClass}`}>
                            <h3 className="text-lg font-bold uppercase border-b-2 pb-1" style={{ borderColor: 'var(--color-secondary)' }}>Certifications</h3>
                            <p className="text-sm whitespace-pre-line">{data.certificacoes}</p>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.educacao && data.educacao.length > 0 && (
                        <div className={`${mbClass} flex flex-col ${gapClass}`}>
                            <h3 className="text-lg font-bold uppercase border-b-2 pb-1" style={{ borderColor: 'var(--color-secondary)' }}>Education</h3>
                            <p className="whitespace-pre-line opacity-80">{data.educacao}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}