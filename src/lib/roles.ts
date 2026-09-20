export type UserRole = "admin" | "employer" | "jobseeker" | "agent";

export interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const ICONS = {
  dashboard:
    "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  jobs: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
  tasks:
    "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  applications:
    "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  verifications:
    "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  profile:
    "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  users:
    "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
};

export const roleMeta: Record<
  UserRole,
  { label: string; tagline: string; greeting: string; intro: string }
> = {
  employer: {
    label: "Client",
    tagline: "Bénéficiaire",
    greeting: "Vos demandes de service",
    intro:
      "Publiez vos annonces, recevez les candidatures et laissez un agent local vérifier chaque prestataire avant l'engagement.",
  },
  agent: {
    label: "Agent vérificateur",
    tagline: "Terrain",
    greeting: "Vos vérifications en cours",
    intro:
      "Menez les entretiens en personne, contrôlez les pièces et partagez vos notes de vérification avec les clients.",
  },
  jobseeker: {
    label: "Prestataire",
    tagline: "Cameroun",
    greeting: "Votre activité de service",
    intro:
      "Complétez votre profil, ajoutez vos pièces et répondez aux annonces de votre ville en toute confiance.",
  },
  admin: {
    label: "Administrateur",
    tagline: "warap",
    greeting: "Vue d'ensemble",
    intro:
      "Suivez les offres, les candidatures et les vérifications menées par les agents du réseau.",
  },
};

export function getNavigation(role: UserRole | null): NavItem[] {
  const r: UserRole = role ?? "jobseeker";
  const items: NavItem[] = [
    { name: "Tableau de bord", href: "/dashboard", icon: ICONS.dashboard },
    { name: "Offres de service", href: "/jobs", icon: ICONS.jobs },
  ];

  if (r === "agent") {
    items.push({ name: "Vérifications", href: "/verifications", icon: ICONS.verifications });
  } else if (r === "jobseeker") {
    items.push({
      name: "Mes réponses",
      href: "/applications",
      icon: ICONS.applications,
    });
  } else {
    items.push({ name: "Réponses", href: "/applications", icon: ICONS.applications });
  }

  if (r !== "jobseeker") {
    items.push({ name: "Tâches & onboarding", href: "/tasks", icon: ICONS.tasks });
  }

  if (r === "admin") {
    items.push({ name: "Utilisateurs", href: "/users", icon: ICONS.users });
  }

  items.push({ name: "Profil", href: "/profile", icon: ICONS.profile });

  return items;
}

export const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/jobs": "Offres de service",
  "/verifications": "Vérifications",
  "/tasks": "Tâches & onboarding",
  "/applications": "Réponses",
  "/users": "Gestion des utilisateurs",
  "/profile": "Profil",
};

export function resolvePageTitle(pathname: string, role?: UserRole | null): string {
  if (pathname === "/applications") {
    return role === "jobseeker" ? "Mes réponses" : "Réponses";
  }
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/verifications")) return "Vérifications";
  if (pathname.startsWith("/users")) return "Gestion des utilisateurs";
  if (pathname.startsWith("/jobs")) return "Offres de service";
  if (pathname.startsWith("/tasks")) return "Tâches & onboarding";
  if (pathname.startsWith("/applications")) return "Réponses";
  if (pathname.startsWith("/profile")) return "Profil";
  return "warap";
}
