import { z } from "zod";

export const loginSchema = z.object({
  pin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  pin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
  confirmPin: z.string(),
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
});

export const changePinSchema = z.object({
  currentPin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
  newPin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
  confirmNewPin: z.string(),
}).refine((data) => data.newPin === data.confirmNewPin, {
  message: "PINs don't match",
  path: ["confirmNewPin"],
}).refine((data) => data.currentPin !== data.newPin, {
  message: "New PIN must be different from current PIN",
  path: ["newPin"],
});

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  salary_min: z.number().min(0, "Salary must be positive").optional(),
  salary_max: z.number().min(0, "Salary must be positive").optional(),
  employment_type: z.enum(["full-time", "part-time", "contract", "internship", "remote"]),
  status: z.enum(["open", "closed", "draft"]).default("open"),
});

export const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),
  due_date: z.string().optional(),
  job_id: z.string().uuid("Invalid job ID"),
  assigned_to: z.string().uuid().optional(),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePinInput = z.infer<typeof changePinSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;