-- =====================================================================
-- warap - Données de démonstration : recrutement de personnel
--           domestique au Cameroun depuis l'étranger (diaspora)
-- ---------------------------------------------------------------------
-- À exécuter dans le SQL Editor du dashboard Supabase, APRÈS avoir
-- exécuté les migrations 001, 002, 003 et 004.
--
-- Réexécutable (UUID fixes + ON CONFLICT DO NOTHING).
-- Pour REINITIALISER : exécuter reset_domestic_workers.sql, puis ce
-- script à nouveau.
--
-- Comptes démo (login = PIN à 6 chiffres) :
--   Mireille Kouam      (employeur, diaspora Paris)   PIN 111222
--   Charles Ngo Bakai   (employeur, diaspora Londres) PIN 222333
--   Yannick Fokou       (agent vérificateur, Douala)  PIN 333444
--   Solange Andela      (aide ménagère, Douala)       PIN 444555
--   Marthe Tchoupo      (nounou, Yaoundé)             PIN 555666
--   Honorine Nana       (gouvernante, Douala)         PIN 666777
--   Serge Ekambi        (chauffeur, Douala)           PIN 777888
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================================
-- 1. Utilisateurs de démonstration
-- =====================================================================

-- Mireille Kouam - Employeur (famille à Paris)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '66666661-1111-4111-8111-666666666661',
  'authenticated', 'authenticated', 'mireille.kouam@warap.demo',
  crypt('Mir3iK!4rap2026#a8', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Mireille Kouam"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Charles Ngo Bakai - Employeur (famille à Londres)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '66666662-2222-4222-8222-666666666662',
  'authenticated', 'authenticated', 'charles.ngobakai@warap.demo',
  crypt('Cha4lS!4rap2026#b9', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Charles Ngo Bakai"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Yannick Fokou - Agent vérificateur local (Douala)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '66666663-3333-4333-8333-666666666663',
  'authenticated', 'authenticated', 'yannick.fokou@warap.demo',
  crypt('Yan5iK!4rap2026#c10', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Yannick Fokou"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Solange Andela - Candidate (aide ménagère)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '66666664-4444-4444-8444-666666666664',
  'authenticated', 'authenticated', 'solange.andela@warap.demo',
  crypt('Sol6aA!4rap2026#d11', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Solange Andela"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Marthe Tchoupo - Candidate (nounou)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '66666665-5555-4555-8555-666666666665',
  'authenticated', 'authenticated', 'marthe.tchoupo@warap.demo',
  crypt('Mar7eT!4rap2026#e12', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Marthe Tchoupo"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Honorine Nana - Candidate (gouvernante)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '66666666-6666-4666-8666-666666666666',
  'authenticated', 'authenticated', 'honorine.nana@warap.demo',
  crypt('Hon8oN!4rap2026#f13', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Honorine Nana"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Serge Ekambi - Candidat (chauffeur)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '66666667-7777-4777-8777-666666666667',
  'authenticated', 'authenticated', 'serge.ekambi@warap.demo',
  crypt('Ser9gE!4rap2026#g14', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Serge Ekambi"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 2. Profils : rôle, téléphone, accès PIN
-- =====================================================================

UPDATE profiles SET
  role = 'employer',
  phone = '+33 6 12 34 56 78',
  location = 'Paris, France (diaspora)',
  bio = 'Recrute une aide ménagère et un chauffeur à Douala pour son domicile. Séjours réguliers au Cameroun.',
  website = NULL,
  pin_hash = crypt('111222', gen_salt('bf', 10)),
  pin_lookup = encode(digest('111222'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Mir3iK!4rap2026#a8'
WHERE id = '66666661-1111-4111-8111-666666666661';

UPDATE profiles SET
  role = 'employer',
  phone = '+44 77 00 90 12 34',
  location = 'Londres, Royaume-Uni (diaspora)',
  bio = 'Cherche une nounou/gouvernante pour ses enfants à Yaoundé. Sera présent au Cameroun en décembre pour les entretiens.',
  website = NULL,
  pin_hash = crypt('222333', gen_salt('bf', 10)),
  pin_lookup = encode(digest('222333'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Cha4lS!4rap2026#b9'
WHERE id = '66666662-2222-4222-8222-666666666662';

UPDATE profiles SET
  role = 'agent',
  phone = '+237 6 55 00 11 22',
  location = 'Douala, Cameroun',
  bio = 'Agent vérificateur local : entretiens en personne, contrôle des documents (CNI, références), visite médicale et suivi des dossiers pour les familles de la diaspora.',
  website = NULL,
  pin_hash = crypt('333444', gen_salt('bf', 10)),
  pin_lookup = encode(digest('333444'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Yan5iK!4rap2026#c10'
WHERE id = '66666663-3333-4333-8333-666666666663';

UPDATE profiles SET
  role = 'jobseeker',
  phone = '+237 6 88 33 44 55',
  location = 'Douala, Cameroun',
  bio = 'Aide ménagère expérimentée, 6 ans d''expérience, références sérieuses. Disponible pour une famille à Douala.',
  website = NULL,
  pin_hash = crypt('444555', gen_salt('bf', 10)),
  pin_lookup = encode(digest('444555'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Sol6aA!4rap2026#d11'
WHERE id = '66666664-4444-4444-8444-666666666664';

UPDATE profiles SET
  role = 'jobseeker',
  phone = '+237 6 90 22 33 44',
  location = 'Yaoundé, Cameroun',
  bio = 'Nounou diplômée en puériculture, garde d''enfants de 0 à 6 ans, premiers soins. Sérieuse et ponctuelle.',
  website = NULL,
  pin_hash = crypt('555666', gen_salt('bf', 10)),
  pin_lookup = encode(digest('555666'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Mar7eT!4rap2026#e12'
WHERE id = '66666665-5555-4555-8555-666666666665';

UPDATE profiles SET
  role = 'jobseeker',
  phone = '+237 6 77 44 55 66',
  location = 'Douala, Cameroun',
  bio = 'Gouvernante de maison, gestion du personnel domestique, cuisine et organisation d''événements familiaux.',
  website = NULL,
  pin_hash = crypt('666777', gen_salt('bf', 10)),
  pin_lookup = encode(digest('666777'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Hon8oN!4rap2026#f13'
WHERE id = '66666666-6666-4666-8666-666666666666';

UPDATE profiles SET
  role = 'jobseeker',
  phone = '+237 6 55 66 77 88',
  location = 'Douala, Cameroun',
  bio = 'Chauffeur avec permis B et C, 10 ans d''expérience, grandes connaissances de Douala et de la côte.',
  website = NULL,
  pin_hash = crypt('777888', gen_salt('bf', 10)),
  pin_lookup = encode(digest('777888'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Ser9gE!4rap2026#g14'
WHERE id = '66666667-7777-4777-8777-666666666667';

-- =====================================================================
-- 3. Offres (particuliers - diaspora, sans société, company_id NULL)
-- =====================================================================

INSERT INTO jobs (id, title, description, company, location, salary_min, salary_max, employment_type, status, posted_by, company_id, contact_phone, created_at, updated_at) VALUES
  (
    'bbbbbb02-0000-4000-8000-000000000001',
    'Aide ménagère à domicile (famille expatriée)',
    'Recherche d''une aide ménagère expérimentée pour un domicile à Douala (Bonapriso).\r\n\r\nMissions :\r\n- Entretien de la maison et lessive\r\n- Préparation des repas simples\r\n- Courses et rangement\r\n\r\nProfil : personne de confiance, références vérifiables, dispo 5 jours/semaine.\r\nSalaire en fonction du profil.', 
    'Particulier – Mme Mireille Kouam',
    'Douala (Bonapriso), Cameroun',
    50000, 80000, 'full-time', 'open',
    '66666661-1111-4111-8111-666666666661',
    NULL,
    '+237 6 77 11 22 33',
    NOW() - INTERVAL '12 days', NOW()
  ),
  (
    'bbbbbb02-0000-4000-8000-000000000002',
    'Nounou / Gouvernante pour famille',
    'Nous cherchons une nounou ou gouvernante pour deux enfants (3 et 5 ans) à Yaoundé (Bastos).\r\n\r\nMissions :\r\n- Garde des enfants et aide aux devoirs\r\n- Préparation des repas des enfants\r\n- Entretien de la maison\r\n\r\nSeuls les profils avec références et pièces vérifiées par notre agent local seront considérés.',
    'Particulier – M. Charles Ngo Bakai',
    'Yaoundé (Bastos), Cameroun',
    70000, 120000, 'contract', 'open',
    '66666662-2222-4222-8222-666666666662',
    NULL,
    '+237 6 99 88 77 66',
    NOW() - INTERVAL '20 days', NOW()
  ),
  (
    'bbbbbb02-0000-4000-8000-000000000003',
    'Chauffeur / Homme à tout faire',
    'Poste à Douala pour le transport de la famille et l''entretien de la voiture.\r\n\r\nExigences :\r\n- Permis B valide et expérience confirmée\r\n- Sobriété et ponctualité\r\n- Disponible les week-ends\r\n\r\nVérification du permis par notre agent local avant recrutement.',
    'Particulier – Mme Mireille Kouam',
    'Douala (Akwa), Cameroun',
    80000, 130000, 'full-time', 'open',
    '66666661-1111-4111-8111-666666666661',
    NULL,
    '+237 6 77 11 22 33',
    NOW() - INTERVAL '9 days', NOW()
  ),
  (
    'bbbbbb02-0000-4000-8000-000000000004',
    'Aide à domicile pour personne âgée',
    'Aide à domicile pour une personne âgée à Douala (Makepe).\r\n\r\nMissions :\r\n- Présence et compagnie\r\n- Aide aux repas et médicaments\r\n- Entretien courant\r\n\r\nProfil bienveillant et patient, références appréciées.',
    'Particulier – M. Charles Ngo Bakai',
    'Douala (Maképé), Cameroun',
    40000, 65000, 'part-time', 'open',
    '66666662-2222-4222-8222-666666666662',
    NULL,
    '+237 6 99 88 77 66',
    NOW() - INTERVAL '5 days', NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 4. Candidatures (avec pack de vérification)
-- =====================================================================

INSERT INTO applications (
  id, job_id, user_id, cover_letter, resume_url, contact_phone,
  documents, verification_status, verified_by, verification_notes, verified_at,
  status, created_at, updated_at
) VALUES
  (
    'dddddddd-0000-4000-8000-000000000011',
    'bbbbbb02-0000-4000-8000-000000000001',
    '66666664-4444-4444-8444-666666666664',
    'Madame, Monsieur,\r\n\r\nAide ménagère avec 6 ans d''expérience à Douala, je propose mes services en toute confiance. Mes anciennes employeuses peuvent témoigner de ma rigueur et de mon sérieux.\r\n\r\nSolange Andela.',
    'https://drive.google.com/cv-solange-andela.pdf',
    '+237 6 88 33 44 55',
    '[
      {"name":"Carte nationale d''identité","type":"cni","url":"https://drive.google.com/cni-solange.pdf"},
      {"name":"Références ancienne employeuse (Mme Diallo)","type":"reference","url":"https://drive.google.com/ref-solange.pdf"},
      {"name":"Casier judiciaire","type":"casier","url":"https://drive.google.com/casier-solange.pdf"}
    ]'::jsonb,
    'verified',
    '66666663-3333-4333-8333-666666666663',
    'Documents contrôlés en personne à Bonapriso. CNI valide, références confirmées par téléphone, casier vierge.',
    NOW() - INTERVAL '4 days',
    'shortlisted', NOW() - INTERVAL '10 days', NOW() - INTERVAL '4 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000012',
    'bbbbbb02-0000-4000-8000-000000000002',
    '66666665-5555-4555-8555-666666666665',
    'Bonjour, nounou diplômée en puériculture, je garde les enfants avec beaucoup de soin et d''attention. Références disponibles.',
    NULL,
    '+237 6 90 22 33 44',
    '[
      {"name":"Diplôme de puériculture","type":"diplome","url":"https://drive.google.com/diplome-marthe.pdf"}
    ]'::jsonb,
    'in_review',
    '66666663-3333-4333-8333-666666666663',
    'Entretien téléphonique effectué. En attente du contrôle du diplôme original.',
    NOW() - INTERVAL '2 days',
    'reviewed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '2 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000013',
    'bbbbbb02-0000-4000-8000-000000000001',
    '66666666-6666-4666-8666-666666666666',
    'Gouvernante de maison expérimentée, je gère entretien, cuisine et organisation. À votre disposition.',
    NULL,
    '+237 6 77 44 55 66',
    '[]'::jsonb,
    'unverified',
    NULL,
    NULL,
    NULL,
    'pending', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000014',
    'bbbbbb02-0000-4000-8000-000000000003',
    '66666667-7777-4777-8777-666666666667',
    'Chauffeur expérimenté (permis B et C), je connais parfaitement Douala et la côte. Sobre et ponctuel.',
    'https://drive.google.com/cv-serge-ekambi.pdf',
    '+237 6 55 66 77 88',
    '[
      {"name":"Permis de conduire B","type":"permis","url":"https://drive.google.com/permis-serge.pdf"},
      {"name":"Lettre de recommandation ancien employeur","type":"reference","url":"https://drive.google.com/rec-serge.pdf"}
    ]'::jsonb,
    'verified',
    '66666663-3333-4333-8333-666666666663',
    'Permis original contrôlé, référence par écrit de l''ancien employeur reçue.',
    NOW() - INTERVAL '6 days',
    'shortlisted', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000015',
    'bbbbbb02-0000-4000-8000-000000000002',
    '66666666-6666-4666-8666-666666666666',
    'Je postule pour le poste de gouvernante à Bastos. Expérience en gestion de personnel domestique.',
    NULL,
    '+237 6 77 44 55 66',
    '[]'::jsonb,
    'rejected',
    '66666663-3333-4333-8333-666666666663',
    'Références non confirmées après deux tentatives de contact avec l''employeur précédent.',
    NOW() - INTERVAL '3 days',
    'rejected', NOW() - INTERVAL '18 days', NOW() - INTERVAL '3 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000016',
    'bbbbbb02-0000-4000-8000-000000000004',
    '66666665-5555-4555-8555-666666666665',
    'Disponible pour une aide à domicile pour personne âgée à Maképé, bienveillante et patiente.',
    NULL,
    '+237 6 90 22 33 44',
    '[]'::jsonb,
    'unverified',
    NULL,
    NULL,
    NULL,
    'pending', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'
  ),
  (
    'dddddddd-0000-4000-8000-000000000017',
    'bbbbbb02-0000-4000-8000-000000000003',
    '66666664-4444-4444-8444-666666666664',
    'Je postule également comme homme à tout faire à Akwa. Sérieuse et volontaire.',
    NULL,
    '+237 6 88 33 44 55',
    '[]'::jsonb,
    'in_review',
    '66666663-3333-4333-8333-666666666663',
    'Vérification des références en cours.',
    NOW() - INTERVAL '1 day',
    'reviewed', NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 5. Tâches d'onboarding / vérification (assigées à l'agent local)
-- =====================================================================

INSERT INTO tasks (id, title, description, priority, status, due_date, job_id, assigned_to, created_by, created_at, updated_at) VALUES
  (
    'cccccccc-0000-4000-8000-000000000021',
    'Vérifier les références de Solange Andela',
    'Contacter les anciennes employeuses et confirmer les dates d''emploi. Mettre à jour le statut de vérification.',
    'high', 'done', NOW() - INTERVAL '3 days',
    'bbbbbb02-0000-4000-8000-000000000001',
    '66666663-3333-4333-8333-666666666663',
    '66666661-1111-4111-8111-666666666661',
    NOW() - INTERVAL '11 days', NOW() - INTERVAL '4 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000022',
    'Planifier la visite médicale',
    'Programmer la visite médicale de Solange auprès d''un centre agréé à Douala et récupérer le certificat.',
    'medium', 'in_progress', NOW() + INTERVAL '3 days',
    'bbbbbb02-0000-4000-8000-000000000001',
    '66666663-3333-4333-8333-666666666663',
    '66666661-1111-4111-8111-666666666661',
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'
  ),
  (
    'cccccccc-0000-4000-8000-000000000023',
    'Préparer le contrat de travail',
    'Rédiger le contrat (code du travail, CNPS) avec la famille Ngo Bakai et le faire signer à Yaoundé.',
    'high', 'todo', NOW() + INTERVAL '6 days',
    'bbbbbb02-0000-4000-8000-000000000002',
    '66666663-3333-4333-8333-666666666663',
    '66666662-2222-4222-8222-666666666662',
    NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
  ),
  (
    'cccccccc-0000-4000-8000-000000000024',
    'Contrôler le permis de Serge Ekambi',
    'Vérifier l''original du permis B et effectuer un essai de conduite de sécurité.',
    'urgent', 'in_progress', NOW() + INTERVAL '2 days',
    'bbbbbb02-0000-4000-8000-000000000003',
    '66666663-3333-4333-8333-666666666663',
    '66666661-1111-4111-8111-666666666661',
    NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'
  ),
  (
    'cccccccc-0000-4000-8000-000000000025',
    'Appel WhatsApp de présentation avec la famille',
    'Organiser l''appel vidéo entre Mme Kouam, son agent et la candidate présélectionnée.',
    'medium', 'review', NOW() + INTERVAL '4 days',
    'bbbbbb02-0000-4000-8000-000000000001',
    '66666663-3333-4333-8333-666666666663',
    '66666661-1111-4111-8111-666666666661',
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
  ),
  (
    'cccccccc-0000-4000-8000-000000000026',
    'Constituer le dossier CNPS',
    'Rassembler les pièces (CNI, photos, contrat) et déposer le dossier à la CNPS de Douala.',
    'low', 'todo', NOW() + INTERVAL '7 days',
    'bbbbbb02-0000-4000-8000-000000000002',
    '66666663-3333-4333-8333-666666666663',
    '66666662-2222-4222-8222-666666666662',
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- Validation rapide
-- =====================================================================
SELECT 'offres domestiques' AS section, COUNT(*) AS total FROM jobs WHERE company_id IS NULL
UNION ALL
SELECT 'candidatures', COUNT(*) FROM applications WHERE job_id::text LIKE 'bbbbbb02%'
UNION ALL
SELECT 'taches verification', COUNT(*) FROM tasks WHERE assigned_to = '66666663-3333-4333-8333-666666666663'
UNION ALL
SELECT 'utilisateurs', COUNT(*) FROM auth.users WHERE email LIKE '%@warap.demo';