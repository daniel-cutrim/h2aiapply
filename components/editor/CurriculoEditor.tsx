'use client';

import { useEffect } from 'react';
import { useCurriculoStore } from '@/store/curriculoStore';
import { useUiStore } from '@/store/uiStore';
import PreviewPanel from './PreviewPanel';
import EditPanel from './EditPanel';
import { Loader2 } from 'lucide-react';

interface CurriculoEditorProps {
    id: string;
    token: string;
    visual?: 'light' | 'dark';
    lang?: 'pt' | 'es';
    jobId?: string;
}

export default function CurriculoEditor({ id, token, visual, lang, jobId }: CurriculoEditorProps) {
    const { fetchCurriculo, isLoading, error, curriculo } = useCurriculoStore();
    const { setTheme, setLanguage } = useUiStore();

    // Init UI store on mount
    useEffect(() => {
        if (visual) setTheme(visual);
        if (lang) setLanguage(lang);
    }, [visual, lang, setTheme, setLanguage]);

    useEffect(() => {
        fetchCurriculo(id, token);
    }, [id, token, fetchCurriculo]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
                <Loader2 className="w-8 h-8 animate-spin text-[#fe4a21]" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Carregando currículo...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
                <div className="text-red-500 font-medium">Erro: {error}</div>
            </div>
        );
    }

    if (!curriculo) return null;

    return (
        <div className={`${visual === 'dark' ? 'dark' : ''} h-screen`}>
            {/* Wrapper div to apply dark: styles recursively */}
            <div className="flex flex-col h-screen overflow-hidden lg:flex-row bg-gray-50 dark:bg-slate-900">
                {/* Left Panel: Editing Controls */}
                <div className="w-full lg:w-1/3 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-hidden">
                    <EditPanel />
                </div>

                {/* Right Panel: Live Preview */}
                <div className="w-full lg:w-2/3 bg-gray-100 dark:bg-slate-950 p-4 lg:p-8 overflow-auto flex justify-center items-start">
                    <PreviewPanel jobId={jobId} />
                </div>
            </div>
        </div>
    );
}
