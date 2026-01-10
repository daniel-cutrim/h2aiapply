import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)"],
                mono: ["var(--font-geist-mono)"],
            },
        },
    },
    safelist: [
        // Spacing classes for Template1
        'gap-2', 'gap-8', 'gap-16',
        'py-1', 'py-2', 'py-3',
        // Spacing classes for Template2
        'gap-3', 'gap-5', 'gap-8',
        // Spacing classes for Template3
        'space-y-4', 'space-y-8', 'space-y-12',
    ],
    plugins: [],
};
export default config;
