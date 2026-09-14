import Link from "next/link";

const features = [
  {
    title: "Gestion des offres",
    description:
      "Créez, gérez et suivez vos offres d'emploi grâce à des filtres et une recherche puissants.",
    icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
    gradient: "from-primary-500 to-indigo-600",
  },
  {
    title: "Suivi des tâches",
    description:
      "Organisez les tâches de vos offres, assignez des membres d'équipe et suivez l'avancement en temps réel.",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    gradient: "from-accent-500 to-fuchsia-600",
  },
  {
    title: "Mises à jour en temps réel",
    description:
      "Recevez des notifications instantanées pour les changements de statut, nouvelles candidatures et mises à jour des tâches.",
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605",
    gradient: "from-sky-500 to-cyan-500",
  },
];

const stats = [
  { value: "10K+", label: "Offres actives" },
  { value: "5K+", label: "Entreprises inscrites" },
  { value: "99%", label: "Taux de satisfaction" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              warap
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Comment ça marche
            </a>
            <a href="#stats" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              À propos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-slate-700 transition-colors hover:text-primary-600 sm:block"
            >
              Se connecter
            </Link>
            <Link href="/register" className="btn-primary">
              Commencer
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative bg-hero-mesh">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-10 h-72 w-72 animate-float rounded-full bg-primary-400/20 blur-3xl" />
            <div className="absolute -right-24 top-32 h-80 w-80 animate-float rounded-full bg-accent-400/20 blur-3xl [animation-delay:2s]" />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-white/70 px-4 py-1.5 text-xs font-semibold text-primary-700 shadow-sm backdrop-blur">
                <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                La plateforme emploi tout-en-un
              </div>

              <h1 className="animate-fade-in-up mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 [animation-delay:0.1s] sm:text-6xl lg:text-7xl">
                Trouvez votre{" "}
                <span className="gradient-text">emploi de rêve</span>
              </h1>

              <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 [animation-delay:0.2s]">
                Une plateforme complète qui connecte employeurs et talents.
                Gérez vos offres, suivez vos tâches et simplifiez tout votre
                processus de recrutement en un seul endroit élégant.
              </p>

              <div className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row [animation-delay:0.3s]">
                <Link href="/register" className="btn-primary w-full px-8 py-3.5 text-base sm:w-auto">
                  Commencer à recruter
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary w-full px-8 py-3.5 text-base sm:w-auto"
                >
                  Voir les offres
                </Link>
              </div>

              <div id="stats" className="animate-fade-in-up mx-auto mt-16 grid max-w-lg grid-cols-3 gap-4 [animation-delay:0.4s]">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-card backdrop-blur"
                  >
                    <p className="gradient-text text-2xl font-bold">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
              Fonctionnalités
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Tout ce qu&apos;il vous faut pour{" "}
              <span className="gradient-text">recruter plus intelligemment</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Des outils puissants conçus pour garder votre pipeline de recrutement
              organisé, collaboratif et rapide.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`card card-hover animate-fade-in-up [animation-delay:${i * 0.1}s] group`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-slate-950 bg-sidebar-mesh py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
                Comment ça marche
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                De la publication à l&apos;embauche en trois étapes
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Créez votre profil",
                  desc: "Inscrivez-vous et créez un profil professionnel visible et fiable pour les employeurs.",
                },
                {
                  step: "02",
                  title: "Publiez et gérez vos offres",
                  desc: "Publiez vos offres d'emploi, organisez les tâches et suivez toutes les candidatures.",
                },
                {
                  step: "03",
                  title: "Recrutez en temps réel",
                  desc: "Évaluez les candidats, mettez à jour les statuts et collaborez en direct.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-7 shadow-inner-soft backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <span className="gradient-text text-4xl font-bold">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
                Commencez dès aujourd&apos;hui — c&apos;est gratuit
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <span className="font-bold tracking-tight text-slate-900">warap</span>
            </div>
            <p className="text-sm text-slate-500">
              &copy; 2026 warap. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}