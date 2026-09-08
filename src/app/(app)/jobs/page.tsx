"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Job } from "@/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,company.ilike.%${search}%,location.ilike.%${search}%`
        );
      }

      const { data } = await query;
      setJobs(data || []);
      setLoading(false);
    };

    fetchJobs();
  }, [filter, search, supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    router.refresh();
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <span className="badge-success"><span className="badge-dot" />Open</span>;
      case "closed":
        return <span className="badge-danger"><span className="badge-dot" />Closed</span>;
      default:
        return <span className="badge-neutral"><span className="badge-dot" />Draft</span>;
    }
  };

  const getEmploymentTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      "full-time": "badge-info",
      "part-time": "badge-neutral",
      contract: "badge-info",
      internship: "badge-neutral",
      remote: "badge-success",
    };
    return (
      <span className={`badge ${styles[type] || "badge-neutral"}`}>
        {type.replace("-", " ")}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="skeleton h-12 rounded-xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your job listings and track applicants.
          </p>
        </div>
        <Link href="/jobs/new" className="btn-primary shrink-0">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Post New Job
        </Link>
      </div>

      {/* Search & filter bar */}
      <div className="card-glass flex flex-col gap-4 rounded-2xl border-white/60 px-5 py-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search jobs by title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "open", "closed", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                filter === status
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md"
                  : "bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:shadow"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="card-table w-full">
            <thead>
              <tr>
                <th className="th">Job</th>
                <th className="th">Type</th>
                <th className="th">Salary</th>
                <th className="th">Status</th>
                <th className="th">Posted</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="td text-center py-14">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                        </svg>
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-700">No jobs found</p>
                      <p className="mt-1 text-xs text-slate-500">Try adjusting your search or filters.</p>
                      <Link href="/jobs/new" className="btn-primary mt-5">
                        Post your first job
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="tr-hover">
                    <td className="td">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-semibold text-primary-700 transition-colors hover:text-primary-500"
                      >
                        {job.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {job.company} &middot; {job.location}
                      </p>
                    </td>
                    <td className="td">
                      {getEmploymentTypeBadge(job.employment_type)}
                    </td>
                    <td className="td text-sm text-slate-600">
                      {job.salary_min && job.salary_max
                        ? `$${job.salary_min.toLocaleString()} – $${job.salary_max.toLocaleString()}`
                        : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="td">{getStatusBadge(job.status)}</td>
                    <td className="td text-sm tabular-nums text-slate-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="td text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/jobs/${job.id}/edit`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500 transition-colors hover:text-rose-600"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}