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
    // periodo: string; // REMOVED in favor of start/end
    ano_inicio: string;
    ano_fim?: string; // Optional (empty = current)
    localizacao?: string;
    descricao: string; // HTML/Text content
    formato: 'texto' | 'topicos'; // Switch for UI
}

export interface EducacaoItem {
    id: string;
    grau: string; // Grau/Título
    instituicao: string;
    area_estudo?: string;
    ano_inicio: string;
    ano_fim?: string;
}

export interface CertificacaoItem {
    id: string;
    nome: string;
    emissor: string;
    ano_obtencao: string;
    validade?: string;
    credencial_id?: string;
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
    educacao: EducacaoItem[]; // Changed from string to array
    skills: string[]; // List of strings
    idiomas: Idioma[]; // Fixed list
    certificacoes: CertificacaoItem[]; // Changed from string to array
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
    modelo_foto: 'quadrado' | 'circular';
    imagem_fundo?: {
        url: string;
        tipo: 'lateral_esquerda' | 'lateral_direita' | 'cabecalho' | 'inteiro';
        opacidade: number; // 0-1
        escala?: number; // 1 = 100%
        posicao_x?: number; // %
        posicao_y?: number; // %
        rotacao?: number; // deg
    };
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
