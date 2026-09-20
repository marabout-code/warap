"use server";

import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CATEGORY } from "@/lib/service-categories";
import { z } from "zod";

export type CategoryActionResult = { error: string } | { success: true };

const categoryIdSchema = z
  .string()
  .trim()
  .min(2, "L'identifiant doit faire au moins 2 caractères.")
  .max(40, "L'identifiant est trop long.")
  .regex(
    /^[a-z0-9][a-z0-9-]*$/,
    "L'identifiant doit être un slug : lettres minuscules, chiffres et tirets."
  );

const labelSchema = z
  .string()
  .trim()
  .min(1, "Le libellé est requis.")
  .max(60, "Le libellé est trop long.");

const shortSchema = z
  .string()
  .trim()
  .min(1, "Le libellé court est requis.")
  .max(30, "Le libellé court est trop long.");

const emojiSchema = z.string().trim().max(8, "L'emoji est trop long.");

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, admin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  return { supabase, admin: profile?.role === "admin" };
}

export async function createCategory(
  _prevState: CategoryActionResult | null,
  formData: FormData
): Promise<CategoryActionResult> {
  const parsed = z
    .object({
      id: categoryIdSchema,
      label: labelSchema,
      short: shortSchema,
      emoji: emojiSchema,
    })
    .safeParse({
      id: formData.get("id"),
      label: formData.get("label"),
      short: formData.get("short"),
      emoji: (formData.get("emoji") as string) || "✨",
    });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { supabase, admin } = await requireAdmin();
  if (!admin) {
    return { error: "Accès réservé aux administrateurs." };
  }

  const { id, label, short, emoji } = parsed.data;

  const { data: existing } = await supabase
    .from("service_categories")
    .select("id")
    .eq("id", id)
    .single();

  if (existing) {
    return { error: "Cet identifiant existe déjà." };
  }

  const { data: max } = await supabase
    .from("service_categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase
    .from("service_categories")
    .insert({ id, label, short, emoji, sort_order: (max?.sort_order ?? 0) + 1 });

  if (error) {
    return { error: "Échec de la création de la catégorie. Veuillez réessayer." };
  }

  return { success: true };
}

export async function updateCategory(
  _prevState: CategoryActionResult | null,
  formData: FormData
): Promise<CategoryActionResult> {
  const parsed = z
    .object({
      id: categoryIdSchema,
      label: labelSchema,
      short: shortSchema,
      emoji: emojiSchema,
    })
    .safeParse({
      id: formData.get("id"),
      label: formData.get("label"),
      short: formData.get("short"),
      emoji: (formData.get("emoji") as string) || "✨",
    });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { supabase, admin } = await requireAdmin();
  if (!admin) {
    return { error: "Accès réservé aux administrateurs." };
  }

  const { id, label, short, emoji } = parsed.data;

  const { error } = await supabase
    .from("service_categories")
    .update({ label, short, emoji })
    .eq("id", id);

  if (error) {
    return { error: "Échec de la mise à jour de la catégorie. Veuillez réessayer." };
  }

  return { success: true };
}

export async function deleteCategory(
  _prevState: CategoryActionResult | null,
  formData: FormData
): Promise<CategoryActionResult> {
  const id = (formData.get("id") as string) ?? "";

  if (z.string().trim().safeParse(id).success === false || id.trim() === "") {
    return { error: "Identifiant invalide." };
  }

  const { supabase, admin } = await requireAdmin();
  if (!admin) {
    return { error: "Accès réservé aux administrateurs." };
  }

  if (id === DEFAULT_CATEGORY) {
    return { error: "La catégorie par défaut ne peut pas être supprimée." };
  }

  const { error: reassignError } = await supabase
    .from("jobs")
    .update({ category: DEFAULT_CATEGORY })
    .eq("category", id);

  if (reassignError) {
    return { error: "Impossible de réaffecter les offres de cette catégorie." };
  }

  const { error } = await supabase
    .from("service_categories")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "Échec de la suppression de la catégorie. Veuillez réessayer." };
  }

  return { success: true };
}

export async function moveCategory(
  _prevState: CategoryActionResult | null,
  formData: FormData
): Promise<CategoryActionResult> {
  const id = (formData.get("id") as string) ?? "";
  const dir = (formData.get("dir") as string) ?? "";

  if (dir !== "up" && dir !== "down") {
    return { error: "Direction invalide." };
  }

  const { supabase, admin } = await requireAdmin();
  if (!admin) {
    return { error: "Accès réservé aux administrateurs." };
  }

  const { data: rows } = await supabase
    .from("service_categories")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!rows || rows.length < 2) {
    return { success: true };
  }

  const index = rows.findIndex((r) => r.id === id);
  const neighborIndex = dir === "up" ? index - 1 : index + 1;
  if (index === -1 || neighborIndex < 0 || neighborIndex >= rows.length) {
    return { success: true };
  }

  const target = rows[index];
  const neighbor = rows[neighborIndex];

  // swap sort_order values (two updates so the list stays consistent)
  const { error: e1 } = await supabase
    .from("service_categories")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", target.id);
  const { error: e2 } = await supabase
    .from("service_categories")
    .update({ sort_order: target.sort_order })
    .eq("id", neighbor.id);

  if (e1 || e2) {
    return { error: "Impossible de réordonner les catégories." };
  }

  return { success: true };
}