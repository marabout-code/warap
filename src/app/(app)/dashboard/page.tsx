"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import RealtimeUpdates from "@/components/realtime-updates";
import { statusLabel } from "@/lib/status-labels";
import { roleMeta, type UserRole } from "@/lib/roles";

interface StatDef {
  name: string;
  href: string;
  icon: string;
  gradient: string;
  ring: string;
}

interface QuickAction {
  href: string;
  title: string;
  desc: string;
  icon: string;
  gradient: string;
}

interface RecentItem {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeTone: "success" | "danger" | "warning" | "neutral";
}

const ICONS = {
  jobs: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
  open:
    "M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
  tasks: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  applications:
    "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  verifications:
    "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  profile:
    "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  users:
    "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  plus: "M12 4.5v15m7.5-7.5h-15",
};

const GRADIENTS = {
  primary: "from-primary-600 to-primary-500",
  emerald: "from-emerald-500 to-emerald-600",
  accent: "from-accent-600 to-accent-400",
  amber: "from-amber-500 to-orange-500",
};

type Role = Exclude<UserRole, "jobseeker"> | "jobseeker";

const DASHBOARD_CONFIG: Record<
  Role,
  {
    stats: StatDef[];
    heroActions: { label: string; href: string; primary: boolean }[];
    quickActions: QuickAction[];
    recent: { title: string; allHref: string; emptyText: string; emptyHref: string; emptyLabel: string };
  }
