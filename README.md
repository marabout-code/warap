# warap — Services vérifiés au Cameroun

warap connecte les **clients** aux **prestataires de service** au Cameroun
(aide à domicile, soins, cours, conduite, bricolage…). Chaque prestataire est
**vérifié en personne par un agent local** avant l'engagement.

Built with **Next.js 14** (App Router), **TypeScript**, and **Supabase**.

## Features

- **Offres de service** — publier une offre de service, tarifs en FCFA, contact WhatsApp direct.
- **Catégories de service** — chaque offre est classée dans une catégorie (domicile, garde d'enfants, soins, conduite, cuisine, cours, bricolage, jardinage, sécurité, autre…), filtrable sur le tableau public et dans l'espace client.
- **Tableau d'offres public** (`/annonces`) — les prestataires au Cameroun découvrent les offres ouvertes par ville, catégorie et mot-clé, sans compte.
- **Réponse avec dossier** — le prestataire répond à une offre et téléverse ses pièces (CNI, références, casier judiciaire, diplômes…) ; les documents sont stockés dans un bucket Supabase Storage dédié.
- **Revue par offre** — le client consulte, trie (examinée / présélectionnée / rejetée / acceptée) et lance une demande de vérification auprès d'un agent, avec création de tâche.
- **Tableau de bord agent** (`/verifications`) — checklist terrain, notes, statut de vérification, rapport partagé avec le client.
- **Gestion des utilisateurs** (`/users`, réservé admin) — changer le rôle d'un compte (client / prestataire / agent / admin) et activer ou désactiver la connexion d'un utilisateur.
- **Authentication par code PIN** — connexion à 6 chiffres, sans email / mot de passe, sessions via Supabase Auth.
  - Routes protégées par middleware Next.js
  - Rôles : `admin`, `employer` (client), `agent` (vérificateur), `jobseeker` (prestataire)
  - Création automatique du profil à l'inscription, avec choix du profil (client, prestataire ou agent)
- **Gestion complète** — offres (CRUD + recherche/filtres), tâches & onboarding, réponses, profils.
- **Tableau de bord par rôle** — statistiques, actions rapides et contenus adaptés à chaque profil (client, prestataire, agent, admin).
- **Types d'engagement** — seuls `full-time` (temps plein), `part-time` (temps partiel) et `contract` (contrat) sont proposés dans l'interface ; les valeurs héritées `internship` / `remote` sont conservées en base pour compatibilité avec les anciennes annonces.
- **Mises à jour en temps réel** — flux live Supabase Realtime sur les offres / tâches / réponses.
- **Sécurité** — Row Level Security sur toutes les tables + Storage, validation Zod.

## Tech Stack

- Next.js 14.2 (App Router)
- TypeScript
- Supabase (Auth, Postgres, Realtime, RLS, Storage)
- Tailwind CSS
- React Hook Form + Zod (validation)

## Getting Started

### 1. Prerequisites

- Node.js 18.17+ / 20+
- A Supabase project (create one at [supabase.com](https://supabase.com))

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Get these from your Supabase project: **Settings → API**.

### 4. Set up the database

Run the schema migrations **in order** in the Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql` — tables, enums, RLS, triggers, indexes
2. `supabase/migrations/002_add_pin_to_profiles.sql` — PIN storage
3. `supabase/migrations/003_domestic_hiring.sql` — rôle `agent`, enum `verification_status`, pack de vérification sur les candidatures (`documents`, `verified_by`, `verification_notes`, `verified_at`), `contact_phone`
4. `supabase/migrations/004_agent_rls.sql` — politiques RLS du rôle agent
5. `supabase/migrations/005_candidate_documents.sql` — bucket Storage `documents` + politiques, checklist de vérification (`verification_checklist`)
6. `supabase/migrations/006_super_admin_user_management.sql` — statut de compte (`account_status`), politique RLS d'administration, compte super admin
7. `supabase/migrations/007_service_categories.sql` — colonne `category` sur `jobs` + index

Each migration is idempotent and safe to re-run.

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sample Data (service marketplace)

- `supabase/seed_domestic_workers.sql` — clients (Paris/Londres), un agent vérificateur local, prestataires (aide à domicile, nounou, gouvernante, chauffeur), offres classées par catégorie (household, childcare, driving, elderly-care…), réponses et tâches d'onboarding/vérification.
- `supabase/reset_domestic_workers.sql` — wipes only this dataset; re-run the seed to reinitialize.

Demo accounts — log in with the 6-digit PIN:

| Name               | Role               | PIN      |
| ------------------ | ------------------ | -------- |
| Mireille Kouam     | client (Paris)     | `111222` |
| Charles Ngo Bakai  | client (London)    | `222333` |
| Yannick Fokou      | agent (Douala)     | `333444` |
| Solange Andela     | prestataire (aide à domicile) | `444555` |
| Marthe Tchoupo     | prestataire (nounou) | `555666` |
| Honorine Nana      | prestataire (gouvernante) | `666777` |
| Serge Ekambi       | prestataire (chauffeur) | `777888` |
| Pondy Code         | admin (super-admin) | `130471` |

Le super administrateur (`pondycode@gmail.com` / PIN `130471`) se connecte comme
tous les comptes et accède à la page **Utilisateurs** (`/users`) pour attribuer les
rôles et activer/désactiver les comptes.

## Project Structure

```
src/
├── app/
│   ├── (app)/                 # Protected route group (middleware-gated)
│   │   ├── layout.tsx         # Dashboard shell: sidebar, header, auth
│   │   ├── dashboard/         # Overview with stats & live updates
│   │   ├── jobs/              # Offres : liste, création, détail, édition, réponse
│   │   ├── applications/      # Réponses & vérifications
│   │   ├── verifications/     # Tableau de bord agent-vérificateur
│   │   ├── users/             # Gestion des utilisateurs (admin : rôles & statuts)
│   │   ├── tasks/             # Tâches & onboarding
│   │   └── profile/           # Profil utilisateur
│   ├── annonces/              # Tableau public des offres (+ détail)
│   ├── login/                 # Connexion PIN
│   ├── register/              # Inscription
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/                # UI kit, logo, en-têtes/footers publics, feed temps réel, toasts
├── lib/
│   ├── roles.ts               # Navigation & libellés par rôle
│   ├── service-categories.ts  # Catégories de service (config statique)
│   ├── status-labels.ts       # Libellés, tarifs, WhatsApp, types de pièces
│   └── supabase/              # Clients navigateur / serveur / middleware
├── types/                     # Types base de données & lignes
└── middleware.ts              # Protection des routes par session
```

## Security

- **Row Level Security**: every table enforces RLS; the `documents` Storage bucket only allows uploads into the authenticated user's own folder.
  - Jobs: anyone can view; only employers/admins can create/update/delete their own
  - Tasks: creator, assignee, or admin
  - Applications: respondent, job poster, or admin; agents can read/update for verification
  - Profiles: public read; user updates their own; admins can update any role/`account_status`
- **Middleware**: Unauthenticated users are redirected away from protected routes; `/annonces` stays public; authenticated users are kept out of login/register.
- **Server validation**: Zod schemas validate form input before submission; RLS enforces authorization server-side.

## Scripts

| Command          | Description                     |
| ---------------- | ------------------------------- |
| `npm run dev`    | Start the development server    |
| `npm run build`  | Production build + type check   |
| `npm run start`  | Start the production server     |
| `npm run lint`   | Run ESLint                      |