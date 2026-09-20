-- =====================================================================
-- warap - Gestion des catégories de service
-- ---------------------------------------------------------------------
-- À exécuter dans le SQL Editor du dashboard Supabase, APRÈS les
-- migrations 001 à 007.
--
-- 1. Table `service_categories` (lecture publique, écriture admin).
-- 2. Politique : les administrateurs peuvent mettre à jour toutes les
--    offres (permet de réaffecter les offres quand une catégorie est
--    supprimée).
-- 3. Données par défaut (les 11 catégories historiques).
--
-- Réexécutable (CREATE TABLE IF NOT EXISTS / DROP + CREATE policies /
-- INSERT ON CONFLICT DO NOTHING).
-- =====================================================================

-- =====================================================================
-- 1. Table des catégories
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.service_categories (
  id text PRIMARY KEY,
  label text NOT NULL,
  short text NOT NULL,
  emoji text NOT NULL DEFAULT '✨',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 2. Politiques RLS
-- =====================================================================

-- Lecture publique (peut être consultée sans compte)
DROP POLICY IF EXISTS "Service categories are viewable by everyone" ON public.service_categories;
CREATE POLICY "Service categories are viewable by everyone"
  ON public.service_categories FOR SELECT
  USING (true);

-- Création réservée aux administrateurs
DROP POLICY IF EXISTS "Admins can insert service categories" ON public.service_categories;
CREATE POLICY "Admins can insert service categories"
  ON public.service_categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Modification réservée aux administrateurs
DROP POLICY IF EXISTS "Admins can update service categories" ON public.service_categories;
CREATE POLICY "Admins can update service categories"
  ON public.service_categories FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (true);

-- Suppression réservée aux administrateurs
DROP POLICY IF EXISTS "Admins can delete service categories" ON public.service_categories;
CREATE POLICY "Admins can delete service categories"
  ON public.service_categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Les administrateurs peuvent réaffecter les offres lors de la
-- suppression d'une catégorie (mettre à jour n'importe quelle offre).
DROP POLICY IF EXISTS "Admins can update any job" ON public.jobs;
CREATE POLICY "Admins can update any job"
  ON public.jobs FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (true);

-- =====================================================================
-- 3. Catégories par défaut
-- =====================================================================

INSERT INTO public.service_categories (id, label, short, emoji, sort_order) VALUES
  ('household',    'Ménage & personnel de maison', 'Ménage',          '🏠', 1),
  ('childcare',    'Garde d''enfants / Nounou',     'Garde d''enfants','👶', 2),
  ('elderly-care', 'Aide aux personnes âgées',      'Aide aux aînés',  '👴', 3),
  ('driving',      'Chauffeur particulier',         'Chauffeur',       '🚗', 4),
  ('cooking',      'Cuisine & traiteur',            'Cuisine',         '🍳', 5),
  ('tutoring',     'Cours & soutien scolaire',      'Cours',           '📚', 6),
  ('healthcare',   'Soins infirmiers',              'Soins',           '🩺', 7),
  ('maintenance',  'Bricolage & maintenance',       'Bricolage',       '🔧', 8),
  ('gardening',    'Jardinage & extérieurs',        'Jardinage',       '🌿', 9),
  ('security',     'Sécurité / Gardiennage',        'Sécurité',        '🛡️', 10),
  ('other',        'Autre service',                 'Autre',           '✨', 11)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- Validation
-- =====================================================================
SELECT id, label, sort_order FROM public.service_categories ORDER BY sort_order;