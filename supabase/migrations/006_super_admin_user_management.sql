-- =====================================================================
-- warap - Gestion des utilisateurs + compte super administrateur
-- ---------------------------------------------------------------------
-- À exécuter dans le SQL Editor du dashboard Supabase, APRÈS les
-- migrations 001 à 005.
--
-- 1. Ajoute le champ account_status (active | disabled) aux profils.
-- 2. Autorise les administrateurs à prendre en charge les profils
--    (changer le rôle, activer/désactiver un compte).
-- 3. Crée le compte super administrateur :
--       email : pondycode@gmail.com
--       PIN   : 130471
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================================
-- 1. Statut de compte
-- =====================================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'active'
  CHECK (account_status IN ('active', 'disabled'));

-- =====================================================================
-- 2. Politique RLS : les administrateurs gèrent tous les profils
-- =====================================================================

DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (true);

-- =====================================================================
-- 3. Compte super administrateur
-- =====================================================================

-- Auth user (email pondycode@gmail.com)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'authenticated', 'authenticated', 'pondycode@gmail.com',
  crypt('Adm!n@2026#w4rAp', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Pondy Code"}',
  '', '', '', '',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Profil : rôle administrateur + accès PIN (130471)
UPDATE profiles SET
  role = 'admin',
  phone = NULL,
  location = 'Douala, Cameroun',
  bio = 'Super administrateur warap : gestion des comptes, des rôles et des permissions.',
  website = NULL,
  pin_hash = crypt('130471', gen_salt('bf', 10)),
  pin_lookup = encode(digest('130471'::bytea, 'sha256'), 'hex'),
  supabase_auth_secret = 'Adm!n@2026#w4rAp',
  account_status = 'active'
WHERE id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

-- =====================================================================
-- Validation
-- =====================================================================
SELECT 'super_admin' AS compte, email, role, account_status
FROM profiles WHERE id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';