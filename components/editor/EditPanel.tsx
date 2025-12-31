import { useState } from 'react';
import { useCurriculoStore } from '@/store/curriculoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Type, Layout } from 'lucide-react';

export default function EditPanel() {
    const { curriculo, updateDados, updateCustomizacao, setTemplate, isSaving } = useCurriculoStore();
    const [activeTab, setActiveTab] = useState('conteudo');

    if (!curriculo) return null;

    const { dados, customizacao } = curriculo;

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="border-b px-4 py-3 flex justify-between items-center bg-gray-50">
                <h2 className="font-semibold text-gray-700">Editor</h2>
                {isSaving && <span className="text-xs text-green-600 font-medium">Salvando...</span>}
            </div>

            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                {/* Simple Custom Tabs Implementation for now to save file creation count if needed, or use proper component if I create shared Tabs */}
                <div className="flex gap-2 border-b mb-6 pb-2">
                    <button
                        onClick={() => setActiveTab('conteudo')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'conteudo' ? 'bg-slate-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        Conteúdo
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'design' ? 'bg-slate-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        Design
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'templates' ? 'bg-slate-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        Templates
                    </button>
                </div>

                {activeTab === 'conteudo' && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900">Informações Pessoais</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-900">Nome</Label>
                                    <Input
                                        className="text-gray-900 bg-white"
                                        value={dados.pessoal.nome || ''}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, nome: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900">Sobrenome</Label>
                                    <Input
                                        className="text-gray-900 bg-white"
                                        value={dados.pessoal.sobrenome || ''}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, sobrenome: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900">Email</Label>
                                    <Input
                                        className="text-gray-900 bg-white"
                                        value={dados.pessoal.email || ''}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, email: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900">Telefone</Label>
                                    <Input
                                        className="text-gray-900 bg-white"
                                        value={dados.pessoal.telefone || ''}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, telefone: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-gray-900">Localização (Cidade/País)</Label>
                                    <Input
                                        className="text-gray-900 bg-white"
                                        value={dados.pessoal.localizacao || ''}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, localizacao: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-900">Perfil Profissional</Label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                value={dados.resumo || ''}
                                onChange={(e) => updateDados({ resumo: e.target.value })}
                            />
                        </div>


                        {/* Skills - Habilidades */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-bold text-gray-900">Habilidades</h3>
                            <p className="text-xs text-gray-700">Liste suas habilidades (uma por linha)</p>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                value={dados.skills.join('\n')}
                                onChange={(e) => updateDados({ skills: e.target.value.split('\n') })}
                                placeholder="React&#10;Node.js&#10;TypeScript"
                            />
                        </div>

                        {/* Add more sections for Experience, Education etc. here */}


                        {/* Experiências */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Experiências</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
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
                                    + Adicionar
                                </Button>
                            </div>

                            {(dados.experiencias || []).map((exp, index) => (
                                <div key={exp.id || index} className="space-y-3 p-4 border rounded-lg bg-gray-50 relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 h-6 px-2"
                                            onClick={() => {
                                                const newExp = [...dados.experiencias];
                                                newExp.splice(index, 1);
                                                updateDados({ experiencias: newExp });
                                            }}
                                        >
                                            Excluir
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-900">Cargo</Label>
                                            <Input
                                                className="text-gray-900 bg-white"
                                                value={exp.cargo}
                                                onChange={(e) => {
                                                    const newExp = [...dados.experiencias];
                                                    newExp[index] = { ...exp, cargo: e.target.value };
                                                    updateDados({ experiencias: newExp });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-900">Empresa</Label>
                                            <Input
                                                className="text-gray-900 bg-white"
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
                                        <Label className="text-xs text-gray-900">Período</Label>
                                        <Input
                                            className="text-gray-900 bg-white"
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
                                            <Label className="text-xs text-gray-900">Descrição / Atividades</Label>
                                            <div className="flex bg-slate-200 rounded p-0.5">
                                                <button
                                                    className={`px-2 py-0.5 text-[10px] rounded ${exp.formato === 'texto' ? 'bg-white shadow text-black' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        const newExp = [...dados.experiencias];
                                                        newExp[index] = { ...exp, formato: 'texto', descricao: exp.descricao.replace(/• /g, '').replace(/\n/g, ' ') };
                                                        updateDados({ experiencias: newExp });
                                                    }}
                                                >
                                                    H2B (Texto)
                                                </button>
                                                <button
                                                    className={`px-2 py-0.5 text-[10px] rounded ${exp.formato === 'topicos' ? 'bg-white shadow text-black' : 'text-gray-700'}`}
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
                                                    H2A (Tópicos)
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            className="min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
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
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-bold text-gray-900">Certificações</h3>
                            <p className="text-xs text-gray-700">Liste suas certificações em texto livre.</p>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900"
                                value={typeof dados.certificacoes === 'string' ? dados.certificacoes : ''}
                                onChange={(e) => updateDados({ certificacoes: e.target.value })}
                                placeholder="Bachelor's Degree&#10;Unifael&#10;Completed in 2025"
                            />
                        </div>

                        {/* Idiomas */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-bold text-gray-900">Idiomas</h3>
                            <div className="grid gap-4">
                                {(dados.idiomas || []).map((lang, index) => (
                                    <div key={lang.idioma} className="flex items-center justify-between border p-3 rounded-lg bg-gray-50">
                                        <span className="font-medium">{lang.idioma}</span>
                                        <div className="w-[180px]">
                                            <select
                                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                                value={lang.nivel}
                                                onChange={(e) => {
                                                    const newIdiomas = [...(dados.idiomas || [])];
                                                    if (!newIdiomas[index]) return;
                                                    newIdiomas[index] = { ...newIdiomas[index], nivel: e.target.value as any };
                                                    updateDados({ idiomas: newIdiomas });
                                                }}
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="Studying">Studying</option>
                                                <option value="Basic">Basic</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                                <option value="Native">Native</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                {(!dados.idiomas || dados.idiomas.length === 0) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => updateDados({
                                            idiomas: [
                                                { idioma: 'Portuguese', nivel: '' },
                                                { idioma: 'English', nivel: '' },
                                                { idioma: 'Spanish', nivel: '' }
                                            ]
                                        })}
                                    >
                                        Inicializar Idiomas
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
                            className={`p-4 border rounded-lg text-left transition-all ${curriculo.template_id === 'template_1' ? 'ring-2 ring-blue-600 border-transparent' : 'hover:border-blue-400'}`}
                        >
                            <div className="font-bold text-gray-900">Profissional Moderno</div>
                            <div className="text-sm text-gray-700">Sidebar azul e layout de 2 colunas.</div>
                        </button>
                        <button
                            onClick={() => setTemplate('template_2')}
                            className={`p-4 border rounded-lg text-left transition-all ${curriculo.template_id === 'template_2' ? 'ring-2 ring-blue-600 border-transparent' : 'hover:border-blue-400'}`}
                        >
                            <div className="font-bold text-gray-900">Criativo Bold</div>
                            <div className="text-sm text-gray-700">Header largo e cores vibrantes.</div>
                        </button>
                        <button
                            onClick={() => setTemplate('template_3')}
                            className={`p-4 border rounded-lg text-left transition-all ${curriculo.template_id === 'template_3' ? 'ring-2 ring-blue-600 border-transparent' : 'hover:border-blue-400'}`}
                        >
                            <div className="font-bold text-gray-900">Minimalista Clean</div>
                            <div className="text-sm text-gray-700">Preto e branco, foco no conteúdo.</div>
                        </button>
                    </div>
                )}

                {activeTab === 'design' && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900">Cores</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-900">Cor Primária</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={customizacao.cores.primaria || '#000000'}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, primaria: e.target.value } })}
                                            className="w-12 h-10 p-1"
                                        />
                                        <Input
                                            type="text"
                                            className="text-gray-900 bg-white"
                                            value={customizacao.cores.primaria || ''}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, primaria: e.target.value } })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900">Cor Secundária</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={customizacao.cores.secundaria || '#000000'}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, secundaria: e.target.value } })}
                                            className="w-12 h-10 p-1"
                                        />
                                        <Input
                                            type="text"
                                            className="text-gray-900 bg-white"
                                            value={customizacao.cores.secundaria || ''}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, secundaria: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900">Espaçamento</h3>
                            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                                {['compacto', 'normal', 'amplo'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => updateCustomizacao({ espacamento: s as any })}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded uppercase ${customizacao.espacamento === s ? 'bg-white shadow text-black' : 'text-gray-700'}`}
                                    >
                                        {s}
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
