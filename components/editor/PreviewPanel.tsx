import { useCurriculoStore } from '@/store/curriculoStore';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import Template3 from '@/components/templates/Template3';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import * as htmlToImage from 'html-to-image';


interface PreviewPanelProps {
    jobId?: string;
}

export default function PreviewPanel({ jobId }: PreviewPanelProps) {
    const { curriculo } = useCurriculoStore();
    const [isExporting, setIsExporting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showWarning, setShowWarning] = useState(false); // State for the warning popup
    const [showJobWarning, setShowJobWarning] = useState(false); // State for missing job_id warning
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal

    if (!curriculo) return null;

    // Modified: Opens the warning popup instead of exporting directly
    const handleExportClick = () => {
        // TEMPORARY: Bypass popup for now as requested
        // setShowWarning(true);
        confirmExport();
    };

    // New: The actual export + webhook function
    const confirmExport = async () => {
        setShowWarning(false); // Close modal
        setIsExporting(true);

        // 1. Trigger Webhook (Fire and Forget or Await? User said "ir exportar... e também acionar".
        // Usually safer to do it in parallel or after success, but "Each export consumes a credit" implies we should maybe notify start or success.
        // User said: "Após isso, ele vai executar a mesma função atual e também irá acionar um webhook"
        // "Após isso" refers to the popup. "ele vai executar a mesma função atual E TAMBÉM irá acionar".
        // I will trigger it here.

        try {
            // Webhook Trigger
            const webhookUrl = process.env.NEXT_PUBLIC_EXPORT_WEBHOOK_URL;
            if (webhookUrl) {
                // Non-blocking call for speed, or blocking? 
                // Let's make it blocking to ensure it fires, but catch errors so it doesn't stop download.
                try {
                    await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ curriculo_id: curriculo.id })
                    });
                } catch (webhookErr) {
                    console.error("Webhook trigger failed", webhookErr);
                    // Continue to export even if webhook fails? User said "consumirá", implies critical.
                    // But if webhook is for tracking, maybe we shouldn't block user.
                    // I will continue log it.
                }
            } else {
                console.warn("NEXT_PUBLIC_EXPORT_WEBHOOK_URL not defined");
                // Proceeding as user might add it later
            }

            // 2. Existing Export Logic
            const element = document.getElementById('resume-content');
            if (!element) return;

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

        // Condition 1: Check if Job ID exists
        if (!jobId) {
            setShowJobWarning(true);
            return;
        }

        setIsSending(true);
        try {
            const webhookUrl = process.env.NEXT_PUBLIC_SEND_RESUME_WEBHOOK_URL;
            if (!webhookUrl) {
                alert('URL do Webhook não configurada (NEXT_PUBLIC_SEND_RESUME_WEBHOOK_URL)');
                return;
            }

            const payload: any = {
                curriculo_id: curriculo.id,
                job_id: jobId
            };

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

            // Condition 2: Success Modal instead of alert
            setShowSuccessModal(true);

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
                <Button onClick={handleExportClick} disabled={isExporting || isSending}>
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

            {/* Warning Popup */}
            {showWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-slate-800 transform transition-all scale-100">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
                                <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Atenção!
                            </h3>

                            <p className="text-gray-600 dark:text-gray-300">
                                Revise seu currículo para ter certeza de que você irá exportar o currículo correto.
                                <span className="block mt-2 font-medium text-gray-900 dark:text-gray-200">
                                    Cada exportação consumirá +1 crédito.
                                </span>
                            </p>

                            <div className="flex gap-3 w-full pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 bg-white hover:bg-gray-200 text-black dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                    onClick={() => setShowWarning(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="flex-1 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                    onClick={confirmExport}
                                >
                                    Confirmar Exportação
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Missing Job ID Warning */}
            {showJobWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-slate-800 transform transition-all scale-100">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-full">
                                <AlertTriangle className="w-8 h-8 text-orange-500" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Aviso
                            </h3>

                            <p className="text-gray-600 dark:text-gray-300">
                                Nenhuma vaga foi selecionada.
                                <br />
                                Por favor, aplicar na Seção <span className="font-semibold">"Hub de Vagas"</span>.
                            </p>

                            <div className="w-full pt-4">
                                <Button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={() => setShowJobWarning(false)}
                                >
                                    Entendi
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-slate-800 transform transition-all scale-100">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Enviado!
                            </h3>

                            <p className="text-gray-600 dark:text-gray-300">
                                Seu currículo foi enviado com sucesso para a vaga.
                            </p>

                            <div className="w-full pt-2">
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => setShowSuccessModal(false)}
                                >
                                    Fechar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
