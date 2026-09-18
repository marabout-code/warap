import { z } from "zod";

export const loginSchema = z.object({
  pin: z.string().length(6, "Le PIN doit contenir exactement 6 chiffres").regex(/^\d+$/, "Le PIN doit contenir uniquement des chiffres"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  role: z.enum(["employer", "jobseeker", "agent"], {
    errorMap: () => ({ message: "Choisissez votre profil" }),
  }),
  pin: z.string().length(6, "Le PIN doit contenir exactement 6 chiffres").regex(/^\d+$/, "Le PIN doit contenir uniquement des chiffres"),
  confirmPin: z.string(),
}).refine((data) => data.pin === data.confirmPin, {
  message: "Les PIN ne correspondent pas",
  path: ["confirmPin"],
});

export const changePinSchema = z.object({
  currentPin: z.string().length(6, "Le PIN doit contenir exactement 6 chiffres").regex(/^\d+$/, "Le PIN doit contenir uniquement des chiffres"),
  newPin: z.string().length(6, "Le PIN doit contenir exactement 6 chiffres").regex(/^\d+$/, "Le PIN doit contenir uniquement des chiffres"),
  confirmNewPin: z.string(),
}).refine((data) => data.newPin === data.confirmNewPin, {
  message: "Les PIN ne correspondent pas",
  path: ["confirmNewPin"],
}).refine((data) => data.currentPin !== data.newPin, {
  message: "Le nouveau PIN doit être différent du PIN actuel",
  path: ["newPin"],
});

export const jobSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  company: z.string().min(2, "Le nom de la famille ou de l'employeur est requis"),
  location: z.string().min(2, "Le lieu est requis"),
  contact_phone: z.string().optional().or(z.literal("")),
  salary_min: z.number().min(0, "Le salaire doit être positif").optional(),
  salary_max: z.number().min(0, "Le salaire doit être positif").optional(),
  employment_type: z.enum(["full-time", "part-time", "contract"]),
  status: z.enum(["open", "closed", "draft"]).default("open"),
});

export const taskSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(5, "La description doit contenir au moins 5 caractères"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),
  due_date: z.string().optional(),
  job_id: z.string().uuid("Identifiant d'offre invalide"),
  assigned_to: z.string().uuid().optional(),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  bio: z.string().max(500, "La biographie doit contenir moins de 500 caractères").optional(),
  location: z.string().optional(),
  phone: z.string().optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePinInput = z.infer<typeof changePinSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;