> = {
  employer: {
    stats: [
      { name: "Mes annonces", href: "/jobs", icon: ICONS.jobs, gradient: GRADIENTS.primary, ring: "bg-primary-50", },
      { name: "Annonces ouvertes", href: "/jobs?status=open", icon: ICONS.open, gradient: GRADIENTS.emerald, ring: "bg-emerald-50", },
      { name: "Candidatures reçues", href: "/applications", icon: ICONS.applications, gradient: GRADIENTS.amber, ring: "bg-amber-50", },
      { name: "Candidatures en attente", href: "/applications", icon: ICONS.applications, gradient: GRADIENTS.accent, ring: "bg-accent-50", },
      { name: "Vérifications en cours", href: "/applications", icon: ICONS.verifications, gradient: GRADIENTS.primary, ring: "bg-primary-50", },
    ],
    heroActions: [
      { label: "Publier une annonce", href: "/jobs/new", primary: true },
      { label: "Voir les tâches", href: "/tasks", primary: false },
    ],
    quickActions: [
      { href: "/jobs/new", title: "Publier une annonce", desc: "Décrivez le poste, la ville et le salaire en FCFA", icon: ICONS.plus, gradient: GRADIENTS.primary },
      { href: "/applications", title: "Examiner mes candidatures", desc: "Triez, présélectionnez et demandez la vérification", icon: ICONS.applications, gradient: GRADIENTS.emerald },
      { href: "/tasks/new", title: "Créer une tâche", desc: "Planifiez une vérification ou une étape d'onboarding", icon: ICONS.tasks, gradient: GRADIENTS.accent },
    ],
    recent: {
      title: "Mes annonces récentes",
      allHref: "/jobs",
      emptyText: "Aucune annonce publiée pour le moment.",
      emptyHref: "/jobs/new",
      emptyLabel: "Publiez votre première annonce →",
    },
  },
  jobseeker: {
    stats: [
      { name: "Mes candidatures", href: "/applications", icon: ICONS.applications, gradient: GRADIENTS.primary, ring: "bg-primary-50", },
      { name: "En attente", href: "/applications", icon: ICONS.applications, gradient: GRADIENTS.amber, ring: "bg-amber-50", },
      { name: "En vérification", href: "/applications", icon: ICONS.verifications, gradient: GRADIENTS.accent, ring: "bg-accent-50", },
      { name: "Candidatures vérifiées", href: "/applications", icon: ICONS.verifications, gradient: GRADIENTS.emerald, ring: "bg-emerald-50", },
      { name: "Annonces ouvertes", href: "/jobs", icon: ICONS.open, gradient: GRADIENTS.primary, ring: "bg-primary-50", },
    ],
    heroActions: [
      { label: "Voir les annonces", href: "/jobs", primary: true },
      { label: "Tableau public", href: "/annonces", primary: false },
    ],
    quickActions: [
      { href: "/jobs", title: "Parcourir les annonces", desc: "Trouvez les offres de votre ville et postulez", icon: ICONS.jobs, gradient: GRADIENTS.primary },
      { href: "/applications", title: "Mes candidatures", desc: "Suivez l'avancement de vos dossiers", icon: ICONS.applications, gradient: GRADIENTS.emerald },
      { href: "/profile", title: "Compléter le profil", desc: "Ajoutez votre téléphone WhatsApp et votre zone", icon: ICONS.profile, gradient: GRADIENTS.accent },
    ],
    recent: {
      title: "Annonces récentes",
      allHref: "/jobs",
      emptyText: "Aucune annonce ouverte pour le moment.",
      emptyHref: "/jobs",
      emptyLabel: "Revenir aux annonces →",
    },
  },
  agent: {
    stats: [
      { name: "À vérifier", href: "/verifications", icon: ICONS.verifications, gradient: GRADIENTS.primary, ring: "bg-primary-50", },
      { name: "En cours", href: "/verifications", icon: ICONS.verifications, gradient: GRADIENTS.accent, ring: "bg-accent-50", },
      { name: "Dossiers vérifiés", href: "/verifications", icon: ICONS.verifications, gradient: GRADIENTS.emerald, ring: "bg-emerald-50", },
      { name: "Tâches assignées", href: "/tasks", icon: ICONS.tasks, gradient: GRADIENTS.amber, ring: "bg-amber-50", },
      { name: "Annonces ouvertes", href: "/jobs", icon: ICONS.open, gradient: GRADIENTS.primary, ring: "bg-primary-50", },
    ],
    heroActions: [
      { label: "Voir les vérifications", href: "/verifications", primary: true },
      { label: "Voir les tâches", href: "/tasks", primary: false },
    ],
    quickActions: [
      { href: "/verifications", title: "Contrôler un dossier", desc: "Pièces, entretien et rapport de vérification", icon: ICONS.verifications, gradient: GRADIENTS.primary },
      { href: "/tasks/new", title: "Créer une tâche", desc: "Planifiez une visite, un entretien ou un contrôle", icon: ICONS.tasks, gradient: GRADIENTS.emerald },
      { href: "/profile", title: "Compléter le profil", desc: "Ajoutez votre téléphone WhatsApp et votre zone", icon: ICONS.profile, gradient: GRADIENTS.accent },
    ],
    recent: {
      title: "Mes tâches récentes",
      allHref: "/tasks",
      emptyText: "Aucune tâche assignée pour le moment.",
      emptyHref: "/tasks/new",
      emptyLabel: "Créer une tâche →",
    },
  },
  admin: {
    stats: [
      { name: "Utilisateurs", href: "/users", icon: ICONS.users, gradient: GRADIENTS.primary, ring: "bg-primary-50", },
      { name: "Annonces publiées", href: "/jobs", icon: ICONS.jobs, gradient: GRADIENTS.emerald, ring: "bg-emerald-50", },
      { name: "Candidatures", href: "/applications", icon: ICONS.applications, gradient: GRADIENTS.amber, ring: "bg-amber-50", },
      { name: "Vérifications à mener", href: "/verifications", icon: ICONS.verifications, gradient: GRADIENTS.accent, ring: "bg-accent-50", },
      { name: "Tâches en cours", href: "/tasks", icon: ICONS.tasks, gradient: GRADIENTS.primary, ring: "bg-primary-50", },
    ],
    heroActions: [
      { label: "Publier une annonce", href: "/jobs/new", primary: true },
      { label: "Gérer les utilisateurs", href: "/users", primary: false },
    ],
    quickActions: [
      { href: "/users", title: "Gérer les utilisateurs", desc: "Attribuez les rôles et activez les comptes", icon: ICONS.users, gradient: GRADIENTS.primary },
      { href: "/verifications", title: "Suivre les vérifications", desc: "Contrôlez l'avancement des rapports des agents", icon: ICONS.verifications, gradient: GRADIENTS.emerald },
      { href: "/jobs/new", title: "Publier une annonce", desc: "Créez un poste de personnel domestique", icon: ICONS.plus, gradient: GRADIENTS.accent },
    ],
    recent: {
      title: "Annonces récentes",
      allHref: "/jobs",
      emptyText: "Aucune annonce publiée pour le moment.",
      emptyHref: "/jobs/new",
      emptyLabel: "Publier une annonce →",
    },
  },
};

