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
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'conteudo' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        Conteúdo
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'design' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        Design
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'templates' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
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
                                    <Label>Nome</Label>
                                    <Input
                                        value={dados.pessoal.nome}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, nome: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sobrenome</Label>
                                    <Input
                                        value={dados.pessoal.sobrenome}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, sobrenome: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        value={dados.pessoal.email}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, email: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Telefone</Label>
                                    <Input
                                        value={dados.pessoal.telefone}
                                        onChange={(e) => updateDados({ pessoal: { ...dados.pessoal, telefone: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Perfil Profissional</Label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                    value={dados.perfil}
                                    onChange={(e) => updateDados({ perfil: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Add more sections for Experience, Education etc. here */}
                        <div className="p-4 bg-yellow-50 rounded border border-yellow-200 text-sm text-yellow-800">
                            Outras seções (Experiência, Educação) seriam implementadas aqui com lógica de array fields.
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => setTemplate('template_1')}
                            className={`p-4 border rounded-lg text-left transition-all ${curriculo.template_id === 'template_1' ? 'ring-2 ring-blue-600 border-transparent' : 'hover:border-blue-400'}`}
                        >
                            <div className="font-bold">Profissional Moderno</div>
                            <div className="text-sm text-gray-500">Sidebar azul e layout de 2 colunas.</div>
                        </button>
                        <button
                            onClick={() => setTemplate('template_2')}
                            className={`p-4 border rounded-lg text-left transition-all ${curriculo.template_id === 'template_2' ? 'ring-2 ring-blue-600 border-transparent' : 'hover:border-blue-400'}`}
                        >
                            <div className="font-bold">Criativo Bold</div>
                            <div className="text-sm text-gray-500">Header largo e cores vibrantes.</div>
                        </button>
                        <button
                            onClick={() => setTemplate('template_3')}
                            className={`p-4 border rounded-lg text-left transition-all ${curriculo.template_id === 'template_3' ? 'ring-2 ring-blue-600 border-transparent' : 'hover:border-blue-400'}`}
                        >
                            <div className="font-bold">Minimalista Clean</div>
                            <div className="text-sm text-gray-500">Preto e branco, foco no conteúdo.</div>
                        </button>
                    </div>
                )}

                {activeTab === 'design' && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900">Cores</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Cor Primária</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={customizacao.cores.primaria}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, primaria: e.target.value } })}
                                            className="w-12 h-10 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={customizacao.cores.primaria}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, primaria: e.target.value } })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Cor Secundária</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={customizacao.cores.secundaria}
                                            onChange={(e) => updateCustomizacao({ cores: { ...customizacao.cores, secundaria: e.target.value } })}
                                            className="w-12 h-10 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={customizacao.cores.secundaria}
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
                                        className={`flex-1 py-1.5 text-xs font-medium rounded uppercase ${customizacao.espacamento === s ? 'bg-white shadow text-black' : 'text-gray-500'}`}
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
