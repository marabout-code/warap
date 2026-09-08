import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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
export type JobInput = z.infer<typeof jobSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