export default function DashboardPage() {
  const [statValues, setStatValues] = useState<number[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      const currentRole: UserRole = (profile?.role as UserRole) ?? "jobseeker";
      setRole(currentRole);

      if (currentRole === "employer") {
        await loadEmployer(user.id);
      } else if (currentRole === "jobseeker") {
        await loadJobseeker(user.id);
      } else if (currentRole === "agent") {
        await loadAgent(user.id);
      } else {
        await loadAdmin();
      }

      setLoading(false);
    };

    const loadEmployer = async (userId: string) => {
      const { data: myJobs } = await supabase
        .from("jobs")
        .select("id, status")
        .eq("posted_by", userId);
      const mineIds = myJobs?.map((j) => j.id) ?? [];

      let candidates = 0;
      let pendingCandidates = 0;
      let verifications = 0;
      if (mineIds.length > 0) {
        const [c1, c2, c3] = await Promise.all([
          supabase.from("applications").select("*", { count: "exact", head: true }).in("job_id", mineIds),
          supabase.from("applications").select("*", { count: "exact", head: true }).in("job_id", mineIds).eq("status", "pending"),
          supabase.from("applications").select("*", { count: "exact", head: true }).in("job_id", mineIds).in("verification_status", ["unverified", "in_review"]),
        ]);
        candidates = c1.count || 0;
        pendingCandidates = c2.count || 0;
        verifications = c3.count || 0;
      }

      setStatValues([
        mineIds.length,
        mineIds.filter((j, i) => myJobs?.[i]?.status === "open").length,
        candidates,
        pendingCandidates,
        verifications,
      ]);

      const { data: recent } = await supabase
        .from("jobs")
        .select("*")
        .eq("posted_by", userId)
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentItems(jobsToRecent(recent || []));
    };

    const loadJobseeker = async (userId: string) => {
      const { data: myApps } = await supabase
        .from("applications")
        .select("status, verification_status")
        .eq("user_id", userId);

      setStatValues([
        myApps?.length ?? 0,
        myApps?.filter((a) => a.status === "pending").length ?? 0,
        myApps?.filter((a) => a.verification_status === "in_review").length ?? 0,
        myApps?.filter((a) => a.verification_status === "verified").length ?? 0,
        0,
      ]);

      const [{ count: openJobs }, { data: recent }] = await Promise.all([
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("jobs").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(5),
      ]);
      setStatValues((prev) => {
        const next = [...prev];
        next[4] = openJobs || 0;
        return next;
      });
      setRecentItems((recent || []).map((job) => ({
        id: job.id,
        href: `/jobs/${job.id}`,
        title: job.title,
        subtitle: `${job.company} · ${job.location}`,
        badge: statusLabel(job.status),
        badgeTone: "success",
      })));
    };

    const loadAgent = async (userId: string) => {
      const { data: apps } = await supabase
        .from("applications")
        .select("verification_status");
      const list = apps || [];

      setStatValues([
        list.filter((a) => a.verification_status === "unverified").length,
        list.filter((a) => a.verification_status === "in_review").length,
        list.filter((a) => a.verification_status === "verified").length,
        0,
        0,
      ]);

      const [
        { count: assigned },
        { count: openJobs },
        { data: recent },
      ] = await Promise.all([
        supabase.from("tasks").select("*", { count: "exact", head: true }).eq("assigned_to", userId),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("tasks").select("*").eq("assigned_to", userId).order("created_at", { ascending: false }).limit(5),
      ]);

      setStatValues((prev) => {
        const next = [...prev];
        next[3] = assigned || 0;
        next[4] = openJobs || 0;
        return next;
      });
      setRecentItems(await tasksToRecent(recent || []));
    };

    const loadAdmin = async () => {
      const [
        { count: users },
        { count: totalJobs },
        { count: applications },
        { count: verifications },
        { count: tasks },
        { data: recent },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("*", { count: "exact", head: true }).in("verification_status", ["unverified", "in_review"]),
        supabase.from("tasks").select("*", { count: "exact", head: true }).in("status", ["todo", "in_progress"]),
        supabase.from("jobs").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStatValues([users || 0, totalJobs || 0, applications || 0, verifications || 0, tasks || 0]);
      setRecentItems(jobsToRecent(recent || []));
    };

    const jobsToRecent = (jobs: any[]): RecentItem[] =>
      jobs.map((job) => ({
        id: job.id,
        href: `/jobs/${job.id}`,
        title: job.title,
        subtitle: `${job.company} · ${job.location}`,
        badge: statusLabel(job.status),
        badgeTone: job.status === "open" ? "success" : job.status === "closed" ? "danger" : "neutral",
      }));

    const tasksToRecent = async (tasks: any[]): Promise<RecentItem[]> => {
      if (tasks.length === 0) return [];
      const jobIds = [...new Set(tasks.map((t) => t.job_id))];
      const { data: jobs } = await supabase.from("jobs").select("id, title").in("id", jobIds);
      const jobMap = new Map((jobs || []).map((j) => [j.id, j.title]));
      return tasks.map((task) => ({
        id: task.id,
        href: `/tasks/${task.id}`,
        title: task.title,
        subtitle: jobMap.get(task.job_id) || "Annonce inconnue",
        badge: statusLabel(task.status),
        badgeTone: task.status === "done" ? "success" : task.status === "in_progress" ? "neutral" : "warning",
      }));
    };

    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-44 rounded-2xl" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const meta = role ? roleMeta[role] : null;
  const config = role
    ? (DASHBOARD_CONFIG[role as Role] ?? DASHBOARD_CONFIG.jobseeker)
    : DASHBOARD_CONFIG.jobseeker;

  return (
    <div className="space-y-6">
      {/* Greeting hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-accent-600 to-accent-500 p-6 shadow-glow-lg sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-16 h-56 w-56 animate-float rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {meta ? meta.greeting : "Bon retour"} 👋
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
              {meta ? meta.intro : "Suivez votre activité de recrutement de personnel domestique."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {config.heroActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={
                  action.primary
                    ? "inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                    : "inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                }
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {config.stats.map((stat, i) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="card card-hover animate-fade-in-up group"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
              <svg
                className="h-4 w-4 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                {statValues[i] ?? 0}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">{stat.name}</p>
            </div>
          </Link>
        ))}
      </section>

      <RealtimeUpdates />

      {/* Recent items & quick actions */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                {config.recent.title}
              </h2>
            </div>
            <Link
              href={config.recent.allHref}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
            >
              Tout voir
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {recentItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <p className="text-sm text-slate-500">{config.recent.emptyText}</p>
                <Link
                  href={config.recent.emptyHref}
                  className="mt-2 inline-block text-sm font-semibold text-primary-600 hover:text-primary-500"
                >
                  {config.recent.emptyLabel}
                </Link>
              </div>
            ) : (
              recentItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-md"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-primary-700">
                      {item.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{item.subtitle}</p>
                  </div>
                  <span
                    className={`badge shrink-0 ${
                      item.badgeTone === "success"
                        ? "badge-success"
                        : item.badgeTone === "warning"
                        ? "badge-warning"
                        : item.badgeTone === "danger"
                        ? "badge-danger"
                        : "badge-neutral"
                    }`}
                  >
                    <span className="badge-dot" />
                    {item.badge}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Actions rapides
            </h2>
          </div>
          <div className="mt-5 space-y-3">
            {config.quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-md"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{action.desc}</p>
                </div>
                <svg
                  className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}