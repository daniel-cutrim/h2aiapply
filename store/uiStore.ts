import { create } from 'zustand';

interface UiState {
    theme: 'light' | 'dark';
    language: 'pt' | 'es';
    setTheme: (theme: 'light' | 'dark') => void;
    setLanguage: (lang: 'pt' | 'es') => void;
}

export const useUiStore = create<UiState>((set) => ({
    theme: 'light',
    language: 'pt',
    setTheme: (theme) => set({ theme }),
    setLanguage: (language) => set({ language }),
}));
