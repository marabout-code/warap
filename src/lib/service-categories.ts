export interface ServiceCategory {
  id: string;
  label: string;
  emoji: string;
  short: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "household",
    label: "Ménage & personnel de maison",
    emoji: "🏠",
    short: "Ménage",
  },
  {
    id: "childcare",
    label: "Garde d'enfants / Nounou",
    emoji: "👶",
    short: "Garde d'enfants",
  },
  {
    id: "elderly-care",
    label: "Aide aux personnes âgées",
    emoji: "👴",
    short: "Aide aux aînés",
  },
  {
    id: "driving",
    label: "Chauffeur particulier",
    emoji: "🚗",
    short: "Chauffeur",
  },
  {
    id: "cooking",
    label: "Cuisine & traiteur",
    emoji: "🍳",
    short: "Cuisine",
  },
  {
    id: "tutoring",
    label: "Cours & soutien scolaire",
    emoji: "📚",
    short: "Cours",
  },
  {
    id: "healthcare",
    label: "Soins infirmiers",
    emoji: "🩺",
    short: "Soins",
  },
  {
    id: "maintenance",
    label: "Bricolage & maintenance",
    emoji: "🔧",
    short: "Bricolage",
  },
  {
    id: "gardening",
    label: "Jardinage & extérieurs",
    emoji: "🌿",
    short: "Jardinage",
  },
  {
    id: "security",
    label: "Sécurité / Gardiennage",
    emoji: "🛡️",
    short: "Sécurité",
  },
  {
    id: "other",
    label: "Autre service",
    emoji: "✨",
    short: "Autre",
  },
];

export const DEFAULT_CATEGORY = "other";

export const categoryOptions = SERVICE_CATEGORIES.map((c) => ({
  value: c.id,
  label: `${c.emoji} ${c.label}`,
}));

export function getCategory(id?: string | null): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((c) => c.id === (id ?? DEFAULT_CATEGORY));
}

export function categoryLabel(id?: string | null): string {
  const cat = getCategory(id);
  return cat ? cat.label : "Autre service";
}

export function categoryEmoji(id?: string | null): string {
  const cat = getCategory(id);
  return cat ? cat.emoji : "✨";
}

export function categoryShort(id?: string | null): string {
  const cat = getCategory(id);
  return cat ? cat.short : "Autre";
}