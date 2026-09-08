"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Job, Task } from "@/types";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchJobData = async () => {
      const [{ data: jobData }, { data: tasksData }] = await Promise.all([
        supabase.from("jobs").select("*").eq("id", jobId).single(),
        supabase.from("tasks").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
      ]);
      setJob(jobData);
      setTasks(tasksData || []);
      setLoading(false);
    };
    fetchJobData();
  }, [jobId, supabase]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    await supabase.from("jobs").delete().eq("id", jobId);
    router.push("/jobs");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-20 rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="skeleton h-64 rounded-2xl lg:col-span-2" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700">Job not found</p>
        <Link href="/jobs" className="btn-primary mt-4">
          Back to jobs
        </Link>
      </div>
    );
  }

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

  const getTaskStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      todo: "badge-neutral",
      in_progress: "badge-info",
      review: "badge-warning",
      done: "badge-success",
    };
    return <span className={`badge ${styles[status] || "badge-neutral"}`}><span className="badge-dot" />{status.replace("_", " ")}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/jobs"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-700 hover:shadow"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{job.title}</h1>
              {getStatusBadge(job.status)}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {job.company} &middot; {job.location}
            </p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link href={`/jobs/${job.id}/edit`} className="btn-secondary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
              <h2 className="text-base font-bold tracking-tight text-slate-900">Description</h2>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {job.description}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                <h2 className="text-base font-bold tracking-tight text-slate-900">Tasks</h2>
              </div>
              <Link
                href={`/tasks/new?job_id=${job.id}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Task
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {tasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-sm text-slate-500">No tasks associated with this job yet.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-primary-700">{task.title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {task.description.length > 50 ? task.description.substring(0, 50) + "..." : task.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`badge ${task.priority === "urgent" ? "badge-danger" : task.priority === "high" ? "badge-warning" : "badge-neutral"}`}>
                        <span className="badge-dot" />{task.priority}
                      </span>
                      {getTaskStatusBadge(task.status)}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Job Details</h2>
            </div>
            <dl className="mt-5 space-y-4">
              {[
                { label: "Employment Type", value: job.employment_type.replace("-", " ") },
                { label: "Salary Range", value: job.salary_min && job.salary_max ? `$${job.salary_min.toLocaleString()} – $${job.salary_max.toLocaleString()}` : "Not specified" },
                { label: "Posted On", value: new Date(job.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                { label: "Last Updated", value: new Date(job.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50/70 px-4 py-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">{item.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold capitalize text-slate-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}