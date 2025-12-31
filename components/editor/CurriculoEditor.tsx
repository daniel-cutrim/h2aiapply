'use client';

import { useEffect } from 'react';
import { useCurriculoStore } from '@/store/curriculoStore';
import PreviewPanel from './PreviewPanel';
import EditPanel from './EditPanel';
import { Loader2 } from 'lucide-react';

interface CurriculoEditorProps {
    id: string;
    token: string;
}

export default function CurriculoEditor({ id, token }: CurriculoEditorProps) {
    const { fetchCurriculo, isLoading, error, curriculo } = useCurriculoStore();

    useEffect(() => {
        fetchCurriculo(id, token);
    }, [id, token, fetchCurriculo]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Carregando currículo...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500 font-medium">Erro: {error}</div>
            </div>
        );
    }

    if (!curriculo) return null;

    return (
        <div className="flex flex-col h-screen overflow-hidden lg:flex-row">
            {/* Left Panel: Editing Controls */}
            <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
                <EditPanel />
            </div>

            {/* Right Panel: Live Preview */}
            <div className="w-full lg:w-2/3 bg-gray-100 p-4 lg:p-8 overflow-auto flex justify-center items-start">
                <PreviewPanel />
            </div>
        </div>
    );
}
