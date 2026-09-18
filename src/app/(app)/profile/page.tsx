"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { changePin } from "@/lib/actions/auth";
import PinInput from "@/components/pin-input";
import type { Profile } from "@/types";
import { userRoleLabels } from "@/lib/status-labels";
import { roleMeta, type UserRole } from "@/lib/roles";

const roleBadgeStyles: Record<string, string> = {
  admin: "bg-white/25 text-white",
  employer: "bg-white/25 text-white",
  jobseeker: "bg-white/25 text-white",
  agent: "bg-amber-400/90 text-amber-950",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [currentPin, setCurrentPin] = useState("");
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinPending, setPinPending] = useState(false);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: async (data) => {
      try {
        const validated = await profileSchema.parseAsync(data);
        return { values: validated, errors: {} };
      } catch (err: any) {
        return { values: {}, errors: err.formErrors?.fieldErrors || {} };
      }
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: profileData } = await supabase
        .from("profiles").select("*").eq("id", user.id).single();

      if (profileData) {
        setProfile(profileData);
        reset({
          full_name: profileData.full_name,
          bio: profileData.bio || "",
          location: profileData.location || "",
          phone: profileData.phone || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [supabase, reset]);

  const onSubmit = async (data: ProfileInput) => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: dbError } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        bio: data.bio || null,
        location: data.location || null,
        phone: data.phone || null,
      })
      .eq("id", profile.id);

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handlePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("currentPin", currentPin);
    formData.set("newPin", newPin);
    formData.set("confirmNewPin", confirmNewPin);

    setPinPending(true);
    setPinError(null);
    setPinSuccess(false);

    const result = await changePin(null, formData);
    if (result && "error" in result) {
      setPinError(result.error);
    } else {
      setPinSuccess(true);
      setCurrentPin("");
      setNewPin("");
      setConfirmNewPin("");
      setTimeout(() => setPinSuccess(false), 3000);
    }
    setPinPending(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="skeleton h-80 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile header card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-accent-600 to-accent-500 p-6 shadow-glow-lg sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="relative flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-inner backdrop-blur">
            {profile?.full_name?.charAt(0) || "?"}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white">{profile?.full_name || "Votre profil"}</h1>
              {profile?.role && (
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur ${roleBadgeStyles[profile.role] || "bg-white/25 text-white"}`}>
                  {userRoleLabels[profile.role] || profile.role}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-white/80">
              {profile?.role
                ? `${roleMeta[profile.role as UserRole]?.tagline} · Compte protégé par PIN`
                : "Compte protégé par PIN"}
            </p>
          </div>
        </div>
      </div>

      {/* Profile info */}
      <form className="card-glass space-y-6 rounded-2xl border-white/60 p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          <h2 className="text-base font-bold tracking-tight text-slate-900">Informations personnelles</h2>
        </div>

        {error && (
          <div className="animate-fade-in rounded-xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div className="animate-fade-in rounded-xl border border-emerald-200/70 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Profil mis à jour avec succès !
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="input-label">Nom complet *</label>
            <input {...register("full_name")} type="text" className="input-field" />
            {errors.full_name && <p className="form-error">{errors.full_name.message}</p>}
          </div>
          <div>
            <label className="input-label">Localisation</label>
            <input {...register("location")} type="text" className="input-field" placeholder="Douala (Bonapriso), Cameroun" />
            {errors.location && <p className="form-error">{errors.location.message}</p>}
          </div>
          <div>
            <label className="input-label">Téléphone (WhatsApp)</label>
            <input {...register("phone")} type="tel" className="input-field" placeholder="+237 6 00 00 00 00" />
            {errors.phone && <p className="form-error">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="input-label">Biographie</label>
          <textarea {...register("bio")} rows={4} className="input-field" placeholder="Décrivez votre expérience, vos références et vos disponibilités..." />
          {errors.bio && <p className="form-error">{errors.bio.message}</p>}
        </div>

        <div className="flex items-center justify-end pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enregistrement…
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </div>
      </form>

      {/* PIN change */}
      <form className="card-glass space-y-6 rounded-2xl border-white/60 p-6" onSubmit={handlePinSubmit}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          <h2 className="text-base font-bold tracking-tight text-slate-900">Changer le PIN</h2>
        </div>

        {pinError && (
          <div className="animate-fade-in rounded-xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {pinError}
          </div>
        )}
        {pinSuccess && (
          <div className="animate-fade-in rounded-xl border border-emerald-200/70 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            PIN modifié avec succès !
          </div>
        )}

        <div className="space-y-3">
          <label className="input-label block text-center">PIN actuel</label>
          <div className="relative mx-auto w-full max-w-xs">
            <input
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              type={showCurrentPin ? "text" : "password"}
              inputMode={showCurrentPin ? undefined : "numeric"}
              maxLength={6}
              required
              autoComplete="one-time-code"
              className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 pr-11 text-center text-lg font-bold tracking-[0.3em] text-slate-900 shadow-sm transition-all duration-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-slate-300"
              placeholder="••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPin((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary-600"
              aria-label={showCurrentPin ? "Masquer le PIN" : "Afficher le PIN"}
            >
              {showCurrentPin ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="input-label block text-center">Nouveau PIN</label>
          <PinInput
            name="newPin"
            value={newPin}
            onChange={setNewPin}
          />
        </div>

        <div className="space-y-3">
          <label className="input-label block text-center">Confirmer le nouveau PIN</label>
          <PinInput
            name="confirmNewPin"
            value={confirmNewPin}
            onChange={setConfirmNewPin}
          />
          {newPin && confirmNewPin && newPin !== confirmNewPin && (
            <p className="text-center text-xs text-rose-500">Les PIN ne correspondent pas</p>
          )}
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={pinPending || currentPin.length !== 6 || newPin.length !== 6 || confirmNewPin.length !== 6 || newPin !== confirmNewPin}
            className="btn-primary"
          >
            {pinPending ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Mise à jour…
              </>
            ) : (
              "Changer le PIN"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}