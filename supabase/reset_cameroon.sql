-- =====================================================================
-- warap - Réinitialisation des données de démonstration (Cameroun)
-- ---------------------------------------------------------------------
-- Supprime tous les utilisateurs, entreprises, offres, tâches et
-- candidatures créés par seed_cameroon.sql (suppression en cascade).
--
-- À exécuter dans le SQL Editor du dashboard Supabase.
-- Ensuite, ré-exécuter seed_cameroon.sql pour réinitialiser les données.
-- =====================================================================

-- Suppression des comptes de démonstration.
-- Les profils (FK auth.users), les entreprises (owner_id), les offres
-- (posted_by), les tâches (created_by) et les candidatures (user_id)
-- sont supprimés automatiquement en cascade.
DELETE FROM auth.users
WHERE id IN (
  '11111111-1111-4111-8111-111111111111', -- Dinah Nkong (employeur)
  '22222222-2222-4222-8222-222222222222', -- Jean-Claude Mbarga (employeur)
  '33333333-3333-4333-8333-333333333333', -- Aïcha Ngono (candidate)
  '44444444-4444-4444-8444-444444444444', -- Brice Mballa (candidat)
  '55555555-5555-4555-8555-555555555555'  -- Ella Tchouta (admin)
);

-- Vérification : le résultat doit être vide.
SELECT 'utilisateurs restants' AS section, COUNT(*) AS total
FROM auth.users WHERE email LIKE '%@warap.demo'
UNION ALL
SELECT 'profils restants', COUNT(*) FROM profiles
WHERE email LIKE '%@warap.demo'
UNION ALL
SELECT 'offres restantes', COUNT(*) FROM jobs
UNION ALL
SELECT 'taches restantes', COUNT(*) FROM tasks
UNION ALL
SELECT 'candidatures restantes', COUNT(*) FROM applications
UNION ALL
SELECT 'entreprises restantes', COUNT(*) FROM companies;

-- Puis ré-exécuter seed_cameroon.sql pour réinitialiser les données.