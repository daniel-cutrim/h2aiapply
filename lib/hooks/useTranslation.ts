import { useUiStore } from '@/store/uiStore';
import { pt } from '@/lib/i18n/pt';
import { es } from '@/lib/i18n/es';

const dictionaries = {
    pt,
    es
};

export function useTranslation() {
    const language = useUiStore((state) => state.language);
    const dictionary = dictionaries[language] || dictionaries.pt;

    const t = (key: string): string => {
        const keys = key.split('.');
        let current: any = dictionary;

        for (const k of keys) {
            if (current[k] === undefined) {
                console.warn(`Missing translation key: ${key}`);
                return key;
            }
            current = current[k];
        }

        return current as string;
    };

    return { t, language };
}
