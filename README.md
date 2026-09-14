# warap

A production-ready warap management application built with **Next.js 14** (App Router), **TypeScript**, and **Supabase** as the backend service.

## Features

- **Authentication** - Email/password signup & login with session management via Supabase Auth
  - Protected routes via Next.js middleware
  - Role-based access (admin, employer, jobseeker)
  - Automatic profile creation on signup
- **Job Management** - Full CRUD for job listings
  - Search, filter by status, salary ranges, employment types
- **Task Management** - Task tracking within jobs
  - Priority levels, statuses, assignment, due dates
- **Applications** - Track and manage job applications with status workflows
- **Real-time Updates** - Live feeds for jobs/tasks/applications changes via Supabase Realtime
- **Profiles** - User profile management
- **Security** - Row Level Security (RLS) policies on all tables, server-side validation with Zod
- **Performance** - Optimized DB indexes, client-side data fetching, static prerendering where safe

## Tech Stack

- Next.js 14.2 (App Router)
- TypeScript
- Supabase (Auth, Postgres, Realtime, RLS)
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

Then edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Get these from your Supabase project: **Settings → API**.

### 4. Set up the database

Run the schema migration in the Supabase SQL Editor (or via CLI):

```bash
supabase db push
```

Or paste the contents of `supabase/migrations/001_initial_schema.sql` into the Supabase SQL Editor and run it.

This creates:
- Tables: `profiles`, `companies`, `jobs`, `tasks`, `applications`
- Enums: `user_role`, `employment_type`, `job_status`, `task_priority`, `task_status`, `application_status`
- Row Level Security policies for all tables
- Auto-profile-creation trigger on auth signup
- `updated_at` timestamps triggers
- Optimized database indexes

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (app)/                 # Protected route group (middleware-gated)
│   │   ├── layout.tsx         # Dashboard shell: sidebar, header, auth
│   │   ├── dashboard/         # Overview with stats & live updates
│   │   ├── jobs/              # Job list, create, detail, edit
│   │   ├── tasks/             # Task list, create, detail, edit
│   │   ├── applications/      # Application tracking
│   │   └── profile/           # User profile management
│   ├── login/                 # Sign in
│   ├── register/              # Sign up
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/                # Reusable UI components (realtime feed, toasts, UI kit)
├── lib/
│   └── supabase/              # Browser / server / middleware clients
├── types/                     # Database & row types
└── middleware.ts              # Auth route protection
```

## Security

- **Row Level Security**: Every table enforces RLS. Policies restrict access by authenticated user ID and role:
  - Jobs: anyone can view; only employers/admins can create/update/delete their own
  - Tasks: creator, assignee, or admin
  - Applications: applicant or the job poster
- **Middleware**: Unauthenticated users are redirected away from protected routes; authenticated users are kept out of login/register.
- **Server validation**: Zod schemas validate all form input on the client before submission; RLS enforces authorization server-side.

## Scripts

| Command          | Description                     |
| ---------------- | ------------------------------- |
| `npm run dev`    | Start the development server    |
| `npm run build`  | Production build + type check   |
| `npm run start`  | Start the production server     |
| `npm run lint`   | Run ESLint                      |

## Database Migration

The full schema with RLS policies lives in `supabase/migrations/001_initial_schema.sql`. Re-run this file anytime against a fresh Supabase project to bootstrap the backend.