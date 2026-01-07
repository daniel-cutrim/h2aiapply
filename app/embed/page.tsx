'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmbedPage() {
    const router = useRouter();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const [isLoading, setIsLoading] = useState(false);

    // Auto-redirect if token and id are present in query params
    if (searchParams) {
        const token = searchParams.get('token');
        const id = searchParams.get('id');
        const visual = searchParams.get('visual');
        const lang = searchParams.get('lang');

        if (token && id) {
            // Build query string dynamically
            const params = new URLSearchParams();
            params.set('token', token);
            params.set('id', id);
            if (visual) params.set('visual', visual);
            if (lang) params.set('lang', lang);

            // Use replace to avoid history stack buildup in iframe
            router.replace(`/curriculo?${params.toString()}`);
            return (
                <div className="flex items-center justify-center min-h-screen bg-transparent">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            );
        }
    }

    const handleCreateResume = async () => {
        setIsLoading(true);
        try {
            // Create a new resume session using the API
            // Using the same logic as the main page
            const res = await fetch('/api/curriculo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    aluno_id: `demo-${Math.floor(Math.random() * 10000)}`,
                    dados: {
                        // Minimal initial data
                        pessoal: {
                            nome: "Seu Nome",
                            sobrenome: "",
                            email: "",
                            telefone: "",
                            cargo: "",
                            endereco: "",
                            localizacao: "",
                            customizacao: {
                                cores: {
                                    primaria: '#000000',
                                    secundaria: '#666666',
                                    texto: '#333333'
                                },
                                fonte: 'Arial',
                                espacamento: 'normal',
                                secoes_visiveis: {
                                    perfil: true,
                                    experiencias: true,
                                    educacao: true,
                                    skills: true,
                                    idiomas: true,
                                    certificacoes: true
                                },
                                ordem_secoes: ['perfil', 'experiencias', 'educacao', 'skills', 'idiomas', 'certificacoes'],
                                modelo_foto: 'circular'
                            }
                        },
                        resumo: "",
                        experiencias: [],
                        educacao: '',
                        skills: [],
                        idiomas: [],
                        certificacoes: ""
                    }
                }),
            });

            if (!res.ok) {
                throw new Error('Falha ao criar currículo');
            }

            const data = await res.json();

            if (data.url) {
                router.push(data.url);
            } else {
                throw new Error('URL de redirecionamento inválida');
            }

        } catch (error) {
            console.error(error);
            alert('Erro ao iniciar. Tente novamente.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-sm w-full text-center space-y-4 border border-gray-100">

                <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">
                        AI Resume
                    </h1>
                </div>

                <p className="text-gray-600 text-sm">
                    Crie seu currículo profissional agora.
                </p>

                <Button
                    size="lg"
                    className="w-full h-12 text-base font-medium shadow-md transition-all hover:scale-[1.02]"
                    onClick={handleCreateResume}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Criando...
                        </>
                    ) : (
                        <>
                            <FileText className="mr-2 h-4 w-4" />
                            Começar Agora
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
