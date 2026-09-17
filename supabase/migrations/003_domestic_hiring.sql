-- =====================================================================
-- warap - Migration 003 : recrutement de personnel domestique
-- ---------------------------------------------------------------------
-- Ajoute :
--   * un rôle "agent" (vérificateur local de confiance)
--   * un statut de vérification des candidatures
--   * un pack de vérification par candidature (documents, notes,
--     vérificateur, dates)
--   * téléphones de contact (WhatsApp) sur profils / offres / candidatures
--
-- Réexécutable : toutes les instructions sont protégées (IF NOT EXISTS).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Rôle "agent" dans l'enum user_role
-- ---------------------------------------------------------------------
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'agent';

-- ---------------------------------------------------------------------
-- 2. Enum verification_status
--    unverified : pas encore vérifié
--    in_review  : en cours de vérification par un agent local
--    verified   : documents vérifiés et jugés valides
--    rejected   : informations frauduleuses / pièces rejetées
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t WHERE t.typname = 'verification_status'
  ) THEN
    CREATE TYPE public.verification_status AS ENUM (
      'unverified', 'in_review', 'verified', 'rejected'
    );
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- 3. Nouvelles colonnes
-- ---------------------------------------------------------------------

-- Téléphone (WhatsApp) du profil
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- Téléphone de contact (WhatsApp) de l'offre : utile pour un employeur
-- particulier recrutant depuis l'étranger (diaspora)
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Pack de vérification par candidature
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verification_notes TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- ---------------------------------------------------------------------
-- 4. Index utiles
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_applications_verification_status
  ON public.applications(verification_status);
CREATE INDEX IF NOT EXISTS idx_applications_verified_by
  ON public.applications(verified_by);
CREATE INDEX IF NOT EXISTS idx_jobs_contact_phone
  ON public.jobs(contact_phone);

-- ---------------------------------------------------------------------
-- 5. Politiques RLS pour le rôle agent
--    (les politiques SELECT sont de type permissif : elles s'additionnent
--     aux politiques existantes de la migration 001)
-- ---------------------------------------------------------------------

-- Un agent peut consulter toutes les candidatures (pour les vérifier)
DROP POLICY IF EXISTS "Agents can view applications" ON public.applications;
CREATE POLICY "Agents can view applications" ON public.applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agent')
  );

-- Un agent ou un admin peut mettre à jour une candidature
-- (statut de vérification, notes, documents). À restreindre par colonne
-- si on souhaite interdire la modification du statut du recrutement.
DROP POLICY IF EXISTS "Agents and admins can update applications" ON public.applications;
CREATE POLICY "Agents and admins can update applications" ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );