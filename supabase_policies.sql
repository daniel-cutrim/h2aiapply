-- 1. Cria (ou garante que existe) o bucket 'photo_curriculos' como PÚBLICO
INSERT INTO storage.buckets (id, name, public)
VALUES ('photo_curriculos', 'photo_curriculos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Remove políticas antigas (para evitar conflitos/erros de duplicação)
DROP POLICY IF EXISTS "Permitir Leitura Publica photo_curriculos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir Upload Publico photo_curriculos" ON storage.objects;

-- 3. Cria política para QUALQUER PESSOA ver as imagens (necessário para o PDF e o site)
CREATE POLICY "Permitir Leitura Publica photo_curriculos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'photo_curriculos' );

-- 4. Cria política para QUALQUER PESSOA fazer upload (necessário se o usuário não estiver logado)
CREATE POLICY "Permitir Upload Publico photo_curriculos"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'photo_curriculos' );
