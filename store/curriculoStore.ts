import { create } from 'zustand';
import { Curriculo, CurriculoData, Customizacao } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface CurriculoState {
    curriculo: Curriculo | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    fetchCurriculo: (id: string, token: string) => Promise<void>;
    updateDados: (dados: Partial<CurriculoData>) => void;
    updateCustomizacao: (customizacao: Partial<Customizacao>) => void;
    setTemplate: (templateId: string) => void;
    saveCurriculo: () => Promise<void>; // Explicit save or triggered by debounce
}

// Debounce timer reference
let saveTimeout: NodeJS.Timeout | null = null;

export const useCurriculoStore = create<CurriculoState>((set, get) => ({
    curriculo: null,
    isLoading: false,
    isSaving: false,
    error: null,

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
    },

    setTemplate: (templateId) => {
        const current = get().curriculo;
        if (!current) return;

        set({ curriculo: { ...current, template_id: templateId } });
        get().saveCurriculo();
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
    }
}));
