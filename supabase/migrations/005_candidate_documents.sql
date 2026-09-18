-- =====================================================================
-- warap - Migration 005 : dossier candidat (documents) & vérification
-- ---------------------------------------------------------------------
-- À exécuter APRÈS 004_agent_rls.sql.
--
-- Contenu :
--   1. Bucket Supabase Storage "documents" pour les pièces justificatives
--      téléversées par les candidats (CNI, références, casier, diplômes...).
--   2. Politiques Storage : lecture publique (les URL sont partagées aux
--      familles), écriture limitée au dossier de l'utilisateur connecté.
--   3. Colonnes de suivi de vérification sur applications
--      (checklist + horodatage).
--
-- Réexécutable (DROP + CREATE / IF NOT EXISTS).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Bucket de stockage des pièces justificatives
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('documents', 'documents', true, 10485760)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 10485760;

-- ---------------------------------------------------------------------
-- 2. Politiques Storage (lecture publique, écriture par le propriétaire)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Documents lisibles publiquement" ON storage.objects;
CREATE POLICY "Documents lisibles publiquement" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Candidat téléverse ses documents" ON storage.objects;
CREATE POLICY "Candidat téléverse ses documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Candidat met à jour ses documents" ON storage.objects;
CREATE POLICY "Candidat met à jour ses documents" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Candidat supprime ses documents" ON storage.objects;
CREATE POLICY "Candidat supprime ses documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------
-- 3. Suivi de la vérification sur les candidatures
-- ---------------------------------------------------------------------
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS verification_checklist JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- ---------------------------------------------------------------------
-- 4. Les candidats peuvent consulter et mettre à jour leurs propres
--    documents de dossier (déjà couvert par 001, rappel idempotent).
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
CREATE POLICY "Users can view own applications" ON public.applications
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.posted_by = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
