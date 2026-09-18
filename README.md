# warap — Personnel domestique vérifié au Cameroun

warap connecte les familles de la **diaspora camerounaise** aux aides ménagères,
nounous, chauffeurs et gouvernantes au pays. Chaque candidat est **vérifié en
personne par un agent local** avant l'embauche.

Built with **Next.js 14** (App Router), **TypeScript**, and **Supabase**.

## Features

- **Recrutement diaspora** — publier un poste depuis l'étranger, salaires en FCFA, contact WhatsApp direct.
- **Tableau d'annonces public** (`/annonces`) — les candidats au Cameroun découvrent les offres ouvertes par ville et mot-clé, sans compte.
- **Candidature avec dossier** — le candidat postule, téléverse ses pièces (CNI, références, casier judiciaire, diplômes…) ; les documents sont stockés dans un bucket Supabase Storage dédié.
- **Revue par annonce** — la famille consulte, trie (examinée / présélectionnée / rejetée / acceptée) et lance une demande de vérification auprès d'un agent, avec création de tâche.
- **Tableau de bord agent** (`/verifications`) — checklist terrain, notes, statut de vérification, rapport partagé avec la famille.
- **Authentication par code PIN** — connexion à 6 chiffres, sans email / mot de passe, sessions via Supabase Auth.
  - Routes protégées par middleware Next.js
  - Rôles : `admin`, `employer` (famille), `agent` (vérificateur), `jobseeker` (candidat)
  - Création automatique du profil à l'inscription (rôle par défaut : candidat)
- **Gestion complète** — annonces (CRUD + recherche/filtres), tâches & onboarding, candidatures, profils.
- **Mises à jour en temps réel** — flux live Supabase Realtime sur les annonces / tâches / candidatures.
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

Each migration is idempotent and safe to re-run.

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sample Data (domestic worker hiring)

- `supabase/seed_domestic_workers.sql` — diaspora employers (Paris/London), a local verification agent, maid/nanny/governess/driver candidates, jobs, applications and onboarding/verification tasks.
- `supabase/reset_domestic_workers.sql` — wipes only this dataset; re-run the seed to reinitialize.

Demo accounts — log in with the 6-digit PIN:

| Name               | Role               | PIN      |
| ------------------ | ------------------ | -------- |
| Mireille Kouam     | employer (Paris)   | `111222` |
| Charles Ngo Bakai  | employer (London)  | `222333` |
| Yannick Fokou      | agent (Douala)     | `333444` |
| Solange Andela     | jobseeker (maid)   | `444555` |
| Marthe Tchoupo     | jobseeker (nanny)  | `555666` |
| Honorine Nana      | jobseeker (housekeep.) | `666777` |
| Serge Ekambi       | jobseeker (driver) | `777888` |

## Project Structure

```
src/
├── app/
│   ├── (app)/                 # Protected route group (middleware-gated)
│   │   ├── layout.tsx         # Dashboard shell: sidebar, header, auth
│   │   ├── dashboard/         # Overview with stats & live updates
│   │   ├── jobs/              # Annonces: list, create, detail, edit, apply
│   │   ├── applications/      # Candidatures & vérifications
│   │   ├── verifications/     # Tableau de bord agent-vérificateur
│   │   ├── tasks/             # Tâches & onboarding
│   │   └── profile/           # Profil utilisateur
│   ├── annonces/              # Tableau public des annonces (+ détail)
│   ├── login/                 # Connexion PIN
│   ├── register/              # Inscription
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/                # UI kit, logo, en-têtes/footers publics, feed temps réel, toasts
├── lib/
│   ├── roles.ts               # Navigation & libellés par rôle
│   ├── status-labels.ts       # Libellés, salaires, WhatsApp, types de pièces
│   └── supabase/              # Clients navigateur / serveur / middleware
├── types/                     # Types base de données & lignes
└── middleware.ts              # Protection des routes par session
```

## Security

- **Row Level Security**: every table enforces RLS; the `documents` Storage bucket only allows uploads into the authenticated user's own folder.
  - Jobs: anyone can view; only employers/admins can create/update/delete their own
  - Tasks: creator, assignee, or admin
  - Applications: applicant, job poster, or admin; agents can read/update for verification
- **Middleware**: Unauthenticated users are redirected away from protected routes; `/annonces` stays public; authenticated users are kept out of login/register.
- **Server validation**: Zod schemas validate form input before submission; RLS enforces authorization server-side.

## Scripts

| Command          | Description                     |
| ---------------- | ------------------------------- |
| `npm run dev`    | Start the development server    |
| `npm run build`  | Production build + type check   |
| `npm run start`  | Start the production server     |
| `npm run lint`   | Run ESLint                      |