
import { Suspense } from 'react';
import CurriculoEditor from '@/components/editor/CurriculoEditor';

export default async function CurriculoPage(props: {
    searchParams: Promise<{ token?: string; id?: string; visual?: 'light' | 'dark'; lang?: 'pt' | 'es' }>;
}) {
    const { token, id, visual, lang } = await props.searchParams;

    if (!token || !id) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Acesso Inválido</h1>
                    <p className="text-gray-600">Link de currículo incompleto ou expirado.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950">
            <Suspense fallback={<div className="p-10 text-center dark:text-gray-300">Carregando editor...</div>}>
                <CurriculoEditor id={id} token={token} visual={visual} lang={lang} />
            </Suspense>
        </div>
    );
}
