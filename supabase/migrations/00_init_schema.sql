-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: curriculos
create table if not exists curriculos (
  id uuid primary key default uuid_generate_v4(),
  aluno_id text not null,
  token text unique not null,
  template_id text not null default 'template_1',
  
  -- Resume Data (JSON)
  dados jsonb not null,
  
  -- Visual Customization (JSON)
  customizacao jsonb default '{
    "cores": {
      "primaria": "#1e40af",
      "secundaria": "#6b7280",
      "texto": "#1f2937"
    },
    "fonte": "Inter",
    "espacamento": "normal",
    "secoes_visiveis": {
      "perfil": true,
      "experiencias": true,
      "educacao": true,
      "skills": true,
      "idiomas": true,
      "certificacoes": true
    },
    "ordem_secoes": ["perfil", "experiencias", "educacao", "skills", "idiomas"]
  }'::jsonb,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indices
create index if not exists idx_curriculos_aluno_id on curriculos(aluno_id);
create index if not exists idx_curriculos_token on curriculos(token);

-- Table: templates (Optional, can be hardcoded in frontend, but good for dynamic loading)
create table if not exists templates (
  id text primary key,
  nome text not null,
  descricao text,
  preview_url text,
  configuracao jsonb,
  ativo boolean default true
);

-- Seed initial templates
insert into templates (id, nome, descricao) values
  ('template_1', 'Profissional Moderno', 'Layout 2 colunas com sidebar azul'),
  ('template_2', 'Criativo', 'Layout com header colorido e foto grande'),
  ('template_3', 'Minimalista', 'Layout clean sem cores fortes')
on conflict (id) do nothing;

-- RLS Policies
alter table curriculos enable row level security;

-- Policy: Only allow access if the correct token is provided (Application-level logic usually handles this via API, but for direct Supabase client:)
-- Since we are building an API that uses the Service Role or handles auth, we might not strictly need RLS for the *student* if they don't log in via Supabase Auth.
-- However, the prompt mentions: "Usuários só veem próprios currículos" using "auth.jwt() ->> 'aluno_id'".
-- This implies the frontend might authenticate specifically or the API acts as the user.
-- For now, we will add a policy compliant with the request:
create policy "Usuários só veem próprios currículos"
on curriculos
for select
using (aluno_id = (select auth.jwt() ->> 'aluno_id'));
