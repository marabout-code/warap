export const jobStatusLabels: Record<string, string> = {
  open: "Ouvert",
  closed: "Fermé",
  draft: "Brouillon",
};

export const taskStatusLabels: Record<string, string> = {
  todo: "À faire",
  in_progress: "En cours",
  review: "En revue",
  done: "Terminée",
};

export const priorityLabels: Record<string, string> = {
  low: "Faible",
  medium: "Moyen",
  high: "Élevé",
  urgent: "Urgent",
};

export const employmentTypeLabels: Record<string, string> = {
  "full-time": "Temps plein",
  "part-time": "Temps partiel",
  contract: "Contrat",
  internship: "Stage",
  remote: "À distance",
};

export const applicationStatusLabels: Record<string, string> = {
  pending: "En attente",
  reviewed: "Examinée",
  shortlisted: "Présélectionnée",
  rejected: "Rejetée",
  accepted: "Acceptée",
};

export const verificationStatusLabels: Record<string, string> = {
  unverified: "Non vérifiée",
  in_review: "En vérification",
  verified: "Vérifiée",
  rejected: "Rejetée",
};

export const documentTypeLabels: Record<string, string> = {
  cni: "CNI / Passeport",
  reference: "Lettre de référence",
  casier: "Casier judiciaire",
  diplome: "Diplôme / Attestation",
  permis: "Permis de conduire",
  certificat_medical: "Certificat médical",
  autre: "Autre document",
};

export const documentTypeOptions: { value: string; label: string }[] = Object.entries(
  documentTypeLabels
).map(([value, label]) => ({ value, label }));

export const verificationChecklist: { id: string; label: string }[] = [
  { id: "identity", label: "Identité confirmée (CNI / passeport vu en personne)" },
  { id: "address", label: "Adresse et quartier confirmés" },
  { id: "experience", label: "Expérience et références vérifiées" },
  { id: "interview", label: "Entretien mené par l'agent" },
  { id: "casier", label: "Casier judiciaire consulté" },
];

export const userRoleLabels: Record<string, string> = {
  admin: "Administrateur",
  employer: "Famille / Employeur",
  jobseeker: "Candidat",
  agent: "Agent vérificateur",
};

export const accountStatusLabels: Record<string, string> = {
  active: "Actif",
  disabled: "Désactivé",
};

export const tableLabels: Record<string, string> = {
  jobs: "Annonces",
  tasks: "Tâches & onboarding",
  applications: "Candidatures",
};

export function statusLabel(value: string): string {
  return (
    jobStatusLabels[value] ||
    taskStatusLabels[value] ||
    applicationStatusLabels[value] ||
    verificationStatusLabels[value] ||
    priorityLabels[value] ||
    value.replace("_", " ")
  );
}

export function formatSalary(min: number | null, max: number | null): string {
  if (min && max) {
    return `${min.toLocaleString("fr-FR")} – ${max.toLocaleString("fr-FR")} FCFA`;
  }
  if (min) {
    return `${min.toLocaleString("fr-FR")} FCFA minimum`;
  }
  if (max) {
    return `Jusqu'à ${max.toLocaleString("fr-FR")} FCFA`;
  }
  return "Non spécifié";
}

export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
}

export const domesticRoles = [
  "Aide ménagère",
  "Nounou",
  "Gouvernante",
  "Chauffeur",
  "Cuisinier (ère)",
  "Jardinier",
  "Garde-malade",
  "Majordome",
];

export const cameroonCities = [
  "Douala",
  "Yaoundé",
  "Bafoussam",
  "Bamenda",
  "Garoua",
  "Maroua",
  "Buea",
  "Limbe",
  "Kribi",
  "Ngaoundéré",
];