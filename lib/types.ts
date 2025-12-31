export interface CurriculoData {
    pessoal: {
        nome: string;
        sobrenome: string;
        email: string;
        telefone: string;
        localizacao: string;
        foto_url?: string;
        linkedin?: string;
    };

    perfil: string;

    experiencias: Array<{
        id?: string; // Helpful for UI keys
        empresa: string;
        cargo: string;
        periodo: string;
        descricao: string;
        bullets: string[];
    }>;

    educacao: Array<{
        id?: string;
        instituicao: string;
        curso: string;
        periodo: string;
    }>;

    skills: string[];

    idiomas: Array<{
        id?: string;
        idioma: string;
        nivel: string; // Nativo, Avançado, Intermediário, Básico
    }>;

    certificacoes?: Array<{
        id?: string;
        nome: string;
        instituicao: string;
        ano: string;
    }>;
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
