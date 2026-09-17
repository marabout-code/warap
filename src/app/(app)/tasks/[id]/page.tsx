"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Task, Job, Profile } from "@/types";
import { statusLabel, priorityLabels } from "@/lib/status-labels";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [assignee, setAssignee] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTaskData = async () => {
      const { data: taskData } = await supabase
        .from("tasks").select("*").eq("id", taskId).single();

      if (taskData) {
        setTask(taskData);
        const [jobRes, assigneeRes] = await Promise.all([
          supabase.from("jobs").select("*").eq("id", taskData.job_id).single(),
          taskData.assigned_to
            ? supabase.from("profiles").select("*").eq("id", taskData.assigned_to).single()
            : Promise.resolve({ data: null }),
        ]);
        setJob(jobRes.data);
        setAssignee(assigneeRes.data);
      }
      setLoading(false);
    };
    fetchTaskData();
  }, [taskId, supabase]);

  const updateStatus = async (newStatus: Task["status"]) => {
    if (!task) return;
    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId);
    if (!error) setTask({ ...task, status: newStatus });
  };

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
    await supabase.from("tasks").delete().eq("id", taskId);
    router.push("/tasks");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-20 rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="skeleton h-48 rounded-2xl lg:col-span-2" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700">Tâche introuvable</p>
        <Link href="/tasks" className="btn-primary mt-4">Retour aux tâches</Link>
      </div>
    );
  }

  const statusOptions: Task["status"][] = ["todo", "in_progress", "review", "done"];

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: "badge-neutral", medium: "badge-info", high: "badge-warning", urgent: "badge-danger",
    };
    return <span className={`badge ${styles[priority] || "badge-neutral"}`}><span className="badge-dot" />{priorityLabels[priority] || priority}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/tasks" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-700 hover:shadow">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{task.title}</h1>
              {getPriorityBadge(task.priority)}
            </div>
            <p className="mt-1 text-sm text-slate-500">{job ? job.title : "Annonce inconnue"}</p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link href={`/tasks/${task.id}/edit`} className="btn-secondary">Modifier</Link>
          <button onClick={handleDelete} className="btn-danger">Supprimer</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Description */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
              <h2 className="text-base font-bold tracking-tight text-slate-900">Description</h2>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{task.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status picker */}
          <div className="card">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Statut</h2>
            </div>
            <div className="mt-4 space-y-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={task.status === status}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                    task.status === status
                      ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {statusLabel(status)}
                    {task.status === status && (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="card">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Détails</h2>
            </div>
            <dl className="mt-4 space-y-3">
              {[
                { label: "Assigné à", value: assignee?.full_name || "Non assigné" },
                { label: "Échéance", value: task.due_date ? new Date(task.due_date).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) : "Pas d'échéance" },
                { label: "Créée le", value: new Date(task.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) },
                { label: "Mise à jour", value: new Date(task.updated_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50/70 px-4 py-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">{item.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Related job */}
          {job && (
            <Link
              href={`/jobs/${job.id}`}
              className="card group block transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Annonce associée</h3>
              </div>
              <p className="mt-3 text-sm font-semibold text-primary-700 group-hover:text-primary-500">{job.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{job.company}</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}