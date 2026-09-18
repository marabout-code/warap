"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { getNavigation, resolvePageTitle, roleMeta, type UserRole } from "@/lib/roles";
import { userRoleLabels } from "@/lib/status-labels";
import Logo from "@/components/logo";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setRole((profile?.role as UserRole) ?? null);
      }
    };
    getUser();
  }, [supabase.auth, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navigation = getNavigation(role);
  const currentTitle = resolvePageTitle(pathname);
  const meta = role ? roleMeta[role] : null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 transform flex-col bg-slate-950 bg-sidebar-mesh transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/[0.06] px-5">
          <Logo size="md" tone="light" subtitle="Personnel vérifié" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-3 pt-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {meta ? meta.tagline : "Menu principal"}
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public site link */}
        <div className="px-3 pb-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            <span>Voir le site public</span>
          </Link>
        </div>

        {/* User card */}
        <div className="p-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 shadow-inner-soft backdrop-blur">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
                {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-500" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user?.user_metadata?.full_name || "Compte PIN"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {role ? userRoleLabels[role] : "Chargement de la session"}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-rose-300"
              title="Se déconnecter"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="relative z-10 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="hidden items-center gap-2.5 sm:flex">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              {currentTitle}
            </h1>
            <span className="mt-0.5 flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/70 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 md:inline-flex">
              <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Vérification par agents locaux
            </span>

            <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-100/70 px-3.5 py-1.5 text-xs font-medium text-slate-500 md:inline-flex">
              <svg className="h-3.5 w-3.5 text-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>

            <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
              </span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in mx-auto max-w-7xl p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
