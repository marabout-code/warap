"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import RealtimeUpdates from "@/components/realtime-updates";
import { statusLabel } from "@/lib/status-labels";

interface DashboardStats {
  totalJobs: number;
  openJobs: number;
  totalTasks: number;
  pendingApplications: number;
  pendingVerifications: number;
}

const statCards = [
  {
    name: "Total des offres",
    key: "totalJobs" as const,
    href: "/jobs",
    icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
    gradient: "from-primary-500 to-indigo-600",
    ring: "bg-primary-50",
  },
  {
    name: "Postes ouverts",
    key: "openJobs" as const,
    href: "/jobs?status=open",
    icon: "M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
    gradient: "from-emerald-500 to-teal-600",
    ring: "bg-emerald-50",
  },
  {
    name: "Tâches actives",
    key: "totalTasks" as const,
    href: "/tasks",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    gradient: "from-accent-500 to-fuchsia-600",
    ring: "bg-accent-50",
  },
  {
    name: "Candidatures en attente",
    key: "pendingApplications" as const,
    href: "/applications",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
    gradient: "from-amber-500 to-orange-600",
    ring: "bg-amber-50",
  },
  {
    name: "Vérifications en attente",
    key: "pendingVerifications" as const,
    href: "/applications",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    gradient: "from-sky-500 to-indigo-600",
    ring: "bg-sky-50",
  },
];

const quickActions = [
  {
    href: "/jobs/new",
    title: "Publier une offre",
    desc: "Créez une nouvelle offre d'emploi",
    icon: "M12 4.5v15m7.5-7.5h-15",
    gradient: "from-primary-500 to-indigo-600",
  },
  {
    href: "/tasks/new",
    title: "Créer une tâche",
    desc: "Assignez des tâches aux membres de l'équipe",
    icon: "M12 4.5v15m7.5-7.5h-15",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    href: "/profile",
    title: "Modifier le profil",
    desc: "Mettez à jour vos informations personnelles",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
    gradient: "from-accent-500 to-fuchsia-600",
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    openJobs: 0,
    totalTasks: 0,
    pendingApplications: 0,
    pendingVerifications: 0,
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const [
        { count: totalJobs },
        { count: openJobs },
        { count: totalTasks },
        { count: pendingApplications },
        { count: pendingVerifications },
        { data: jobs },
      ] = await Promise.all([
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("tasks").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .in("verification_status", ["unverified", "in_review"]),
        supabase.from("jobs").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        totalJobs: totalJobs || 0,
        openJobs: openJobs || 0,
        totalTasks: totalTasks || 0,
        pendingApplications: pendingApplications || 0,
        pendingVerifications: pendingVerifications || 0,
      });
      setRecentJobs(jobs || []);
      setLoading(false);
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
              Bon retour 👋
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
              Voici ce qui se passe dans votre centre d&apos;emploi aujourd&apos;hui.
              Continuez sur votre lancée !
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/jobs/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Publier une offre
            </Link>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Voir les tâches
            </Link>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat, i) => (
          <Link
            key={stat.name}
            href={stat.href}
            className={`card card-hover animate-fade-in-up [animation-delay:${i * 0.05}s] group`}
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
                {stats[stat.key]}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">{stat.name}</p>
            </div>
          </Link>
        ))}
      </section>

      <RealtimeUpdates />

      {/* Recent jobs & quick actions */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Offres récentes
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
            >
              Tout voir
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {recentJobs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <p className="text-sm text-slate-500">Aucune offre publiée pour le moment.</p>
                <Link
                  href="/jobs/new"
                  className="mt-2 inline-block text-sm font-semibold text-primary-600 hover:text-primary-500"
                >
                  Publiez votre première offre →
                </Link>
              </div>
            ) : (
              recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-md"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-primary-700">
                      {job.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {job.company} &middot; {job.location}
                    </p>
                  </div>
                  <span
                    className={`badge shrink-0 ${
                      job.status === "open"
                        ? "badge-success"
                        : job.status === "closed"
                        ? "badge-danger"
                        : "badge-neutral"
                    }`}
                  >
                    <span className="badge-dot" />
                    {statusLabel(job.status)}
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
            {quickActions.map((action) => (
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