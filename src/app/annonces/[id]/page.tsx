import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/public-header";
import Footer from "@/components/public-footer";
import {
  employmentTypeLabels,
  formatSalary,
  whatsappHref,
} from "@/lib/status-labels";
import { categoryLabel, categoryEmoji } from "@/lib/service-categories";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("title, company, location")
    .eq("id", params.id)
    .single();
  return {
    title: data ? `${data.title} — ${data.location}` : "Offre",
    description: data
      ? `Offre de service ${data.title} (${data.company}) à ${data.location} — vérifié par un agent local.`
      : "Offre de service",
  };
}

export default async function PublicJobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !job || job.status !== "open") {
    notFound();
  }

  let employer: { id: string; full_name: string } | null = null;
  if (job.company_id) {
    const { data } = await supabase
      .from("companies")
      .select("id, owner_id")
      .eq("id", job.company_id)
      .single();
    if (data?.owner_id) {
      const { data: owner } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", data.owner_id)
        .single();
      if (owner) employer = owner;
    }
  }
  if (!employer) {
    const { data: poster } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", job.posted_by)
      .single();
    if (poster) employer = poster;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader user={user} />

      <main className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-14">
        <Link
          href="/annonces"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Toutes les offres
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-6 lg:col-span-2">
            <div className="card">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                  {job.title}
                </h1>
                <span className="badge-success">
                  <span className="badge-dot" />
                  Offre ouverte
                </span>
                <span className="badge badge-neutral">
                  {categoryEmoji(job.category)} {categoryLabel(job.category)}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {job.company} &middot; {job.location}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tarif</dt>
                  <dd className="mt-0.5 text-sm font-bold text-slate-900">
                    {job.salary_min || job.salary_max
                      ? formatSalary(job.salary_min, job.salary_max)
                      : "À discuter"}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Engagement</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                    {employmentTypeLabels[job.employment_type] || job.employment_type.replace("-", " ")}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Publiée le</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                    {new Date(job.created_at).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>
              </div>

              <h2 className="mt-8 text-base font-bold tracking-tight text-slate-900">
                Description du service
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                {job.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card overflow-hidden border-0 bg-brand-gradient p-0">
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  Prêt à répondre ?
                </p>
                <h2 className="mt-2 text-lg font-bold text-white">
                  Postulez avec votre dossier vérifié
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Ajoutez votre CV, CNI, références et autres pièces. Un agent
                  local les vérifie avant l&apos;engagement.
                </p>
                <Link
                  href={user ? `/jobs/${job.id}/apply` : "/login"}
                  className="btn-accent mt-5 w-full !py-3"
                >
                  {user ? "Postuler à cette offre" : "Se connecter pour postuler"}
                </Link>
                {!user && (
                  <p className="mt-3 text-center text-xs text-white/70">
                    Pas encore de compte ?{" "}
                    <Link href="/register" className="font-bold text-white underline underline-offset-2">
                      Créer un profil prestataire
                    </Link>
                  </p>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Client
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
                  {(employer?.full_name || job.company).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {employer?.full_name || job.company}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    Client sur warap
                  </p>
                </div>
              </div>
              {job.contact_phone && (
                <a
                  href={whatsappHref(job.contact_phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary mt-5 w-full"
                >
                  <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  Contacter sur WhatsApp
                </a>
              )}
            </div>

            <div className="card">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Pourquoi warap ?
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>Votre réponse envoyée en direct, sans intermédiaire.</span>
                </li>
                <li className="flex gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>Vos pièces sont contrôlées en personne par un agent du réseau.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}