export interface ServiceCategory {
  id: string;
  label: string;
  emoji: string;
  short: string;
  sort_order?: number;
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

export const categoryOptions = (
  list: ServiceCategory[] = SERVICE_CATEGORIES
): { value: string; label: string }[] =>
  list.map((c) => ({
    value: c.id,
    label: `${c.emoji} ${c.label}`,
  }));

export function getCategory(
  id?: string | null,
  list: ServiceCategory[] = SERVICE_CATEGORIES
): ServiceCategory | undefined {
  return list.find((c) => c.id === (id ?? DEFAULT_CATEGORY));
}

export function categoryLabel(
  id?: string | null,
  list: ServiceCategory[] = SERVICE_CATEGORIES
): string {
  const cat = getCategory(id, list);
  return cat ? cat.label : "Autre service";
}

export function categoryEmoji(
  id?: string | null,
  list: ServiceCategory[] = SERVICE_CATEGORIES
): string {
  const cat = getCategory(id, list);
  return cat ? cat.emoji : "✨";
}

export function categoryShort(
  id?: string | null,
  list: ServiceCategory[] = SERVICE_CATEGORIES
): string {
  const cat = getCategory(id, list);
  return cat ? cat.short : "Autre";
}