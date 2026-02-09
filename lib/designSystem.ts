export type SpacingLevel = 'compacto' | 'normal' | 'amplo';

export const typography = {
    header: {
        name: "text-4xl font-bold uppercase tracking-tight",
        role: "text-lg font-medium opacity-90 tracking-wide",
    },
    section: {
        title: "text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3",
    },
    body: {
        text: "text-sm leading-relaxed",
        meta: "text-xs opacity-75",
        bold: "font-bold",
    }
};

export const spacingMap = {
    compacto: {
        item: "mb-2",
        section: "mb-4",
        gap: "gap-3",
        ySpread: "space-y-3"
    },
    normal: {
        item: "mb-4",
        section: "mb-6",
        gap: "gap-5",
        ySpread: "space-y-5"
    },
    amplo: {
        item: "mb-6",
        section: "mb-8",
        gap: "gap-8",
        ySpread: "space-y-8"
    }
};

// Helper mainly for the PDF generation which needs inline styles
export const cssTokens = {
    typography: {
        name: "font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: -0.5px; line-height: 1.2;",
        role: "font-size: 14px; font-weight: 500; opacity: 0.9; letter-spacing: 0.5px;",
        sectionTitle: "font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid; padding-bottom: 4px; margin-bottom: 12px;",
        body: "font-size: 13px; line-height: 1.6;",
        meta: "font-size: 11px; opacity: 0.75;",
        bold: "font-weight: 700;",
    },
    spacing: {
        compacto: { item: "8px", section: "16px", gap: "12px" },
        normal: { item: "16px", section: "24px", gap: "20px" },
        amplo: { item: "24px", section: "32px", gap: "32px" }
    }
};
