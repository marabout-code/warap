-- =====================================================================
-- warap - Réinitialisation des données de démonstration
--           (recrutement de personnel domestique)
-- ---------------------------------------------------------------------
-- Supprime tous les utilisateurs, offres, candidatures et tâches créés
-- par seed_domestic_workers.sql (suppression en cascade).
--
-- Ensuite, ré-exécuter seed_domestic_workers.sql pour réinitialiser.
-- =====================================================================

DELETE FROM auth.users
WHERE id IN (
  '66666661-1111-4111-8111-666666666661', -- Mireille Kouam (employeur, Paris)
  '66666662-2222-4222-8222-666666666662', -- Charles Ngo Bakai (employeur, Londres)
  '66666663-3333-4333-8333-666666666663', -- Yannick Fokou (agent, Douala)
  '66666664-4444-4444-8444-666666666664', -- Solange Andela (aide ménagère)
  '66666665-5555-4555-8555-666666666665', -- Marthe Tchoupo (nounou)
  '66666666-6666-4666-8666-666666666666', -- Honorine Nana (gouvernante)
  '66666667-7777-4777-8777-666666666667'  -- Serge Ekambi (chauffeur)
);

-- Vérification : le résultat doit être vide.
SELECT 'utilisateurs restants' AS section, COUNT(*) AS total
FROM auth.users WHERE email LIKE '%@warap.demo'
UNION ALL
SELECT 'offres restantes', COUNT(*) FROM jobs
UNION ALL
SELECT 'taches restantes', COUNT(*) FROM tasks
UNION ALL
SELECT 'candidatures restantes', COUNT(*) FROM applications;

-- Puis ré-exécuter seed_domestic_workers.sql pour réinitialiser les données.