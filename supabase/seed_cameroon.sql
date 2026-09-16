-- =====================================================================
-- warap - Données de démonstration (Cameroun)
-- ---------------------------------------------------------------------
-- À exécuter dans le SQL Editor du dashboard Supabase.
-- Réexécutable : tous les insertions utilisent des UUID fixes +
-- ON CONFLICT DO NOTHING (idempotent).
--
-- Pour REINITIALISER : exécuter d'abord reset_cameroon.sql, puis ce
-- script à nouveau.
--
-- Comptes démo (login = PIN à 6 chiffres) :
--   Dinah Nkong          (employeur)   PIN 123456
--   Jean-Claude Mbarga   (employeur)   PIN 234567
--   Aïcha Ngono          (candidate)   PIN 345678
--   Brice Mballa         (candidat)    PIN 567890
--   Ella Tchouta         (admin)       PIN 456789
-- =====================================================================

-- 0. pgcrypto pour crypt() (bcrypt) et digest() (sha256)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================================
-- 1. Utilisateurs de démonstration (auth.users)
--    Le trigger handle_new_user crée automatiquement le profil.
-- =====================================================================

-- Dinah Nkong - Employeur
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-4111-8111-111111111111',
  'authenticated', 'authenticated', 'dinah@warap.demo',
  crypt('Dina#$!w4rap2026a7K', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Dinah Nkong"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Jean-Claude Mbarga - Employeur
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-4222-8222-222222222222',
  'authenticated', 'authenticated', 'jeanclaude@warap.demo',
  crypt('JeanC!r@w4rap2026xQ2', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Jean-Claude Mbarga"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Aïcha Ngono - Candidat(e)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '33333333-3333-4333-8333-333333333333',
  'authenticated', 'authenticated', 'aicha@warap.demo',
  crypt('Aich@R!w4rap2026mN8', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Aïcha Ngono"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Brice Mballa - Candidat
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '44444444-4444-4444-8444-444444444444',
  'authenticated', 'authenticated', 'brice@warap.demo',
  crypt('Bric3W!r4ap2026#z5', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Brice Mballa"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Ella Tchouta - Admin
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '55555555-5555-4555-8555-555555555555',
  'authenticated', 'authenticated', 'ella@warap.demo',
  crypt('Ell@A!w4rap2026vP7', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Ella Tchouta"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 2. Profils : rôle + accès PIN (bcrypt + lookup sha256 compatibles
--    avec src/lib/pin.ts)
--    PIN 123456 -> sha256 hex ; hash bcrypt via crypt()
-- =====================================================================

UPDATE profiles SET
  role = 'employer',
  location = 'Douala, Cameroun',
  bio = 'Responsable Talent chez CFAO Technologies Cameroun, passionnée par le recrutement dans le bassin de l''Afrique centrale.',
  website = 'https://cfaotechnologies.cm',
  pin_hash = crypt('123456', gen_salt('bf', 10)),
  pin_lookup = encode(digest('123456'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Dina#$!w4rap2026a7K'
WHERE id = '11111111-1111-4111-8111-111111111111';

UPDATE profiles SET
  role = 'employer',
  location = 'Limbé, Cameroun',
  bio = 'Directeur des opérations chez Yango Logistics, en charge de la chaîne de transport au Cameroun.',
  website = 'https://yangologistics.cm',
  pin_hash = crypt('234567', gen_salt('bf', 10)),
  pin_lookup = encode(digest('234567'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'JeanC!r@w4rap2026xQ2'
WHERE id = '22222222-2222-4222-8222-222222222222';

UPDATE profiles SET
  role = 'jobseeker',
  location = 'Yaoundé, Cameroun',
  bio = 'Développeuse web et mobile, diplômée de l''ENSPY. À la recherche de nouvelles opportunités dans la tech.',
  website = 'https://aichaporte.dev',
  pin_hash = crypt('345678', gen_salt('bf', 10)),
  pin_lookup = encode(digest('345678'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Aich@R!w4rap2026mN8'
WHERE id = '33333333-3333-4333-8333-333333333333';

UPDATE profiles SET
  role = 'jobseeker',
  location = 'Douala, Cameroun',
  bio = 'Infirmier diplômé d''État, expérience en urgence et soins intensifs à l''hôpital Général de Douala.',
  website = NULL,
  pin_hash = crypt('567890', gen_salt('bf', 10)),
  pin_lookup = encode(digest('567890'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Bric3W!r4ap2026#z5'
WHERE id = '44444444-4444-4444-8444-444444444444';

UPDATE profiles SET
  role = 'admin',
  location = 'Yaoundé, Cameroun',
  bio = 'Administratrice de la plateforme warap.',
  website = NULL,
  pin_hash = crypt('456789', gen_salt('bf', 10)),
  pin_lookup = encode(digest('456789'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Ell@A!w4rap2026vP7'
WHERE id = '55555555-5555-4555-8555-555555555555';

-- =====================================================================
-- 3. Entreprises
-- =====================================================================

INSERT INTO companies (id, name, description, website, location, industry, size, owner_id) VALUES
  (
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00001',
    'CFAO Technologies Cameroun',
    'Intégrateur de solutions IT et télécom pour les entreprises d''Afrique centrale.',
    'https://cfaotechnologies.cm',
    'Douala, Cameroun',
    'Technologies',
    '50-200 employés',
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00002',
    'Clinique Espoir Santé',
    'Établissement de santé privé proposant des soins de médecine générale, urgence et maternité.',
    'https://espoirsante.cm',
    'Yaoundé, Cameroun',
    'Santé',
    '50-200 employés',
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00003',
    'Yango Logistics',
    'Distribution et transport de fret sur le corridor Douala – Yaoundé – Bamenda.',
    'https://yangologistics.cm',
    'Limbé, Cameroun',
    'Transport & Logistique',
    '200-500 employés',
    '22222222-2222-4222-8222-222222222222'
  ),
  (
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00004',
    'BTP Batirplus',
    'Entreprise de génie civil et bâtiment, spécialisée dans les projets d''infrastructure au littoral et à l''ouest.',
    'https://batirplus.cm',
    'Limbé, Cameroun',
    'Construction',
    '50-200 employés',
    '22222222-2222-4222-8222-222222222222'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 4. Offres d'emploi (salaires indicatifs en FCFA)
-- =====================================================================

INSERT INTO jobs (id, title, description, company, location, salary_min, salary_max, employment_type, status, posted_by, company_id, created_at, updated_at) VALUES
  (
    'bbbbbb01-0000-4000-8000-000000000001',
    'Développeur(se) Full-Stack React / Node.js',
    'Nous recrutons un(e) développeur(se) full-stack pour renforcer notre équipe produit à Douala.\r\n\r\nMissions :\r\n- Concevoir et développer des applications web et mobile (React, Node.js)\r\n- Participer aux revues de code et à la démonstration des fonctionnalités\r\n- Collaborer avec les équipes produit et design\r\n\r\nProfil recherché :\r\n- 3 ans d''expérience minimum sur des projets similaires\r\n- Maîtrise de TypeScript, PostgreSQL et Docker\r\n- Esprit d''analyse et capacité à travailler en autonomie\r\n\r\nAvantages : mutuelle, transport, possibilité de télétravail partiel.',
    'CFAO Technologies Cameroun',
    'Douala, Cameroun',
    450000, 750000, 'full-time', 'open',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00001',
    NOW() - INTERVAL '28 days', NOW()
  ),
  (
    'bbbbbb01-0000-4000-8000-000000000002',
    'Ingénieur(ne) DevOps / Cloud',
    'Rejoignez notre équipe infrastructure pour fiabiliser nos plateformes déployées chez les opérateurs de la sous-région.\r\n\r\nMissions :\r\n- Mettre en place CI/CD et infrastructure as code\r\n- Superviser la production et automatiser les déploiements\r\n- Garantir les performances et la sécurité des environnements\r\n\r\nQualifications : AWS/Azure, Kubernetes, Terraform. Expérience en environnement bancaire appréciée.',
    'CFAO Technologies Cameroun',
    'Douala, Cameroun',
    600000, 950000, 'contract', 'open',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00001',
    NOW() - INTERVAL '15 days', NOW()
  ),
  (
    'bbbbbb01-0000-4000-8000-000000000003',
    'Infirmier(ère) Diplômé(e) d''État',
    'La Clinique Espoir Santé recherche des IDE pour renforcer ses services d''urgence et de maternité à Yaoundé.\r\n\r\nMissions :\r\n- Assurer les soins infirmiers et le suivi des patients\r\n- Participer aux gardes et à la continuité des soins\r\n- Tenir à jour les dossiers de soins\r\n\r\nDiplôme d''État d''Infirmier exigé. Salaire attractif + primes de garde.',
    'Clinique Espoir Santé',
    'Yaoundé, Cameroun',
    350000, 520000, 'full-time', 'open',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00002',
    NOW() - INTERVAL '20 days', NOW()
  ),
  (
    'bbbbbb01-0000-4000-8000-000000000004',
    'Responsable des Ressources Humaines',
    'Nous créons un poste de RRH pour structurer notre croissance (120 collaborateurs).\r\n\r\nMissions : recrutement, paie, relations sociales, gestion de la formation.\r\n\r\nProfil : 5 ans d''expérience RH au Cameroun, bonne connaissance du code du travail OHADA, maîtrise d''un SIRH.',
    'Clinique Espoir Santé',
    'Yaoundé, Cameroun',
    500000, 700000, 'full-time', 'draft',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00002',
    NOW() - INTERVAL '5 days', NOW()
  ),
  (
    'bbbbbb01-0000-4000-8000-000000000005',
    'Chauffeur Livreur (permis C)',
    'Poste basé à Douala pour les livraisons urbaines et périurbaines.\r\n\r\nConditions :\r\n- Permis C valide et visite médicale à jour\r\n- Connaissance de la ville de Douala\r\n- Esprit d''équipe et respect des plannings\r\n\r\nPrime de rendement attractive, formation à la conduite sécurisée.',
    'Yango Logistics',
    'Douala, Cameroun',
    150000, 250000, 'part-time', 'open',
    '22222222-2222-4222-8222-222222222222',
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00003',
    NOW() - INTERVAL '12 days', NOW()
  ),
  (
    'bbbbbb01-0000-4000-8000-000000000006',
    'Coordinateur(trice) Logistique',
    'Superviser le corridor Douala – Yaoundé : planification des tournées, suivi des entrepôts et des transporteurs.\r\n\r\nProfil : formation en logistique ou supply chain, 3 ans d''expérience, maîtrise des outils de gestion d''entrepôt.',
    'Yango Logistics',
    'Douala, Cameroun',
    400000, 600000, 'full-time', 'open',
    '22222222-2222-4222-8222-222222222222',
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00003',
    NOW() - INTERVAL '9 days', NOW()
  ),
  (
    'bbbbbb01-0000-4000-8000-000000000007',
    'Ingénieur(ne) Génie Civil',
    'Projet de réhabilitation d''infrastructures portuaires à Limbé.\r\n\r\nMissions : études techniques, suivi des travaux, respect des normes et des délais.\r\n\r\nDiplôme d''ingénieur génie civil, expérience de 5 ans sur des ouvrages similaires, anglais souhaité.',
    'BTP Batirplus',
    'Limbé, Cameroun',
    550000, 850000, 'full-time', 'open',
    '22222222-2222-4222-8222-222222222222',
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00004',
    NOW() - INTERVAL '30 days', NOW()
  ),
  (
    'bbbbbb01-0000-4000-8000-000000000008',
    'Chef de Chantier',
    'Superviser un chantier de construction de logements sociaux à Bafoussam.\r\n\r\nProfil : 7 ans d''expérience, encadrement d''équipes, planification des ressources. Poste pourvu.',
    'BTP Batirplus',
    'Bafoussam, Cameroun',
    450000, 650000, 'contract', 'closed',
    '22222222-2222-4222-8222-222222222222',
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaa00004',
    NOW() - INTERVAL '45 days', NOW() - INTERVAL '3 days'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 5. Tâches
-- =====================================================================

INSERT INTO tasks (id, title, description, priority, status, due_date, job_id, assigned_to, created_by, created_at, updated_at) VALUES
  (
    'cccccccc-0000-4000-8000-000000000001',
    'Rédiger la fiche de poste Développeur Full-Stack',
    'Finaliser la description de poste, définir les missions et le profil recherché avant publication.',
    'high', 'done', NOW() - INTERVAL '2 days',
    'bbbbbb01-0000-4000-8000-000000000001',
    NULL,
    '11111111-1111-4111-8111-111111111111',
    NOW() - INTERVAL '30 days', NOW() - INTERVAL '28 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000002',
    'Trier les candidatures DevOps',
    'Trier les candidatures reçues et présélectionner 5 profils pour un premier entretien téléphonique.',
    'medium', 'in_progress', NOW() + INTERVAL '3 days',
    'bbbbbb01-0000-4000-8000-000000000002',
    '33333333-3333-4333-8333-333333333333',
    '11111111-1111-4111-8111-111111111111',
    NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day'
  ),
  (
    'cccccccc-0000-4000-8000-000000000003',
    'Planifier l''entretien technique Infirmier',
    'Fixer les créneaux d''entretien avec le chef de service et préparer la grille d''évaluation.',
    'medium', 'review', NOW() + INTERVAL '5 days',
    'bbbbbb01-0000-4000-8000-000000000003',
    '44444444-4444-4444-8444-444444444444',
    '11111111-1111-4111-8111-111111111111',
    NOW() - INTERVAL '8 days', NOW() - INTERVAL '2 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000004',
    'Relancer le prestataire de la paie',
    'Obtenir la clôture de la paie de décembre et vérifier les cotisations CNPS.',
    'urgent', 'todo', NOW() + INTERVAL '1 day',
    'bbbbbb01-0000-4000-8000-000000000004',
    NULL,
    '11111111-1111-4111-8111-111111111111',
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
  ),
  (
    'cccccccc-0000-4000-8000-000000000005',
    'Vérifier la flotte de livraison Douala',
    'Contrôler les visites techniques des véhicules et mettre à jour le carnet d''entretien.',
    'high', 'in_progress', NOW() + INTERVAL '4 days',
    'bbbbbb01-0000-4000-8000-000000000005',
    '44444444-4444-4444-8444-444444444444',
    '22222222-2222-4222-8222-222222222222',
    NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000006',
    'Mettre à jour le planning des tournées',
    'Réorganiser la tournée de vendredi suite aux embouteillages sur le boulevard de la Liberté.',
    'medium', 'done', NOW() - INTERVAL '1 day',
    'bbbbbb01-0000-4000-8000-000000000006',
    '33333333-3333-4333-8333-333333333333',
    '22222222-2222-4222-8222-222222222222',
    NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day'
  ),
  (
    'cccccccc-0000-4000-8000-000000000007',
    'Budgéter le chantier de Limbé',
    'Établir le métré et le budget prévisionnel du projet de réhabilitation portuaire.',
    'high', 'todo', NOW() + INTERVAL '7 days',
    'bbbbbb01-0000-4000-8000-000000000007',
    NULL,
    '22222222-2222-4222-8222-222222222222',
    NOW() - INTERVAL '12 days', NOW() - INTERVAL '4 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000008',
    'Évaluer les candidats Chef de Chantier',
    'Clôturer le processus de recrutement et archiver les dossiers des candidats retenus.',
    'low', 'done', NOW() - INTERVAL '4 days',
    'bbbbbb01-0000-4000-8000-000000000008',
    '44444444-4444-4444-8444-444444444444',
    '22222222-2222-4222-8222-222222222222',
    NOW() - INTERVAL '20 days', NOW() - INTERVAL '4 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000009',
    'Préparer le rapport mensuel des candidatures',
    'Compiler les statistiques de candidatures et de recrutement du mois à destination de la direction.',
    'low', 'todo', NOW() + INTERVAL '9 days',
    'bbbbbb01-0000-4000-8000-000000000001',
    NULL,
    '11111111-1111-4111-8111-111111111111',
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000010',
    'Former les nouveaux chauffeurs à la sécurité',
    'Organiser la session de formation sécurité routière pour les chauffeurs recrutés ce trimestre.',
    'medium', 'review', NOW() + INTERVAL '10 days',
    'bbbbbb01-0000-4000-8000-000000000005',
    NULL,
    '22222222-2222-4222-8222-222222222222',
    NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- Tâches supplémentaires (numéros 11 à 20)
INSERT INTO tasks (id, title, description, priority, status, due_date, job_id, assigned_to, created_by, created_at, updated_at) VALUES
  (
    'cccccccc-0000-4000-8000-000000000011',
    'Contacter les partenaires CNPS',
    'Régulariser les déclarations du trimestre et mettre à jour les contrats des nouveaux collaborateurs.',
    'medium', 'todo', NOW() + INTERVAL '6 days',
    'bbbbbb01-0000-4000-8000-000000000004',
    NULL,
    '11111111-1111-4111-8111-111111111111',
    NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000012',
    'Préparer la charte graphique du recrutement',
    'Créer les visuels des annonces pour les réseaux sociaux (LinkedIn, emplois.cm, réseaux locaux).',
    'low', 'done', NOW() - INTERVAL '3 days',
    'bbbbbb01-0000-4000-8000-000000000001',
    '33333333-3333-4333-8333-333333333333',
    '11111111-1111-4111-8111-111111111111',
    NOW() - INTERVAL '9 days', NOW() - INTERVAL '3 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000013',
    'Vérifier les candidatures Coordinateur Logistique',
    'Présélectionner les profils ayant une expérience en supply chain et en gestion d''entrepôt.',
    'medium', 'in_progress', NOW() + INTERVAL '2 days',
    'bbbbbb01-0000-4000-8000-000000000006',
    '44444444-4444-4444-8444-444444444444',
    '22222222-2222-4222-8222-222222222222',
    NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'
  ),
  (
    'cccccccc-0000-4000-8000-000000000014',
    'Établir la liste des fournisseurs de matériaux',
    'Comparer les devis ciment, fer et agrégats auprès des fournisseurs de Douala et Limbé.',
    'high', 'in_progress', NOW() + INTERVAL '4 days',
    'bbbbbb01-0000-4000-8000-000000000007',
    NULL,
    '22222222-2222-4222-8222-222222222222',
    NOW() - INTERVAL '11 days', NOW() - INTERVAL '3 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000015',
    'Mettre à jour le site carrières',
    'Publier les deux nouveaux postes de CFAO Technologies et corriger les salaires affichés.',
    'low', 'todo', NOW() + INTERVAL '8 days',
    'bbbbbb01-0000-4000-8000-000000000002',
    '44444444-4444-4444-8444-444444444444',
    '11111111-1111-4111-8111-111111111111',
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000016',
    'Organiser la journée portes ouvertes de Douala',
    'Préparer le stand Yango Logistics pour le salon Emploi & Carrières de Douala.',
    'high', 'review', NOW() + INTERVAL '8 days',
    'bbbbbb01-0000-4000-8000-000000000005',
    NULL,
    '22222222-2222-4222-8222-222222222222',
    NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day'
  ),
  (
    'cccccccc-0000-4000-8000-000000000017',
    'Recueillir les besoins en formation',
    'Sonder les collaborateurs sur les formations souhaitées et établir le plan annuel.',
    'medium', 'todo', NOW() + INTERVAL '11 days',
    'bbbbbb01-0000-4000-8000-000000000004',
    NULL,
    '11111111-1111-4111-8111-111111111111',
    NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000018',
    'Planifier le point hebdomadaire avec l''équipe',
    'Réserver la salle de réunion et préparer l''ordre du jour du lundi matin.',
    'low', 'done', NOW() - INTERVAL '5 days',
    'bbbbbb01-0000-4000-8000-000000000006',
    '33333333-3333-4333-8333-333333333333',
    '22222222-2222-4222-8222-222222222222',
    NOW() - INTERVAL '14 days', NOW() - INTERVAL '5 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000019',
    'Archiver les CV reçus',
    'Classer les candidatures traitées pour les services de garde et préparer les documents de délégation.',
    'low', 'todo', NOW() + INTERVAL '12 days',
    'bbbbbb01-0000-4000-8000-000000000003',
    '44444444-4444-4444-8444-444444444444',
    '11111111-1111-4111-8111-111111111111',
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000020',
    'Réceptionner les matériels du chantier de Limbé',
    'Contrôler la livraison des matériaux et vérifier le bon de commande transmis par le fournisseur.',
    'urgent', 'in_progress', NOW() + INTERVAL '1 day',
    'bbbbbb01-0000-4000-8000-000000000007',
    NULL,
    '22222222-2222-4222-8222-222222222222',
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 6. Candidatures
-- =====================================================================

INSERT INTO applications (id, job_id, user_id, cover_letter, resume_url, status, created_at, updated_at) VALUES
  (
    'dddddddd-0000-4000-8000-000000000001',
    'bbbbbb01-0000-4000-8000-000000000001',
    '33333333-3333-4333-8333-333333333333',
    'Madame, Monsieur,\r\n\r\nDéveloppeuse full-stack avec 4 ans d''expérience sur React et Node.js, je suis enthousiaste à l''idée de rejoindre CFAO Technologies pour contribuer à vos projets d''envergure régionale. Disponible immédiatement.\r\n\r\nAïcha Ngono.',
    'https://drive.google.com/cv-aicha-ngono.pdf',
    'accepted', NOW() - INTERVAL '21 days', NOW() - INTERVAL '2 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000002',
    'bbbbbb01-0000-4000-8000-000000000003',
    '33333333-3333-4333-8333-333333333333',
    'Bonjour, je suis IDE en urgence à l''hôpital Général de Douala depuis 3 ans et je souhaite rejoindre l''équipe de la clinique Espoir Santé à Yaoundé.',
    NULL,
    'shortlisted', NOW() - INTERVAL '15 days', NOW() - INTERVAL '6 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000003',
    'bbbbbb01-0000-4000-8000-000000000005',
    '33333333-3333-4333-8333-333333333333',
    'Disposant du permis C et d''une expérience de livraison urbaine de 2 ans à Douala, je postule avec plaisir à ce poste de chauffeur livreur.',
    NULL,
    'pending', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000004',
    'bbbbbb01-0000-4000-8000-000000000001',
    '44444444-4444-4444-8444-444444444444',
    'Développeur backend passionné, je maîtrise Node.js, PostgreSQL et Docker et souhaite évoluer dans une structure ambitieuse de la place.',
    NULL,
    'reviewed', NOW() - INTERVAL '18 days', NOW() - INTERVAL '4 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000005',
    'bbbbbb01-0000-4000-8000-000000000003',
    '44444444-4444-4444-8444-444444444444',
    'Infirmier diplômé d''État, spécialisé en soins intensifs, je me tiens à votre disposition pour un entretien.',
    NULL,
    'pending', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000006',
    'bbbbbb01-0000-4000-8000-000000000002',
    '44444444-4444-4444-8444-444444444444',
    'Profil DevOps junior certifié AWS, je souhaite m''épanouir dans une équipe infrastructure à la pointe.',
    NULL,
    'rejected', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000007',
    'bbbbbb01-0000-4000-8000-000000000008',
    '33333333-3333-4333-8333-333333333333',
    'Bien que le poste soit clôturé, je reste candidate pour de futures opportunités chez BTP Batirplus.',
    NULL,
    'rejected', NOW() - INTERVAL '40 days', NOW() - INTERVAL '35 days'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- Validation rapide
-- =====================================================================
SELECT 'entreprises' AS section, COUNT(*) AS total FROM companies
UNION ALL
SELECT 'offres', COUNT(*) FROM jobs
UNION ALL
SELECT 'taches', COUNT(*) FROM tasks
UNION ALL
SELECT 'candidatures', COUNT(*) FROM applications
UNION ALL
SELECT 'utilisateurs', COUNT(*) FROM auth.users WHERE email LIKE '%@warap.demo';