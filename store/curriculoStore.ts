import { create } from 'zustand';
import { Curriculo, CurriculoData, Customizacao } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface CurriculoState {
    curriculo: Curriculo | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    alunoId: string | null; // Track alunoId for webhook

    // Actions
    fetchCurriculo: (id: string, token: string) => Promise<void>;
    updateDados: (dados: Partial<CurriculoData>) => void;
    updateCustomizacao: (customizacao: Partial<Customizacao>) => void;
    setTemplate: (templateId: string) => void;
    saveCurriculo: () => Promise<void>; // Explicit save or triggered by debounce
    setAlunoId: (alunoId: string | null) => void;
    scheduleExportWebhook: () => void;
}

// Debounce timer reference
let saveTimeout: NodeJS.Timeout | null = null;

// Export webhook timer reference (2 minutes)
let exportTimerRef: NodeJS.Timeout | null = null;

export const useCurriculoStore = create<CurriculoState>((set, get) => ({
    curriculo: null,
    isLoading: false,
    isSaving: false,
    error: null,
    alunoId: null,

    setAlunoId: (alunoId) => {
        set({ alunoId });
    },

    fetchCurriculo: async (id: string, token: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('curriculos')
                .select('*')
                .eq('id', id)
                .eq('token', token)
                .single();

            if (error) throw error;
            set({ curriculo: data });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateDados: (newDados) => {
        const current = get().curriculo;
        if (!current) return;

        const updated = {
            ...current,
            dados: { ...current.dados, ...newDados }
        };

        set({ curriculo: updated });
        get().saveCurriculo();
        get().scheduleExportWebhook(); // Schedule export webhook
    },

    updateCustomizacao: (newCustom) => {
        const current = get().curriculo;
        if (!current) return;

        const updated = {
            ...current,
            customizacao: { ...current.customizacao, ...newCustom }
        };

        set({ curriculo: updated });
        get().saveCurriculo();
        get().scheduleExportWebhook(); // Schedule export webhook
    },

    setTemplate: (templateId) => {
        const current = get().curriculo;
        if (!current) return;

        set({ curriculo: { ...current, template_id: templateId } });
        get().saveCurriculo();
        get().scheduleExportWebhook(); // Schedule export webhook
    },

    saveCurriculo: async () => {
        // Debounce logic
        if (saveTimeout) clearTimeout(saveTimeout);

        set({ isSaving: true });

        saveTimeout = setTimeout(async () => {
            const { curriculo } = get();
            if (!curriculo) return;

            try {
                const { error } = await supabase
                    .from('curriculos')
                    .update({
                        dados: curriculo.dados,
                        customizacao: curriculo.customizacao,
                        template_id: curriculo.template_id,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', curriculo.id)
                    .eq('token', curriculo.token); // Security check

                if (error) throw error;

                // Success - could generate a toast here if we had one
            } catch (err) {
                console.error('Error auto-saving:', err);
                // Maybe set error state?
            } finally {
                set({ isSaving: false });
            }
        }, 2000); // 2 second debounce
    },

    scheduleExportWebhook: () => {
        // Clear existing export timer
        if (exportTimerRef) {
            clearTimeout(exportTimerRef);
        }

        // Set new 2-minute timer
        exportTimerRef = setTimeout(async () => {
            const { curriculo, alunoId } = get();
            if (!curriculo) return;

            // Trigger export webhook
            const webhookUrl = process.env.NEXT_PUBLIC_EXPORT_WEBHOOK_URL;
            if (webhookUrl) {
                try {
                    const payload: any = { curriculo_id: curriculo.id };
                    if (alunoId) {
                        payload.aluno_id = alunoId;
                    }

                    await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    console.log('✅ Auto-export webhook triggered after 2 minutes of inactivity');
                } catch (err) {
                    console.error('❌ Auto-export webhook failed:', err);
                }
            } else {
                console.warn('⚠️ NEXT_PUBLIC_EXPORT_WEBHOOK_URL not configured');
            }
        }, 120000); // 2 minutes = 120,000ms
    }
}));

