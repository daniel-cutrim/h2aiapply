import { useCurriculoStore } from '@/store/curriculoStore';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import Template3 from '@/components/templates/Template3';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import * as htmlToImage from 'html-to-image';

export default function PreviewPanel() {
    const { curriculo } = useCurriculoStore();
    const [isExporting, setIsExporting] = useState(false);

    if (!curriculo) return null;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const element = document.getElementById('resume-content');
            if (!element) {
                console.error("Elemento resume-content não encontrado");
                return;
            }

            // Generate PNG client-side
            const dataUrl = await htmlToImage.toPng(element, { quality: 1.0, pixelRatio: 2 });

            const link = document.createElement('a');
            link.download = `curriculo-${curriculo.dados.pessoal.nome || 'download'}.png`;
            link.href = dataUrl;
            link.click();

        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
            alert('Erro ao exportar Imagem. Tente novamente.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full flex justify-end gap-2 px-4 max-w-[210mm]">
                <Button onClick={handleExport} disabled={isExporting}>
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                    Baixar Imagem (PNG)
                </Button>
            </div>

            <div
                id="resume-content"
                className="origin-top scale-[0.5] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] xl:scale-100 shadow-2xl transition-transform duration-200 bg-white"
            >
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
