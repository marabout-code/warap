"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { changePin } from "@/lib/actions/auth";
import PinInput from "@/components/pin-input";
import type { Profile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [currentPin, setCurrentPin] = useState("");
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
          website: profileData.website || "",
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
        website: data.website || null,
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
            <h1 className="text-2xl font-bold tracking-tight text-white">{profile?.full_name || "Your Profile"}</h1>
            <p className="mt-0.5 text-sm text-white/80">PIN-protected account</p>
          </div>
        </div>
      </div>

      {/* Profile info */}
      <form className="card-glass space-y-6 rounded-2xl border-white/60 p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          <h2 className="text-base font-bold tracking-tight text-slate-900">Personal Information</h2>
        </div>

        {error && (
          <div className="animate-fade-in rounded-xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div className="animate-fade-in rounded-xl border border-emerald-200/70 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Profile updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="input-label">Full Name *</label>
            <input {...register("full_name")} type="text" className="input-field" />
            {errors.full_name && <p className="form-error">{errors.full_name.message}</p>}
          </div>
          <div>
            <label className="input-label">Location</label>
            <input {...register("location")} type="text" className="input-field" placeholder="New York, NY" />
            {errors.location && <p className="form-error">{errors.location.message}</p>}
          </div>
          <div>
            <label className="input-label">Website</label>
            <input {...register("website")} type="url" className="input-field" placeholder="https://example.com" />
            {errors.website && <p className="form-error">{errors.website.message}</p>}
          </div>
        </div>

        <div>
          <label className="input-label">Bio</label>
          <textarea {...register("bio")} rows={4} className="input-field" placeholder="Tell us about yourself..." />
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
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>

      {/* PIN change */}
      <form className="card-glass space-y-6 rounded-2xl border-white/60 p-6" onSubmit={handlePinSubmit}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          <h2 className="text-base font-bold tracking-tight text-slate-900">Change PIN</h2>
        </div>

        {pinError && (
          <div className="animate-fade-in rounded-xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {pinError}
          </div>
        )}
        {pinSuccess && (
          <div className="animate-fade-in rounded-xl border border-emerald-200/70 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            PIN changed successfully!
          </div>
        )}

        <div className="space-y-3">
          <label className="input-label block text-center">Current PIN</label>
          <div className="flex justify-center">
            <input
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              type="password"
              inputMode="numeric"
              maxLength={6}
              required
              autoComplete="one-time-code"
              className="h-12 w-full max-w-xs rounded-xl border-2 border-slate-200 bg-white px-4 text-center text-lg font-bold tracking-[0.3em] text-slate-900 shadow-sm transition-all duration-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-slate-300"
              placeholder="••••••"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="input-label block text-center">New PIN</label>
          <PinInput
            name="newPin"
            value={newPin}
            onChange={setNewPin}
          />
        </div>

        <div className="space-y-3">
          <label className="input-label block text-center">Confirm New PIN</label>
          <PinInput
            name="confirmNewPin"
            value={confirmNewPin}
            onChange={setConfirmNewPin}
          />
          {newPin && confirmNewPin && newPin !== confirmNewPin && (
            <p className="text-center text-xs text-rose-500">PINs don&apos;t match</p>
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
                Updating...
              </>
            ) : (
              "Change PIN"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}