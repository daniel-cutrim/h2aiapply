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
            className="w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto flex flex-col text-sm print:print-color-adjust-exact"
            style={{ ...containerStyle, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
        >
            {/* Heavy Header */}
            <div className="bg-[var(--color-primary)] rounded-xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-6">
                    {data.pessoal.foto_url && (
                        <img
                            src={data.pessoal.foto_url}
                            alt="Profile"
                            className={`w-32 h-32 object-cover border-4 border-white/20 shadow-md ${customizacao.modelo_foto === 'circular' ? 'rounded-full' : 'rounded-lg'}`}
                        />
                    )}
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase">{data.pessoal.nome} {data.pessoal.sobrenome}</h1>
                        <p className="text-xl opacity-90 font-medium tracking-widest">{data.pessoal.cargo}</p>
                    </div>
                </div>
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
                                Work Experience
                            </h3>
                            <div className="flex flex-col gap-6">
                                {data.experiencias.map((exp, i) => (
                                    <div key={i} className="relative pl-4 border-l-2 border-gray-200">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
                                        <h4 className="font-bold text-lg">{exp.cargo}</h4>
                                        <div className="text-sm font-semibold text-gray-700 mb-1 flex flex-wrap gap-2">
                                            <span>{exp.empresa}</span>
                                            <span>|</span>
                                            <span>{exp.ano_inicio} - {exp.ano_fim || 'Atualmente'}</span>
                                            {exp.localizacao && (
                                                <>
                                                    <span>|</span>
                                                    <span className="italic">{exp.localizacao}</span>
                                                </>
                                            )}
                                        </div>
                                        {exp.formato === 'topicos' ? (
                                            <ul className="list-disc list-inside text-gray-800 pl-2">
                                                {exp.descricao.split('•').filter(Boolean).map((line, idx) => (
                                                    <li key={idx}>{line.trim()}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-800 mb-2 whitespace-pre-line">{exp.descricao}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.certificacoes && Array.isArray(data.certificacoes) && data.certificacoes.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                                <span className="w-2 h-8 rounded" style={{ backgroundColor: 'var(--color-secondary)' }}></span>
                                Certifications
                            </h3>
                            <div className="grid gap-3">
                                {data.certificacoes.map((cert, i) => (
                                    <div key={i} className="bg-gray-50 p-3 rounded-lg border-l-4" style={{ borderColor: 'var(--color-secondary)' }}>
                                        <div className="font-bold text-gray-900">{cert.nome}</div>
                                        <div className="text-sm text-gray-600">{cert.emissor} • {cert.ano_obtencao}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.educacao && Array.isArray(data.educacao) && data.educacao.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                                <span className="w-2 h-8 rounded" style={{ backgroundColor: 'var(--color-secondary)' }}></span>
                                Education
                            </h3>
                            <div className="flex flex-col gap-4">
                                {data.educacao.map((edu, i) => (
                                    <div key={i}>
                                        <h4 className="font-bold text-lg">{edu.grau}</h4>
                                        <div className="text-gray-700 font-medium">{edu.instituicao}</div>
                                        <div className="text-sm text-gray-500">{edu.ano_inicio} - {edu.ano_fim || 'Atualmente'}</div>
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
                                    <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-800 shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {customizacao.secoes_visiveis.idiomas && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-primary)' }}>Languages</h3>
                            <ul className="space-y-2">
                                {data.idiomas.map((lang, i) => (
                                    <li key={i} className="flex justify-between border-b border-gray-200 pb-1 last:border-0">
                                        <span className="text-gray-900">{lang.idioma}</span>
                                        <span className="font-bold text-gray-800" style={{ color: 'var(--color-secondary)' }}>{lang.nivel}</span>
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
