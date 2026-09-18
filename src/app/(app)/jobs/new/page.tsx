"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { jobSchema, type JobInput } from "@/lib/validations";
import Link from "next/link";

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
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
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setRole(profile?.role ?? null);
      }
    };
    getUser();
  }, [supabase]);

  const onSubmit = async (data: JobInput) => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    const { error: dbError } = await supabase.from("jobs").insert({
      title: data.title,
      description: data.description,
      company: data.company,
      location: data.location,
      salary_min: data.salary_min || null,
      salary_max: data.salary_max || null,
      employment_type: data.employment_type,
      status: data.status,
      contact_phone: data.contact_phone || null,
      posted_by: userId,
    });

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push("/jobs");
    router.refresh();
  };

  if (role === "jobseeker") {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient-soft">
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="mt-4 text-lg font-bold text-slate-900">
            Réservé aux familles employeuses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ce formulaire permet de publier une offre. Pour postuler, parcourez
            les annonces publiques ou votre espace candidat.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/annonces" className="btn-primary">
              Voir les annonces publiques
            </Link>
            <Link href="/applications" className="btn-secondary">
              Mes candidatures
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/jobs"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-700 hover:shadow"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Publier une annonce</h1>
          <p className="mt-1 text-sm text-slate-500">
            Décrivez le poste à pourvoir au Cameroun et le profil recherché.
          </p>
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
            <label className="input-label">Poste recherché *</label>
            <input {...register("title")} type="text" className="input-field" placeholder="Aide ménagère à domicile" />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>
          <div>
            <label className="input-label">Famille / Employeur *</label>
            <input {...register("company")} type="text" className="input-field" placeholder="Particulier – Famille Kouam" />
            {errors.company && <p className="form-error">{errors.company.message}</p>}
          </div>
          <div>
            <label className="input-label">Lieu (ville / quartier) *</label>
            <input {...register("location")} type="text" className="input-field" placeholder="Douala (Bonapriso), Cameroun" />
            {errors.location && <p className="form-error">{errors.location.message}</p>}
          </div>
          <div>
            <label className="input-label">Type de contrat *</label>
            <select {...register("employment_type")} className="input-field">
              <option value="full-time">Temps plein</option>
              <option value="part-time">Temps partiel</option>
              <option value="contract">Contrat</option>
              <option value="internship">Stage</option>
              <option value="remote">À distance</option>
            </select>
            {errors.employment_type && <p className="form-error">{errors.employment_type.message}</p>}
          </div>
          <div>
            <label className="input-label">Salaire minimum (FCFA / mois)</label>
            <input {...register("salary_min", { valueAsNumber: true })} type="number" min="0" className="input-field" placeholder="50000" />
            {errors.salary_min && <p className="form-error">{errors.salary_min.message}</p>}
          </div>
          <div>
            <label className="input-label">Salaire maximum (FCFA / mois)</label>
            <input {...register("salary_max", { valueAsNumber: true })} type="number" min="0" className="input-field" placeholder="80000" />
            {errors.salary_max && <p className="form-error">{errors.salary_max.message}</p>}
          </div>
        </div>

        <div>
          <label className="input-label">Téléphone de contact (WhatsApp)</label>
          <input {...register("contact_phone")} type="tel" className="input-field" placeholder="+237 6 00 00 00 00" />
          {errors.contact_phone && <p className="form-error">{errors.contact_phone.message}</p>}
        </div>

        <div>
          <label className="input-label">Description du poste *</label>
          <textarea {...register("description")} rows={6} className="input-field" placeholder="Décrivez les tâches, les horaires, l'hébergement éventuel et les références demandées..." />
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
          <Link href="/jobs" className="btn-secondary">
            Annuler
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Publication...
              </>
            ) : (
              "Publier l'annonce"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}