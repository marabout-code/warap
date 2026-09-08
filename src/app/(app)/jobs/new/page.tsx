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
    };
    getUser();
  }, [supabase.auth]);

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Post a New Job</h1>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to create a new job listing.
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
            <label className="input-label">Job Title *</label>
            <input {...register("title")} type="text" className="input-field" placeholder="Senior Frontend Developer" />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>
          <div>
            <label className="input-label">Company *</label>
            <input {...register("company")} type="text" className="input-field" placeholder="Acme Inc." />
            {errors.company && <p className="form-error">{errors.company.message}</p>}
          </div>
          <div>
            <label className="input-label">Location *</label>
            <input {...register("location")} type="text" className="input-field" placeholder="San Francisco, CA" />
            {errors.location && <p className="form-error">{errors.location.message}</p>}
          </div>
          <div>
            <label className="input-label">Employment Type *</label>
            <select {...register("employment_type")} className="input-field">
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
            {errors.employment_type && <p className="form-error">{errors.employment_type.message}</p>}
          </div>
          <div>
            <label className="input-label">Minimum Salary</label>
            <input {...register("salary_min", { valueAsNumber: true })} type="number" min="0" className="input-field" placeholder="50000" />
            {errors.salary_min && <p className="form-error">{errors.salary_min.message}</p>}
          </div>
          <div>
            <label className="input-label">Maximum Salary</label>
            <input {...register("salary_max", { valueAsNumber: true })} type="number" min="0" className="input-field" placeholder="80000" />
            {errors.salary_max && <p className="form-error">{errors.salary_max.message}</p>}
          </div>
        </div>

        <div>
          <label className="input-label">Job Description *</label>
          <textarea {...register("description")} rows={6} className="input-field" placeholder="Describe the role, responsibilities, and requirements..." />
          {errors.description && <p className="form-error">{errors.description.message}</p>}
        </div>

        <div>
          <label className="input-label">Status</label>
          <select {...register("status")} className="input-field">
            <option value="open">Open</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/jobs" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Posting...
              </>
            ) : (
              "Post Job"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}