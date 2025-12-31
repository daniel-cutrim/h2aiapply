// Basic types
export interface Pessoal {
    nome: string;
    sobrenome: string;
    email: string;
    telefone: string;
    cargo: string;
    endereco: string;
    localizacao?: string;
    linkedin?: string;
    foto_url?: string;
    site?: string;
    foto?: string;
}

export interface Experiencia {
    id: string; // Helper for React keys
    empresa: string;
    cargo: string;
    periodo: string;
    descricao: string; // HTML/Text content
    formato: 'texto' | 'topicos'; // Switch for UI
}

export interface Educacao {
    id: string;
    instituicao: string;
    curso: string;
    periodo: string;
    descricao: string;
}

export type NivelIdioma = 'Studying' | 'Basic' | 'Intermediate' | 'Advanced' | 'Native';

export interface Idioma {
    idioma: string; // Portuguese, English, Spanish
    nivel: NivelIdioma | ''; // Allow empty for unselected
}

export interface CurriculoData {
    pessoal: Pessoal;
    resumo: string;
    experiencias: Experiencia[];
    educacao: Educacao[];
    skills: string[]; // List of strings
    idiomas: Idioma[]; // Fixed list
    certificacoes: string; // Free text area
}

export interface Customizacao {
    cores: {
        primaria: string;
        secundaria: string;
        texto: string;
    };
    fonte: string;
    espacamento: 'compacto' | 'normal' | 'amplo';
    secoes_visiveis: {
        perfil: boolean;
        experiencias: boolean;
        educacao: boolean;
        skills: boolean;
        idiomas: boolean;
        certificacoes: boolean;
    };
    ordem_secoes: string[];
}

export interface Curriculo {
    id: string;
    aluno_id: string;
    token: string;
    template_id: string;
    dados: CurriculoData;
    customizacao: Customizacao;
    created_at: string;
    updated_at: string;
}
