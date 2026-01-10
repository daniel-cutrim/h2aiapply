import { useState } from 'react';
import { useCurriculoStore } from '@/store/curriculoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Type, Layout } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function EditPanel() {
    const { curriculo, updateDados, updateCustomizacao, setTemplate, isSaving } = useCurriculoStore();
    const [activeTab, setActiveTab] = useState('conteudo');
    const { t } = useTranslation();

    if (!curriculo) return null;

    const { dados, customizacao } = curriculo;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            <div className="border-b px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                <h2 className="font-semibold text-gray-700 dark:text-gray-200">{t('editor.title')}</h2>
                {isSaving && <span className="text-xs text-green-600 font-medium">{t('editor.saving')}</span>}
            </div>

            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                {/* Simple Custom Tabs Implementation for now to save file creation count if needed, or use proper component if I create shared Tabs */}
                <div className="flex gap-2 border-b mb-6 pb-2 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab('conteudo')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'conteudo' ? 'bg-slate-900 text-white dark:bg-[#fe4a21]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                    >
                        {t('editor.tabs.content')}
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'design' ? 'bg-slate-900 text-white dark:bg-[#fe4a21]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                    >
                        {t('editor.tabs.design')}
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'templates' ? 'bg-slate-900 text-white dark:bg-[#fe4a21]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                    >
                        {t('editor.tabs.templates')}
                    </button>
                </div>

                {activeTab === 'conteudo' && (
                    <div className="space-y-6">
                        <div className="space-y-6">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('editor.personal.title')}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-900 dark:text-gray-300">{t('editor.personal.name')}</Label>
                                    <Input
                                        className="text-gray-900 bg-white dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                        value={dados.pessoal.nome || ''}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, nome: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900 dark:text-gray-300">{t('editor.personal.surname')}</Label>
                                    <Input
                                        className="text-gray-900 bg-white dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                        value={dados.pessoal.sobrenome || ''}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, sobrenome: e.target.value } })}
                                    />
                                </div>
                            </div>

                            {/* Photo Upload Section */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label className="text-gray-900 dark:text-gray-300">{t('editor.personal.photo')}</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            className="text-gray-900 bg-white dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 text-xs file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900 dark:file:text-violet-300"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        updateDados({ pessoal: { ...dados.pessoal, foto_url: reader.result as string } });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        {dados.pessoal.foto_url && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => updateDados({ pessoal: { ...dados.pessoal, foto_url: '' } })}
                                                title="Remover foto"
                                            >
                                                <span className="sr-only">Remover</span>
                                                &times;
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900 dark:text-gray-300">{t('editor.personal.photoFormat')}</Label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateCustomizacao({ modelo_foto: 'circular' })}
                                            className={`flex-1 py-2 text-xs border rounded transition-all ${customizacao.modelo_foto === 'circular' ? 'bg-slate-900 text-white border-slate-900 dark:bg-[#fe4a21] dark:border-[#fe4a21]' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 dark:hover:bg-slate-700'}`}
                                        >
                                            {t('editor.personal.circular')}
                                        </button>
                                        <button
                                            onClick={() => updateCustomizacao({ modelo_foto: 'quadrado' })}
                                            className={`flex-1 py-2 text-xs border rounded transition-all ${customizacao.modelo_foto === 'quadrado' ? 'bg-slate-900 text-white border-slate-900 dark:bg-[#fe4a21] dark:border-[#fe4a21]' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 dark:hover:bg-slate-700'}`}
                                        >
                                            {t('editor.personal.square')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label className="text-gray-900 dark:text-gray-300">{t('editor.personal.email')}</Label>
                                    <Input
                                        className="text-gray-900 bg-white dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                        value={dados.pessoal.email || ''}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, email: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900 dark:text-gray-300">{t('editor.personal.phone')}</Label>
                                    <Input
                                        className="text-gray-900 bg-white dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                        value={dados.pessoal.telefone || ''}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, telefone: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-gray-900 dark:text-gray-300">{t('editor.personal.location')}</Label>
                                    <Input
                                        className="text-gray-900 bg-white dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                        value={dados.pessoal.localizacao || ''}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, localizacao: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-gray-900 dark:text-gray-300">{t('editor.personal.summary')}</Label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                    value={dados.resumo || ''}
                                    onChange={(e) => updateDados({ resumo: e.target.value })}
                                />
                            </div>


                        </div>


                        {/* Skills - Habilidades */}
                        <div className="space-y-4 pt-4 border-t dark:border-slate-700">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('editor.skills.title')}</h3>
                            <p className="text-xs text-gray-700 dark:text-gray-400">{t('editor.skills.hint')}</p>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                value={dados.skills.join('\n')}
                                onChange={(e) => updateDados({ skills: e.target.value.split('\n') })}
                                placeholder="React&#10;Node.js&#10;TypeScript"
                            />
                        </div>

                        {/* Educação */}
                        <div className="space-y-4 pt-4 border-t dark:border-slate-700">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('editor.education.title')}</h3>
                            <p className="text-xs text-gray-700 dark:text-gray-400">{t('editor.education.hint')}</p>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                value={typeof dados.educacao === 'string' ? dados.educacao : ''}
                                onChange={(e) => updateDados({ educacao: e.target.value })}
                                placeholder="Bachelor's Degree&#10;University Name&#10;2020 - 2024"
                            />
                        </div>


                        {/* Experiências */}
                        <div className="space-y-4 pt-4 border-t dark:border-slate-700">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('editor.experience.title')}</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-black border-black hover:bg-gray-100 dark:text-white dark:border-gray-500 dark:bg-transparent dark:hover:bg-slate-800"
                                    onClick={() => {
                                        const newExp = [
                                            ...(dados.experiencias || []),
                                            {
                                                id: crypto.randomUUID(),
                                                empresa: 'Nova Empresa',
                                                cargo: 'Cargo',
                                                periodo: '2023 - Atual',
                                                descricao: 'Descrição das atividades...',
                                                formato: 'texto' as const
                                            }
                                        ];
                                        updateDados({ experiencias: newExp });
                                    }}
                                >
                                    {t('editor.experience.add')}
                                </Button>
                            </div>

                            {(dados.experiencias || []).map((exp, index) => (
                                <div key={exp.id || index} className="space-y-3 p-4 border rounded-lg bg-gray-50 relative group dark:bg-slate-800 dark:border-slate-700">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 h-6 px-2 dark:hover:bg-red-900/20"
                                            onClick={() => {
                                                const newExp = [...dados.experiencias];
                                                newExp.splice(index, 1);
                                                updateDados({ experiencias: newExp });
                                            }}
                                        >
                                            {t('editor.experience.delete')}
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-900 dark:text-gray-300">{t('editor.experience.role')}</Label>
                                            <Input
                                                className="text-gray-900 bg-white dark:bg-slate-900 dark:text-gray-100 dark:border-slate-600"
                                                value={exp.cargo}
                                                onChange={(e) => {
                                                    const newExp = [...dados.experiencias];
                                                    newExp[index] = { ...exp, cargo: e.target.value };
                                                    updateDados({ experiencias: newExp });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-900 dark:text-gray-300">{t('editor.experience.company')}</Label>
                                            <Input
                                                className="text-gray-900 bg-white dark:bg-slate-900 dark:text-gray-100 dark:border-slate-600"
                                                value={exp.empresa}
                                                onChange={(e) => {
                                                    const newExp = [...dados.experiencias];
                                                    newExp[index] = { ...exp, empresa: e.target.value };
                                                    updateDados({ experiencias: newExp });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-900 dark:text-gray-300">{t('editor.experience.period')}</Label>
                                        <Input
                                            className="text-gray-900 bg-white dark:bg-slate-900 dark:text-gray-100 dark:border-slate-600"
                                            value={exp.periodo}
                                            onChange={(e) => {
                                                const newExp = [...dados.experiencias];
                                                newExp[index] = { ...exp, periodo: e.target.value };
                                                updateDados({ experiencias: newExp });
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <Label className="text-xs text-gray-900 dark:text-gray-300">{t('editor.experience.description')}</Label>
                                            <div className="flex bg-slate-200 rounded p-0.5 dark:bg-slate-700">
                                                <button
                                                    className={`px-2 py-0.5 text-[10px] rounded ${exp.formato === 'texto' ? 'bg-white shadow text-black dark:bg-slate-900 dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}
                                                    onClick={() => {
                                                        const newExp = [...dados.experiencias];
                                                        newExp[index] = { ...exp, formato: 'texto', descricao: exp.descricao.replace(/• /g, '').replace(/\n/g, ' ') };
                                                        updateDados({ experiencias: newExp });
                                                    }}
                                                >
                                                    H2B ({t('editor.experience.description')})
                                                </button>
                                                <button
                                                    className={`px-2 py-0.5 text-[10px] rounded ${exp.formato === 'topicos' ? 'bg-white shadow text-black dark:bg-slate-900 dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}
                                                    onClick={() => {
                                                        const newExp = [...dados.experiencias];
                                                        let newDesc = exp.descricao;
                                                        // Convert only if coming from text to topics, or force formatting
                                                        if (exp.formato === 'texto' || exp.formato === 'topicos') {
                                                            // Split by newline to respect user's line breaks
                                                            const lines = newDesc.split('\n');
                                                            newDesc = lines
                                                                .map(l => l.trim())
                                                                .filter(Boolean)
                                                                .map(l => l.startsWith('•') ? l : `• ${l}`)
                                                                .join('\n');
                                                        }
                                                        newExp[index] = { ...exp, formato: 'topicos', descricao: newDesc };
                                                        updateDados({ experiencias: newExp });
                                                    }}
                                                >
                                                    H2A (Bullets)
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            className="min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:bg-slate-900 dark:text-gray-100 dark:border-slate-600"
                                            value={exp.descricao}
                                            onChange={(e) => {
                                                const newExp = [...dados.experiencias];
                                                newExp[index] = { ...exp, descricao: e.target.value };
                                                updateDados({ experiencias: newExp });
                                            }}
                                            onKeyDown={(e) => {
                                                if (exp.formato === 'topicos' && e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const textarea = e.currentTarget;
                                                    const start = textarea.selectionStart;
                                                    const end = textarea.selectionEnd;
                                                    const value = textarea.value;
                                                    const newValue = value.substring(0, start) + '\n• ' + value.substring(end);

                                                    const newExp = [...dados.experiencias];
                                                    newExp[index] = { ...exp, descricao: newValue };
                                                    updateDados({ experiencias: newExp });

                                                    // Need to set cursor position after render, but React state update is async.
                                                    // This is a bit advanced for a simple textarea. 
                                                    // But let's try a simple approach: setTimeout?
                                                    setTimeout(() => {
                                                        textarea.selectionStart = textarea.selectionEnd = start + 3;
                                                    }, 0);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Certificações */}
                        <div className="space-y-4 pt-4 border-t dark:border-slate-700">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('editor.certifications.title')}</h3>
                            <p className="text-xs text-gray-700 dark:text-gray-400">{t('editor.certifications.hint')}</p>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                value={typeof dados.certificacoes === 'string' ? dados.certificacoes : ''}
                                onChange={(e) => updateDados({ certificacoes: e.target.value })}
                                placeholder="Bachelor's Degree&#10;Unifael&#10;Completed in 2025"
                            />
                        </div>

                        {/* Idiomas */}
                        <div className="space-y-4 pt-4 border-t dark:border-slate-700">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('editor.languages.title')}</h3>
                            <div className="grid gap-4">
                                {(dados.idiomas || []).map((lang, index) => (
                                    <div key={lang.idioma} className="flex items-center justify-between border p-3 rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                                        <span className="font-medium text-black dark:text-gray-200">{lang.idioma}</span>
                                        <div className="w-[180px]">
                                            <select
                                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:bg-slate-900 dark:text-gray-100 dark:border-slate-600"
                                                value={lang.nivel}
                                                onChange={(e) => {
                                                    const newIdiomas = [...(dados.idiomas || [])];
                                                    if (!newIdiomas[index]) return;
                                                    newIdiomas[index] = { ...newIdiomas[index], nivel: e.target.value as any };
                                                    updateDados({ idiomas: newIdiomas });
                                                }}
                                            >
                                                <option value="">{t('editor.languages.select')}</option>
                                                <option value="Studying">{t('editor.languages.levels.studying')}</option>
                                                <option value="Basic">{t('editor.languages.levels.basic')}</option>
                                                <option value="Intermediate">{t('editor.languages.levels.intermediate')}</option>
                                                <option value="Advanced">{t('editor.languages.levels.advanced')}</option>
                                                <option value="Native">{t('editor.languages.levels.native')}</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                {(!dados.idiomas || dados.idiomas.length === 0) && (
                                    <Button
                                        variant="outline"
                                        className="dark:text-white dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                                        onClick={() => updateDados({
                                            idiomas: [
                                                { idioma: 'Portuguese', nivel: '' },
                                                { idioma: 'English', nivel: '' },
                                                { idioma: 'Spanish', nivel: '' }
                                            ]
                                        })}
                                    >
                                        {t('editor.languages.init')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => setTemplate('template_1')}
                            className={`p-4 border rounded-lg text-left transition-all ${curriculo.template_id === 'template_1' ? 'ring-2 ring-[#fe4a21] border-transparent' : 'hover:border-[#fe4a21]/50'}`}
                        >
                            <div className="font-bold text-gray-900 dark:text-white">Profissional Moderno</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">Sidebar azul e layout de 2 colunas.</div>
                        </button>
                        <button
                            onClick={() => setTemplate('template_2')}
                            className={`p-4 border rounded-lg text-left transition-all ${curriculo.template_id === 'template_2' ? 'ring-2 ring-[#fe4a21] border-transparent' : 'hover:border-[#fe4a21]/50'}`}
                        >
                            <div className="font-bold text-gray-900 dark:text-white">Criativo Bold</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">Header largo e cores vibrantes.</div>
                        </button>
                        <button
                            onClick={() => setTemplate('template_3')}
                            className={`p-4 border rounded-lg text-left transition-all ${curriculo.template_id === 'template_3' ? 'ring-2 ring-[#fe4a21] border-transparent' : 'hover:border-[#fe4a21]/50'}`}
                        >
                            <div className="font-bold text-gray-900 dark:text-white">Minimalista Clean</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">Preto e branco, foco no conteúdo.</div>
                        </button>
                    </div>
                )}

                {activeTab === 'design' && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('editor.design.colors')}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-900 dark:text-gray-300">{t('editor.design.primary')}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={customizacao.cores.primaria || '#000000'}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, primaria: e.target.value } })}
                                            className="w-12 h-10 p-1 dark:bg-slate-700 dark:border-slate-600"
                                        />
                                        <Input
                                            type="text"
                                            className="text-gray-900 bg-white dark:bg-slate-900 dark:text-gray-100 dark:border-slate-600"
                                            value={customizacao.cores.primaria || ''}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, primaria: e.target.value } })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900 dark:text-gray-300">{t('editor.design.secondary')}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={customizacao.cores.secundaria || '#000000'}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, secundaria: e.target.value } })}
                                            className="w-12 h-10 p-1 dark:bg-slate-700 dark:border-slate-600"
                                        />
                                        <Input
                                            type="text"
                                            className="text-gray-900 bg-white dark:bg-slate-900 dark:text-gray-100 dark:border-slate-600"
                                            value={customizacao.cores.secundaria || ''}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, secundaria: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('editor.design.spacing')}</h3>
                            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg dark:bg-slate-800">
                                {['compacto', 'normal', 'amplo'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => updateCustomizacao({ espacamento: s as any })}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded uppercase transition-colors ${customizacao.espacamento === s ? 'bg-white shadow text-black dark:bg-slate-600 dark:text-white' : 'text-gray-700 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-700'}`}
                                    >
                                        {s === 'compacto' && t('editor.design.compact')}
                                        {s === 'normal' && t('editor.design.normal')}
                                        {s === 'amplo' && t('editor.design.wide')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
