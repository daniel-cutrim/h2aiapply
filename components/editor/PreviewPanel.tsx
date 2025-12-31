import { useCurriculoStore } from '@/store/curriculoStore';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import Template3 from '@/components/templates/Template3';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function PreviewPanel() {
    const { curriculo } = useCurriculoStore();
    const [isExporting, setIsExporting] = useState(false);

    if (!curriculo) return null;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Get HTML content
            const element = document.getElementById('resume-content');
            if (!element) return;

            // Basic cloning to send html string (in real app, might want to inline styles more robustly)
            const htmlContent = element.outerHTML;

            const res = await fetch(`/api/curriculo/${curriculo.id}/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    html: htmlContent,
                    token: curriculo.token
                })
            });

            if (!res.ok) throw new Error('Falha na exportação');

            // Download Blob
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `curriculo-${curriculo.dados.pessoal.nome}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
            alert('Erro ao exportar Imagem');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full flex justify-end gap-2 px-4 max-w-[210mm]">
                <Button onClick={handleExport} disabled={isExporting}>
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                    Exportar Imagem (HQ)
                </Button>
            </div>

            <div className="origin-top scale-[0.5] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] xl:scale-100 shadow-2xl transition-transform duration-200">
                {curriculo.template_id === 'template_1' && (
                    <Template1 data={curriculo.dados} customizacao={curriculo.customizacao} />
                )}
                {curriculo.template_id === 'template_2' && (
                    <Template2 data={curriculo.dados} customizacao={curriculo.customizacao} />
                )}
                {curriculo.template_id === 'template_3' && (
                    <Template3 data={curriculo.dados} customizacao={curriculo.customizacao} />
                )}
            </div>
        </div>
    );
}
