import Link from "next/link";

const features = [
  {
    title: "Offres & candidatures",
    description:
      "Publiez votre annonce, définissez le salaire en FCFA et le lieu, puis recevez et classez les candidatures.",
    icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
    gradient: "from-primary-500 to-indigo-600",
  },
  {
    title: "Vérification par un agent local",
    description:
      "CNI, références, casier judiciaire ou permis : un agent de confiance vérifie chaque profil en personne, à Douala ou à Yaoundé.",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Contact WhatsApp direct",
    description:
      "Chaque offre et candidature expose un numéro de contact. Organisez les entretiens par appel audio ou vidéo, où que vous soyez.",
    icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    title: "Tâches & onboarding",
    description:
      "Planifiez la visite médicale, le contrat CNPS ou le dépôt du dossier, et confiez chaque étape à votre agent local.",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    gradient: "from-accent-500 to-fuchsia-600",
  },
  {
    title: "Mises à jour en temps réel",
    description:
      "Suivez instantanément les nouvelles candidatures, les changements de statut et l'avancement de la vérification.",
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605",
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    title: "Sécurité par code PIN",
    description:
      "Un accès simple et sécurisé par code PIN à 6 chiffres. Vos données et vos échanges restent protégés.",
    icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
    gradient: "from-amber-500 to-orange-600",
  },
];

const audiences = [
  {
    title: "Familles de la diaspora",
    description:
      "Vous vivez à Paris, Londres ou New York et souhaitez embaucher une aide à domicile, une nounou ou un chauffeur au Cameroun.",
    points: ["Publication depuis l'étranger en quelques minutes", "Candidats présélectionnés et vérifiés", "Entretiens par WhatsApp, contrat préparé par un agent"],
    badge: "Employeurs",
    icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819",
    gradient: "from-primary-500 to-indigo-600",
  },
  {
    title: "Agents vérificateurs",
    description:
      "Vous êtes une personne de confiance basée au Cameroun ? Menez les entretiens, contrôlez les documents et suivez les dossiers.",
    points: ["Entretiens en personne et contrôle des pièces", "Suivi des tâches d'onboarding assignées", "Notes de vérification partagées avec l'employeur"],
    badge: "Agents",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Candidats au Cameroun",
    description:
      "Vous cherchez un emploi stable chez une famille au pays ? Présentez votre profil et vos documents, puis postulez en un clic.",
    points: ["Postulez aux offres de votre ville", "Partagez CNI, références et casier judiciaire", "Salaires affichés en FCFA, sans ambiguïté"],
    badge: "Candidats",
    icon: "M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25M21 21H3m0 0l-0.75-8.25M3 21l8.25-8.25m0 0L7.5 8.25m3.75 4.5L17.25 6m0 0L15 3.75",
    gradient: "from-emerald-500 to-teal-600",
  },
];

