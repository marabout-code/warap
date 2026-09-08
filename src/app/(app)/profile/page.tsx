"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import type { Profile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
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

      setEmail(user.email || "");
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="skeleton h-80 rounded-2xl" />
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
            {profile?.full_name?.charAt(0) || email.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{profile?.full_name || "Your Profile"}</h1>
            <p className="mt-0.5 text-sm text-white/80">{email}</p>
          </div>
        </div>
      </div>

      <form className="card-glass space-y-6 rounded-2xl border-white/60 p-6" onSubmit={handleSubmit(onSubmit)}>
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
          <div>
            <label className="input-label">Full Name *</label>
            <input {...register("full_name")} type="text" className="input-field" />
            {errors.full_name && <p className="form-error">{errors.full_name.message}</p>}
          </div>
          <div>
            <label className="input-label">Email</label>
            <input type="email" value={email} disabled className="input-field cursor-not-allowed bg-slate-100/70" />
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
    </div>
  );
}