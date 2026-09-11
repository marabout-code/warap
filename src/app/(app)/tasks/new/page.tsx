"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { taskSchema, type TaskInput } from "@/lib/validations";
import Link from "next/link";
import type { Job, Profile } from "@/types";

export default function NewTaskPage() {
  return (
    <Suspense>
      <NewTaskContent />
    </Suspense>
  );
}

function NewTaskContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledJobId = searchParams.get("job_id");
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskInput>({
    defaultValues: {
      job_id: prefilledJobId || "",
      priority: "medium",
      status: "todo",
    },
    resolver: async (data) => {
      try {
        const validated = await taskSchema.parseAsync(data);
        return { values: validated, errors: {} };
      } catch (err: any) {
        return { values: {}, errors: err.formErrors?.fieldErrors || {} };
      }
    },
  });

  useEffect(() => {
    const init = async () => {
      const [{ data: { user } }, { data: jobsData }, { data: profilesData }] =
        await Promise.all([
          supabase.auth.getUser(),
          supabase.from("jobs").select("*").order("created_at", { ascending: false }),
          supabase.from("profiles").select("*").order("full_name"),
        ]);
      setUserId(user?.id || null);
      setJobs(jobsData || []);
      setProfiles(profilesData || []);
    };
    init();
  }, [supabase]);

  const onSubmit = async (data: TaskInput) => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    const { error: dbError } = await supabase.from("tasks").insert({
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      due_date: data.due_date || null,
      job_id: data.job_id,
      assigned_to: data.assigned_to || null,
      created_by: userId,
    });

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push("/tasks");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tasks" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-700 hover:shadow">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Créer une tâche</h1>
          <p className="mt-1 text-sm text-slate-500">Ajoutez une nouvelle tâche pour suivre l&apos;avancement du travail.</p>
        </div>
      </div>

      <form className="card-glass space-y-6 rounded-2xl border-white/60 p-6" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="animate-fade-in rounded-xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className="input-label">Titre de la tâche *</label>
          <input {...register("title")} type="text" className="input-field" placeholder="Terminer l'intégration" />
          {errors.title && <p className="form-error">{errors.title.message}</p>}
        </div>

        <div>
          <label className="input-label">Description *</label>
          <textarea {...register("description")} rows={4} className="input-field" placeholder="Décrivez ce qui doit être fait..." />
          {errors.description && <p className="form-error">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="input-label">Offre associée *</label>
            <select {...register("job_id")} className="input-field">
              <option value="">Sélectionnez une offre...</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            {errors.job_id && <p className="form-error">{errors.job_id.message}</p>}
          </div>
          <div>
            <label className="input-label">Assigner à</label>
            <select {...register("assigned_to")} className="input-field">
              <option value="">Non assigné</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>{profile.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Priorité</label>
            <select {...register("priority")} className="input-field">
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="high">Élevé</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="input-label">Échéance</label>
            <input {...register("due_date")} type="date" className="input-field" />
          </div>
        </div>

        <div>
          <label className="input-label">Statut</label>
          <select {...register("status")} className="input-field">
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="review">En revue</option>
            <option value="done">Terminée</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/tasks" className="btn-secondary">Annuler</Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Création...
              </>
            ) : (
              "Créer la tâche"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}