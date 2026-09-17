"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Task } from "@/types";
import { statusLabel, priorityLabels } from "@/lib/status-labels";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [jobs, setJobs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      let query = supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (priorityFilter !== "all") {
        query = query.eq("priority", priorityFilter);
      }

      const [tasksRes, jobsRes] = await Promise.all([
        query,
        supabase.from("jobs").select("id,title"),
      ]);

      setTasks(tasksRes.data || []);
      const jobMap: Record<string, string> = {};
      jobsRes.data?.forEach((job: { id: string; title: string }) => {
        jobMap[job.id] = job.title;
      });
      setJobs(jobMap);
      setLoading(false);
    };

    fetchTasks();
  }, [statusFilter, priorityFilter, supabase]);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (!error) {
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus as Task["status"] } : t
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: "badge-neutral",
      medium: "badge-info",
      high: "badge-warning",
      urgent: "badge-danger",
    };
    return (
      <span className={`badge ${styles[priority] || "badge-neutral"}`}>
        <span className="badge-dot" />
        {priorityLabels[priority] || priority}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      todo: "badge-neutral",
      in_progress: "badge-info",
      review: "badge-warning",
      done: "badge-success",
    };
    return (
      <span className={`badge ${styles[status] || "badge-neutral"}`}>
        <span className="badge-dot" />
        {statusLabel(status)}
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tâches &amp; onboarding</h1>
          <p className="mt-1 text-sm text-slate-500">
            Suivez les étapes de vérification et d&apos;onboarding liées à vos annonces.
          </p>
        </div>
        <Link href="/tasks/new" className="btn-primary shrink-0">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouvelle tâche
        </Link>
      </div>

      {/* Filters */}
      <div className="card-glass flex flex-wrap gap-4 rounded-2xl border-white/60 px-5 py-4">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field appearance-none pl-10"
          >
            <option value="all">Tous les statuts</option>
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="review">En revue</option>
            <option value="done">Terminée</option>
          </select>
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="input-field"
        >
          <option value="all">Toutes les priorités</option>
          <option value="low">Faible</option>
          <option value="medium">Moyen</option>
          <option value="high">Élevé</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="card-table w-full">
            <thead>
              <tr>
                <th className="th">Tâche</th>
                <th className="th">Annonce</th>
                <th className="th">Priorité</th>
                <th className="th">Statut</th>
                <th className="th">Échéance</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="td text-center py-14">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-fuchsia-500 shadow-glow">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-700">Aucune tâche trouvée</p>
                      <p className="mt-1 text-xs text-slate-500">Planifiez une vérification ou une étape d&apos;onboarding.</p>
                      <Link href="/tasks/new" className="btn-primary mt-5">
                        Créer une tâche
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="tr-hover">
                    <td className="td">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="font-semibold text-primary-700 transition-colors hover:text-primary-500"
                      >
                        {task.title}
                      </Link>
                      <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                        {task.description.length > 50
                          ? task.description.substring(0, 50) + "..."
                          : task.description}
                      </p>
                    </td>
                    <td className="td text-sm text-slate-600">
                      {jobs[task.job_id] || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="td">{getPriorityBadge(task.priority)}</td>
                    <td className="td">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className="input-field w-36 py-1.5 text-xs"
                      >
                        <option value="todo">À faire</option>
                        <option value="in_progress">En cours</option>
                        <option value="review">En revue</option>
                        <option value="done">Terminée</option>
                      </select>
                    </td>
                    <td className="td text-sm tabular-nums text-slate-500">
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString("fr-FR")
                        : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="td text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/tasks/${task.id}/edit`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500 transition-colors hover:text-rose-600"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Supprimer
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