"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { jobSchema, type JobInput } from "@/lib/validations";
import { categoryOptions } from "@/lib/service-categories";
import Link from "next/link";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobInput>({
    resolver: async (data) => {
      try {
        const validated = await jobSchema.parseAsync(data);
        return { values: validated, errors: {} };
      } catch (err: any) {
        return { values: {}, errors: err.formErrors?.fieldErrors || {} };
      }
    },
  });

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase.from("jobs").select("*").eq("id", jobId).single();
      if (!data) {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const canManage =
        profile?.role === "admin" ||
        (profile?.role === "employer" && data.posted_by === user.id);
      if (!canManage) {
        router.replace("/dashboard");
        return;
      }

      reset({
        title: data.title,
        description: data.description,
        company: data.company,
        location: data.location,
        salary_min: data.salary_min || undefined,
        salary_max: data.salary_max || undefined,
        employment_type: data.employment_type,
        category: data.category,
        status: data.status,
        contact_phone: data.contact_phone || "",
      });
      setLoading(false);
    };
    fetchJob();
  }, [jobId, supabase, reset, router]);

  const onSubmit = async (data: JobInput) => {
    setSaving(true);
    setError(null);

    const { error: dbError } = await supabase
      .from("jobs")
      .update({
        title: data.title,
        description: data.description,
        company: data.company,
        location: data.location,
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
        employment_type: data.employment_type,
        category: data.category,
        status: data.status,
        contact_phone: data.contact_phone || null,
      })
      .eq("id", jobId);

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    router.push(`/jobs/${jobId}`);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/jobs/${jobId}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-700 hover:shadow"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Modifier l&apos;offre</h1>
          <p className="mt-1 text-sm text-slate-500">Mettez à jour les détails de votre offre.</p>
        </div>
      </div>

      <form className="card-glass space-y-6 rounded-2xl border-white/60 p-6" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="animate-fade-in rounded-xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="input-label">Service recherché *</label>
            <input {...register("title")} type="text" className="input-field" />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>
          <div>
            <label className="input-label">Client *</label>
            <input {...register("company")} type="text" className="input-field" />
            {errors.company && <p className="form-error">{errors.company.message}</p>}
          </div>
          <div>
            <label className="input-label">Catégorie de service *</label>
            <select {...register("category")} className="input-field">
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category.message}</p>}
          </div>
          <div>
            <label className="input-label">Lieu (ville / quartier) *</label>
            <input {...register("location")} type="text" className="input-field" />
            {errors.location && <p className="form-error">{errors.location.message}</p>}
          </div>
          <div>
            <label className="input-label">Type d&apos;engagement *</label>
            <select {...register("employment_type")} className="input-field">
              <option value="full-time">Temps plein</option>
              <option value="part-time">Temps partiel</option>
              <option value="contract">Contrat</option>
            </select>
          </div>
          <div>
            <label className="input-label">Tarif minimum (FCFA)</label>
            <input {...register("salary_min", { valueAsNumber: true })} type="number" min="0" className="input-field" />
          </div>
          <div>
            <label className="input-label">Tarif maximum (FCFA)</label>
            <input {...register("salary_max", { valueAsNumber: true })} type="number" min="0" className="input-field" />
          </div>
        </div>

        <div>
          <label className="input-label">Téléphone de contact (WhatsApp)</label>
          <input {...register("contact_phone")} type="tel" className="input-field" placeholder="+237 6 00 00 00 00" />
        </div>

        <div>
          <label className="input-label">Description du service *</label>
          <textarea {...register("description")} rows={6} className="input-field" />
          {errors.description && <p className="form-error">{errors.description.message}</p>}
        </div>

        <div>
          <label className="input-label">Statut</label>
          <select {...register("status")} className="input-field">
            <option value="open">Ouvert</option>
            <option value="draft">Brouillon</option>
            <option value="closed">Fermé</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href={`/jobs/${jobId}`} className="btn-secondary">
            Annuler
          </Link>
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
    </div>
  );
}