const caseStudies = [
  {
    id: "case-diaspora",
    label: "Famille diaspora",
    initials: "PM",
    name: "Patience M.",
    meta: "Famille à Paris · cherchait une gouvernante à Bonapriso",
    gradient: "from-primary-500 to-accent-600",
    place: "Douala",
    title: "De l&apos;annonce au contrat en 12 jours",
    steps: [
      {
        day: "Jour 1",
        title: "Annonce publiée",
        desc: "Poste de gouvernante à temps plein, 80 000 FCFA/mois, logée. Publication et partage au cercle des agents.",
      },
      {
        day: "Jour 3",
        title: "9 candidatures en 48 h",
        desc: "L'agent Yannick pré-sélectionne 3 profils par appel téléphonique et met en avant les plus motivés.",
      },
      {
        day: "Jour 7",
        title: "Vérification terrain à Bonapriso",
        desc: "Contrôle de la CNI, appel aux deux derniers employeurs, relevé du casier judiciaire, visite médicale programmée.",
      },
      {
        day: "Jour 12",
        title: "Entretien & signature",
        desc: "Entretien WhatsApp avec Patience, notes de vérification partagées, contrat CNPS signé et période d'essai lancée.",
      },
    ],
    dossierLabel: "Dossier du recrutement",
    stats: [
      { value: "12 jours", label: "Annonce → contrat" },
      { value: "9", label: "Candidatures reçues" },
      { value: "3", label: "Présélectionnées" },
      { value: "80 000 FCFA", label: "Salaire mensuel" },
    ],
    verifiedLabel: "Documents vérifiés",
    verified: [
      "Carte nationale d'identité",
      "Références d'emploi (x2)",
      "Casier judiciaire vierge",
      "Visite médicale de pré-embauche",
    ],
    quote:
      "Je ne pouvais pas me déplacer. Le dossier vérifié m'a donné la confiance pour signer à distance.",
    quoteBy: "Patience M., famille à Paris",
  },
  {
    id: "case-candidate",
    label: "Candidate",
    initials: "BT",
    name: "Blandine T.",
    meta: "Aide à domicile à Yaoundé · cherchait un poste à Bastos",
    gradient: "from-emerald-500 to-teal-600",
    place: "Yaoundé",
    title: "Du profil vérifié au contrat signé en 10 jours",
    steps: [
      {
        day: "Jour 1",
        title: "Profil créé & documents ajoutés",
        desc: "CNI, références des deux derniers employeurs et casier judiciaire téléchargés. Le profil passe en statut « En vérification ».",
      },
      {
        day: "Jour 3",
        title: "Entretien de pré-vérification",
        desc: "L'agent Séverine appelle pour confirmer les expériences et contrôle la cohérence des documents au bureau.",
      },
      {
        day: "Jour 6",
        title: "Profil Vérifié & candidatures",
        desc: "Blandine postule à 4 offres de Yaoundé ; 2 employeuses répondent dans les 24 h grâce au badge Vérifiée.",
      },
      {
        day: "Jour 10",
        title: "Entretien & signature",
        desc: "Entretien WhatsApp avec la famille, visite médicale effectuée, contrat à 70 000 FCFA/mois signé à Bastos.",
      },
    ],
    dossierLabel: "Dossier de la candidate",
    stats: [
      { value: "5 jours", label: "Pour être vérifiée" },
      { value: "4", label: "Candidatures envoyées" },
      { value: "2", label: "Réponses en 24 h" },
      { value: "70 000 FCFA", label: "Salaire signé" },
    ],
    verifiedLabel: "Pièces du profil vérifié",
    verified: [
      "Carte nationale d'identité",
      "Références d'emploi (x2)",
      "Casier judiciaire vierge",
      "Disponibilités confirmées",
    ],
    quote:
      "Le badge Vérifiée a fait la différence : deux familles m'ont répondu très vite.",
    quoteBy: "Blandine T., aide à domicile à Yaoundé",
  },
  {
    id: "case-agent",
    label: "Agent vérificateur",
    initials: "SN",
    name: "Séverine N.",
    meta: "Agent vérificateur à Douala · mission au quartier Akwa",
    gradient: "from-amber-500 to-orange-600",
    place: "Douala",
    title: "Une mission confiée, un dossier bouclé en 5 jours",
    steps: [
      {
        day: "Jour 1",
        title: "Mission reçue",
        desc: "La famille confie la vérification d'une candidate : contrôle des pièces, appels de références et visite médicale à programmer.",
      },
      {
        day: "Jour 2",
        title: "Planification terrain",
        desc: "Séverine verrouille la checklist, appelle la candidate et fixe le rendez-vous au quartier Akwa.",
      },
      {
        day: "Jour 4",
        title: "Contrôles en personne",
        desc: "Entretien sur place, CNI vérifiée, appels aux deux anciens employeurs, notes de vérification saisies dans la plateforme.",
      },
      {
        day: "Jour 5",
        title: "Rapport remis & mission clôturée",
        desc: "Compte rendu complet partagé à la famille : la candidate est déclarée prête pour l'entretien WhatsApp.",
      },
    ],
    dossierLabel: "Mission de vérification",
    stats: [
      { value: "1", label: "Mission confiée" },
      { value: "3", label: "Documents contrôlés" },
      { value: "2", label: "Références appelées" },
      { value: "5 jours", label: "Mission bouclée" },
    ],
    verifiedLabel: "Tâches accomplies",
    verified: [
      "Entretien en personne",
      "Contrôle de la CNI",
      "Appels de références",
      "Rapport de vérification",
    ],
    quote:
      "Chaque étape est tracée dans la plateforme : la famille sait exactement ce qui a été vérifié.",
    quoteBy: "Séverine N., agent vérificateur à Douala",
  },
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
            <span className="text-lg font-bold tracking-tight text-slate-900">warap</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#network" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Pour qui&nbsp;?
            </a>
            <a href="#features" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Comment ça marche
            </a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Avis
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

      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-hero-mesh">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-10 h-72 w-72 animate-float rounded-full bg-primary-400/20 blur-3xl" />
            <div className="absolute -right-24 top-32 h-80 w-80 animate-float rounded-full bg-accent-400/20 blur-3xl [animation-delay:2s]" />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-24">
            <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
              {/* Left: copy */}
              <div>
                <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Recrutement vérifié au Cameroun
                </div>

                <h1 className="animate-fade-in-up mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 [animation-delay:0.1s] sm:text-5xl lg:text-6xl">
                  Embauchez votre personnel de confiance,{" "}
                  <span className="gradient-text">où que vous soyez</span>
                </h1>

                <p className="animate-fade-in-up mt-6 max-w-xl text-lg leading-relaxed text-slate-600 [animation-delay:0.2s]">
                  warap connecte les familles de la diaspora aux aides à
                  domicile, nounous, chauffeurs et gouvernantes au Cameroun.
                  Chaque candidat est vérifié en personne par un agent
                  local avant recrutement.
                </p>

                <div className="animate-fade-in-up mt-8 flex flex-col items-center gap-4 sm:flex-row [animation-delay:0.3s]">
                  <Link href="/register" className="btn-primary w-full px-8 py-3.5 text-base sm:w-auto">
                    Recruter maintenant
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link href="#how-it-works" className="btn-secondary w-full px-8 py-3.5 text-base sm:w-auto">
                    Comment ça marche&nbsp;?
                  </Link>
                </div>

                <div className="animate-fade-in-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 [animation-delay:0.4s]">
                  {[
                    { icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z", label: "Contact WhatsApp direct" },
                    { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", label: "Vérification CNI & références" },
                    { icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", label: "Salaires en FCFA" },
                  ].map((item) => (
                    <span key={item.label} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                        <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                      </span>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: mock application preview */}
              <div className="animate-fade-in-up relative [animation-delay:0.3s]">
                <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-brand-gradient-soft blur-2xl" />

                <div className="relative rounded-2xl border border-white/70 bg-white/80 p-5 shadow-card-hover backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
                        SA
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Solange Andela</p>
                        <p className="text-xs text-slate-500">Aide ménagère · Douala</p>
                      </div>
                    </div>
                    <span className="badge-success">
                      <span className="badge-dot" />
                      Vérifiée
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Offre</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      Aide ménagère à domicile · Bonapriso
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="badge-info">Temps plein</span>
                      <span className="badge-neutral">50 000 – 80 000 FCFA</span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <p className="text-xs font-bold text-slate-900">Yannick Fokou · Agent local</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      &laquo; CNI contrôlée à Bonapriso, références confirmées, casier vierge. Pret pour la visite médicale. &raquo;
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["Carte nationale", "Références", "Casier judiciaire"].map((doc) => (
                        <span key={doc} className="inline-flex items-center gap-1 rounded-md border border-emerald-200/70 bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <a
                      href="#network"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                      Discuter avec l&apos;agent
                    </a>
                    <a href="#features" className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-600">
                      Exemple de candidature contrôlée
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats band */}
            <div id="stats" className="animate-fade-in-up mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 [animation-delay:0.5s]">
              {[
                { value: "100%", label: "Candidats vérifiés en personne" },
                { value: "2+", label: "Villes couvertes : Douala & Yaoundé" },
                { value: "+237", label: "Contact direct avec la diaspora" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/60 bg-white/60 p-5 text-center shadow-card backdrop-blur">
                  <p className="gradient-text text-2xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For whom */}
        <section id="network" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Pour qui&nbsp;?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Un réseau de confiance, <span className="gradient-text">de la diaspora au Cameroun</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Trois familles d&apos;acteurs collaborent sur une seule plateforme pour un recrutement simple et sûre.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {audiences.map((a, i) => (
              <div
                key={a.title}
                className={`card card-hover animate-fade-in-up flex flex-col [animation-delay:${i * 0.1}s] group`}
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${a.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
                    </svg>
                  </div>
                  <span className="badge-neutral">{a.badge}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.description}</p>
                <ul className="mt-4 space-y-2">
                  {a.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
              Créer mon compte — c&apos;est gratuit
            </Link>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-slate-950 bg-sidebar-mesh py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400">Fonctionnalités</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Tout ce qu&apos;il faut pour un recrutement serein
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-400">
                De la publication de l&apos;annonce à la signature du contrat, chaque étape est pensée pour les familles et les agents.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner-soft backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08] ${i === 1 ? "ring-1 ring-primary-400/40" : ""}`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Comment ça marche</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                De Douala à votre salon, en trois étapes
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Créez votre compte",
                  desc: "Inscrivez-vous avec un simple code PIN et précisez votre profil : famille employeuse, agent local ou candidat.",
                },
                {
                  step: "02",
                  title: "Publiez et recevez",
                  desc: "Publiez votre annonce en FCFA, recevez les candidatures et confiez la vérification des documents à votre agent.",
                },
                {
                  step: "03",
                  title: "Vérifiez et recrutez",
                  desc: "Consultez les notes du vérificateur, lancez l'appel WhatsApp et suivez l'onboarding jusqu'au contrat.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group rounded-2xl border border-slate-200/70 bg-slate-50/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300/80 hover:bg-white hover:shadow-card-hover"
                >
                  <span className="text-4xl font-bold">
                    <span className="gradient-text">{item.step}</span>
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Avis</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Elles et ils nous font confiance
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "J'ai trouvé notre nounou en un week-end depuis Paris. L'agent a vérifié ses références et son diplôme avant l'entretien WhatsApp.",
                name: "Mireille K.",
                role: "Famille à Paris",
                gradient: "from-primary-500 to-indigo-600",
              },
              {
                quote:
                  "Je vérifie les documents, je fais les visites médicales et je prépare les contrats. Les familles savent exactement ce qui est fait.",
                name: "Yannick F.",
                role: "Agent vérificateur · Douala",
                gradient: "from-amber-500 to-orange-600",
              },
              {
                quote:
                  "Tout est clair : le salaire en FCFA, la ville et les missions. Mon profil vérifié a rassuré ma nouvelle employeuse.",
                name: "Solange A.",
                role: "Aide à domicile · Douala",
                gradient: "from-emerald-500 to-teal-600",
              },
            ].map((t, i) => (
              <figure
                key={t.name}
                className={`card card-hover animate-fade-in-up flex flex-col [animation-delay:${i * 0.1}s]`}
              >
                <svg className="h-7 w-7 text-accent-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  &laquo;&nbsp;{t.quote}&nbsp;&raquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${t.gradient} text-xs font-bold text-white`}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Case studies */}
        <section id="case-study" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Études de cas</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Trois parcours, un seul fil&nbsp;: la vérification
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Famille, candidate et agent&nbsp;: trois regards sur un même parcours mené de bout en bout sur warap.
            </p>
          </div>

          {/* Selector */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {caseStudies.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${c.gradient} text-[10px] font-bold text-white`}>
                  {c.initials}
                </span>
                {c.label}
              </a>
            ))}
          </div>

          <div className="mt-12 space-y-16">
            {caseStudies.map((c) => (
              <div key={c.id} id={c.id} className="scroll-mt-32">
                <div className="grid gap-8 lg:grid-cols-5">
                  {/* Timeline */}
                  <div className="lg:col-span-3">
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-card">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-sm font-bold text-white`}>
                            {c.initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.meta}</p>
                          </div>
                        </div>
                        <span className="badge-accent">{c.place}</span>
                      </div>

                      <p className="mt-6 text-lg font-bold tracking-tight text-slate-900">{c.title}</p>

                      <ol className="mt-5 space-y-0">
                        {c.steps.map((item, i) => (
                          <li key={item.day} className="relative flex gap-4 pb-8 last:pb-0">
                            {i < c.steps.length - 1 && (
                              <span className="absolute left-[15px] top-8 h-full w-px bg-gradient-to-b from-primary-300 to-transparent" />
                            )}
                            <span className="relative mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 bg-white text-[11px] font-bold text-primary-600">
                              {i + 1}
                            </span>
                            <div className="pt-0.5">
                              <p className="text-xs font-bold uppercase tracking-wider text-accent-600">{item.day}</p>
                              <h4 className="mt-0.5 text-base font-bold text-slate-900">{item.title}</h4>
                              <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Dossier summary */}
                  <div className="lg:col-span-2">
                    <div className="flex h-full flex-col rounded-2xl bg-slate-950 bg-sidebar-mesh p-7 shadow-glow-lg">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400">{c.dossierLabel}</p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        {c.stats.map((stat) => (
                          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="gradient-text text-xl font-bold">{stat.value}</p>
                            <p className="mt-1 text-xs font-medium text-slate-400">{stat.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{c.verifiedLabel}</p>
                        <ul className="mt-3 space-y-2.5">
                          {c.verified.map((doc) => (
                            <li key={doc} className="flex items-center gap-2.5 text-sm text-slate-300">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                                <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              </span>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <blockquote className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-300">
                        &laquo;&nbsp;{c.quote}&nbsp;&raquo;
                        <footer className="mt-2 text-xs font-semibold text-slate-500">— {c.quoteBy}</footer>
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-accent-600 to-accent-500 p-8 shadow-glow-lg sm:p-12">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            </div>
            <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Prêt à recruter en toute confiance&nbsp;?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
                  Créez votre compte gratuitement, publiez votre première annonce
                  et laissez un agent local s&apos;occuper de la vérification.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Créer un compte
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  J&apos;ai déjà un compte
                </Link>
              </div>
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
              Recrutement vérifié au Cameroun · &copy; 2026 warap. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}