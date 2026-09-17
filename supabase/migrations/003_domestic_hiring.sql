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
-- Attention : l'enum user_role reçoit la valeur 'agent' ici, mais CELA
-- NE PEUT PAS être utilisée dans le même script (même transaction).
-- Les politiques RLS faisant référence à 'agent' sont donc dans la
-- migration 004_agent_rls.sql, à exécuter APRES celle-ci.
--
-- Réexécutable : toutes les instructions sont protégées (IF NOT EXISTS).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Rôle "agent" dans l'enum user_role
--    (ajout isolé : aucune utilisation de la valeur dans ce script)
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
-- 5. Politiques RLS pour le rôle agent : voir 004_agent_rls.sql
--    (doit être exécuté après ce script, dès que la valeur 'agent'
--     de l'enum est engagée)
-- ---------------------------------------------------------------------