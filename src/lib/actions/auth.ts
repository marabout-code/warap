"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPin, verifyPin, pinLookup, generateRandomPassword, generateSyntheticEmail } from "@/lib/pin";
import { registerSchema, loginSchema, changePinSchema } from "@/lib/validations";

export type AuthResult = { error: string } | { success: true };

export async function registerUser(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const raw = {
    fullName: formData.get("fullName") as string,
    pin: formData.get("pin") as string,
    confirmPin: formData.get("confirmPin") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.confirmPin?.[0] || "Entrée invalide" };
  }

  const { fullName, pin } = parsed.data;
  const secret = generateRandomPassword();
  const pinHash = await hashPin(pin);
  const lookup = pinLookup(pin);
  const email = generateSyntheticEmail();

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: secret,
    options: { data: { full_name: fullName } },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (!signUpData.user) {
    return { error: "L'inscription a échoué. Veuillez réessayer." };
  }

  const userId = signUpData.user.id;

  const { error: updateError } = await admin
    .from("profiles")
    .update({ pin_hash: pinHash, pin_lookup: lookup, supabase_auth_secret: secret })
    .eq("id", userId);

  if (updateError) {
    return { error: "Échec de la configuration du PIN. Veuillez réessayer." };
  }

  redirect("/dashboard");
}

export async function loginUser(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const raw = {
    pin: formData.get("pin") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Format de PIN invalide." };
  }

  const { pin } = parsed.data;
  const lookup = pinLookup(pin);
  const admin = createAdminClient();

  const {
    data: profile,
    error: lookupError,
  } = await admin
    .from("profiles")
    .select("email, pin_hash, supabase_auth_secret")
    .eq("pin_lookup", lookup)
    .maybeSingle();

  if (lookupError) {
    return { error: "Plusieurs comptes utilisent ce PIN. Veuillez utiliser un autre PIN." };
  }

  if (!profile) {
    return { error: "Aucun compte trouvé avec ce PIN." };
  }

  if (!profile.pin_hash || !profile.supabase_auth_secret) {
    return { error: "Compte incomplet. Veuillez vous inscrire à nouveau." };
  }

  const valid = await verifyPin(pin, profile.pin_hash);
  if (!valid) {
    return { error: "PIN incorrect. Veuillez réessayer." };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: profile.supabase_auth_secret,
  });

  if (signInError) {
    return { error: "La connexion a échoué. Veuillez réessayer." };
  }

  redirect("/dashboard");
}

export async function changePin(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const raw = {
    currentPin: formData.get("currentPin") as string,
    newPin: formData.get("newPin") as string,
    confirmNewPin: formData.get("confirmNewPin") as string,
  };

  const parsed = changePinSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { error: errors.newPin?.[0] || errors.confirmNewPin?.[0] || errors.currentPin?.[0] || "Entrée invalide" };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Non authentifié." };
  }

  const { data: profile, error: lookupError } = await admin
    .from("profiles")
    .select("pin_hash")
    .eq("id", user.id)
    .single();

  if (lookupError || !profile?.pin_hash) {
    return { error: "Impossible de vérifier le PIN actuel." };
  }

  const valid = await verifyPin(parsed.data.currentPin, profile.pin_hash);
  if (!valid) {
    return { error: "Le PIN actuel est incorrect." };
  }

  const newPinHash = await hashPin(parsed.data.newPin);
  const newLookup = pinLookup(parsed.data.newPin);
  const { error: updateError } = await admin
    .from("profiles")
    .update({ pin_hash: newPinHash, pin_lookup: newLookup })
    .eq("id", user.id);

  if (updateError) {
    return { error: "Échec de la mise à jour du PIN. Veuillez réessayer." };
  }

  return { success: true };
}