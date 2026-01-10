import { useCurriculoStore } from '@/store/curriculoStore';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import Template3 from '@/components/templates/Template3';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import * as htmlToImage from 'html-to-image';


interface PreviewPanelProps {
    jobId?: string;
}

export default function PreviewPanel({ jobId }: PreviewPanelProps) {
    const { curriculo } = useCurriculoStore();
    const [isExporting, setIsExporting] = useState(false);
    const [isSending, setIsSending] = useState(false);

    if (!curriculo) return null;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const element = document.getElementById('resume-content');
            if (!element) return;

            const htmlContent = element.outerHTML;

            const res = await fetch(`/api/curriculo/${curriculo.id}/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                                @page { size: A4; margin: 0; }
                                body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                                #resume-content { transform: none !important; }
                            </style>
                        </head>
                        <body>
                            ${element.outerHTML}
                        </body>
                        </html>
                    `,
                    token: curriculo.token
                })
            });

            if (!res.ok) throw new Error('Falha na exportação');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `curriculo-${curriculo.dados.pessoal.nome || 'curriculo'}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
            alert('Erro ao exportar PDF');
        } finally {
            setIsExporting(false);
        }
    };

    const handleSendResume = async () => {
        if (!curriculo) return;

        setIsSending(true);
        try {
            const webhookUrl = process.env.NEXT_PUBLIC_SEND_RESUME_WEBHOOK_URL;
            if (!webhookUrl) {
                alert('URL do Webhook não configurada (NEXT_PUBLIC_SEND_RESUME_WEBHOOK_URL)');
                return;
            }

            const payload: any = {
                curriculo_id: curriculo.id,
                // Add other necessary fields if required by the webhook, e.g., token, user_id, etc.
            };

            if (jobId) {
                payload.job_id = jobId;
            }

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar currículo');
            }

            alert('Currículo enviado com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar currículo:', error);
            alert('Erro ao enviar currículo. Tente novamente.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full flex justify-end gap-2 px-4 max-w-[210mm]">
                <Button onClick={handleSendResume} disabled={isSending || isExporting} variant="outline" className="border-[#fe4a21] text-[#fe4a21] hover:bg-[#fe4a21]/10">
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    Enviar Currículo
                </Button>
                <Button onClick={handleExport} disabled={isExporting || isSending}>
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                    Exportar PDF
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
