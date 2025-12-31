'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateResume = async () => {
    setIsLoading(true);
    try {
      // Create a new resume session using the API
      // Since we don't have authentication in this MVP, we create a generic one or ask for an ID?
      // The API requires 'aluno_id'. For this public demo, we can generate a random ID or use 'demo-user'.

      const res = await fetch('/api/curriculo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aluno_id: `demo-${Math.floor(Math.random() * 10000)}`,
          dados: {
            pessoal: {
              nome: "Seu Nome",
              email: "email@exemplo.com",
              telefone: "(11) 99999-9999",
              cargo: "Desenvolvedor de Software",
              endereco: "São Paulo, SP"
            },
            resumo: "Resumo profissional...",
            experiencias: [],
            educacao: [],
            skills: [],
            idiomas: [],
            certificacoes: []
          }
        }),
      });

      if (!res.ok) {
        throw new Error('Falha ao criar currículo');
      }

      const data = await res.json();

      // Redirect to the editor URL
      if (data.url) {
        router.push(data.url);
      } else {
        throw new Error('URL de redirecionamento inválida');
      }

    } catch (error) {
      console.error(error);
      alert('Erro ao iniciar o editor. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center space-y-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-blue-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          AI Resume Builder
        </h1>

        <p className="text-gray-600 text-lg">
          Crie currículos profissionais, criativos ou minimalistas em segundos com nossa inteligência artificial.
        </p>

        <div className="pt-4">
          <Button
            size="lg"
            className="w-full text-lg h-14"
            onClick={handleCreateResume}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Criando seu espaço...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Criar Novo Currículo
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Nenhuma conta necessária para testar.
        </p>
      </div>
    </div>
  );
}
