import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/public-header";
import Footer from "@/components/public-footer";
import { employmentTypeLabels, formatSalary } from "@/lib/status-labels";
import { cameroonCities } from "@/lib/status-labels";

export const metadata: Metadata = {
  title: "Annonces — Personnel domestique vérifié",
  description:
    "Parcourez les offres de personnel domestique au Cameroun : aides ménagères, nounous, chauffeurs et gouvernantes proposés par les familles de la diaspora.",
};

export const dynamic = "force-dynamic";

function roleHint(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("ménag")) return "Aide ménagère";
  if (t.includes("nounou") || t.includes("enfant")) return "Nounou";
  if (t.includes("chauff")) return "Chauffeur";
  if (t.includes("gouvern")) return "Gouvernante";
  if (t.includes("cuisin")) return "Cuisinier (ère)";
  if (t.includes("malad")) return "Garde-malade";
  if (t.includes("jardin")) return "Jardinier";
  return "Personnel domestique";
}

export default async function PublicJobsPage({
  searchParams,
}: {
  searchParams: { q?: string; city?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const q = (searchParams.q ?? "").trim();
  const city = (searchParams.city ?? "").trim();

  let query = supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (city) {
    query = query.eq("location", city);
  }

  if (q) {
    query = query.or(
      `title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%`
    );
  }

  const { data: jobs } = await query;
  const list = jobs ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader user={user} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-slate-950 bg-hero-mesh py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <p className="eyebrow text-primary-300">Tableau d&apos;annonces</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white lg:text-4xl">
              Postes de personnel domestique au Cameroun
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 lg:text-base">
              Des familles de la diaspora recrutent des aides ménagères, nounous,
              chauffeurs et gouvernantes dans les grandes villes. Chaque candidat
              est vérifié en personne par un agent local.
            </p>

            {/* Search */}
            <form
              action="/annonces"
              method="GET"
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Poste, famille, description…"
                  className="input-field bg-white/10 pl-10 text-white placeholder:text-slate-400"
                />
              </div>
              <select
                name="city"
                defaultValue={city}
                className="select-field bg-white/10 text-white sm:w-56"
              >
                <option value="" className="text-slate-900">Toutes les villes</option>
                {cameroonCities.map((c) => (
                  <option key={c} value={c} className="text-slate-900">
                    {c}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-accent">
                Rechercher
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>{list.length} annonce(s) ouverte(s)</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>Vérification par agents locaux</span>
            </div>
          </div>
        </section>

        {/* Board */}
        <section className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-14">
          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient-soft">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="mt-4 text-base font-bold text-slate-900">Aucune annonce trouvée</h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Essayez un autre quartier ou un autre mot-clé. De nouvelles
                annonces sont ajoutées chaque semaine.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list.map((job, i) => (
                <Link
                  key={job.id}
                  href={`/annonces/${job.id}`}
                  className="card card-hover group flex animate-fade-in-up flex-col"
                  style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="doc-pill">{roleHint(job.title)}</span>
                    <span className="badge-success">
                      <span className="badge-dot" />
                      Ouvert
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary-700">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {job.company} &middot; {job.location}
                  </p>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {job.description}
                  </p>
                  <dl className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salaire</dt>
                      <dd className="mt-0.5 text-sm font-bold text-slate-900">
                        {job.salary_min || job.salary_max
                          ? formatSalary(job.salary_min, job.salary_max)
                          : "À discuter"}
                      </dd>
                    </div>
                    <div className="text-right">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contrat</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-slate-700">
                        {employmentTypeLabels[job.employment_type] || job.employment_type.replace("-", " ")}
                      </dd>
                    </div>
                  </dl>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="card mt-12 overflow-hidden border-0 bg-brand-gradient p-0">
            <div className="flex flex-col items-start justify-between gap-5 p-8 sm:flex-row sm:items-center lg:p-10">
              <div>
                <h2 className="text-xl font-bold text-white lg:text-2xl">
                  Une annonce nous attend peut-être pour vous.
                </h2>
                <p className="mt-1.5 max-w-lg text-sm text-white/80">
                  Créez votre profil de candidat, ajoutez vos pièces et postulez
                  en quelques minutes. Un agent local vous accompagne.
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Link
                  href={user ? "/jobs" : "/register"}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary-800 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {user ? "Rechercher dans mon espace" : "Créer mon profil candidat"}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}