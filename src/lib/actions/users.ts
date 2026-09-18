"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/roles";
import { z } from "zod";

export type UserActionResult = { error: string } | { success: true };

const roleSchema = z.enum(["admin", "employer", "jobseeker", "agent"]);
const statusSchema = z.enum(["active", "disabled"]);

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, userId: null, admin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  return { supabase, userId: user.id, admin: profile?.role === "admin" };
}

export async function updateUserRole(
  _prevState: UserActionResult | null,
  formData: FormData
): Promise<UserActionResult> {
  const targetId = (formData.get("userId") as string) ?? "";
  const rawRole = (formData.get("role") as string) ?? "";

  const parsedRole = roleSchema.safeParse(rawRole);
  if (!parsedRole.success) {
    return { error: "Rôle invalide." };
  }

  if (!z.string().uuid().safeParse(targetId).success) {
    return { error: "Identifiant utilisateur invalide." };
  }

  const { supabase, userId, admin } = await requireAdmin();
  if (!admin || !userId) {
    return { error: "Accès réservé aux administrateurs." };
  }

  if (targetId === userId) {
    return { error: "Vous ne pouvez pas modifier votre propre rôle." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: parsedRole.data })
    .eq("id", targetId);

  if (error) {
    return { error: "Échec de la mise à jour du rôle. Veuillez réessayer." };
  }

  return { success: true };
}

export async function updateUserStatus(
  _prevState: UserActionResult | null,
  formData: FormData
): Promise<UserActionResult> {
  const targetId = (formData.get("userId") as string) ?? "";
  const rawStatus = (formData.get("status") as string) ?? "";

  const parsedStatus = statusSchema.safeParse(rawStatus);
  if (!parsedStatus.success) {
    return { error: "Statut invalide." };
  }

  if (!z.string().uuid().safeParse(targetId).success) {
    return { error: "Identifiant utilisateur invalide." };
  }

  const { supabase, userId, admin } = await requireAdmin();
  if (!admin || !userId) {
    return { error: "Accès réservé aux administrateurs." };
  }

  if (targetId === userId && parsedStatus.data === "disabled") {
    return { error: "Vous ne pouvez pas désactiver votre propre compte." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ account_status: parsedStatus.data })
    .eq("id", targetId);

  if (error) {
    return { error: "Échec de la mise à jour du statut. Veuillez réessayer." };
  }

  return { success: true };
}

export type { UserRole };
export type UserRow = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  account_status: "active" | "disabled";
  phone: string | null;
  location: string | null;
  created_at: string;
};