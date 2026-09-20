"use client";

import { Fragment, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Application, Job, Profile, Task } from "@/types";
import {
  employmentTypeLabels,
  priorityLabels,
  applicationStatusLabels,
  verificationStatusLabels,
  statusLabel,
  formatSalary,
  whatsappHref,
} from "@/lib/status-labels";
import {
  categoryLabel,
  categoryEmoji,
} from "@/lib/service-categories";

type AppRow = Application & { applicant?: Profile };

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [applications, setApplications] = useState<AppRow[]>([]);
  const [agents, setAgents] = useState<Profile[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [canManage, setCanManage] = useState(false);
  const [viewerRole, setViewerRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchJobData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const [{ data: jobData }, { data: tasksData }] = await Promise.all([
        supabase.from("jobs").select("*").eq("id", jobId).single(),
        supabase.from("tasks").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
      ]);
      setJob(jobData);
      setTasks(tasksData || []);

      let canManageThis = false;
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setViewerRole(profile?.role ?? null);
        canManageThis =
          (jobData?.posted_by === user.id && profile?.role === "employer") ||
          profile?.role === "admin";
      }
      setCanManage(canManageThis);

      if (canManageThis && jobData) {
        const { data: apps } = await supabase
          .from("applications")
          .select("*")
          .eq("job_id", jobData.id)
          .order("created_at", { ascending: false });

        if (apps && apps.length > 0) {
          const userIds = [...new Set(apps.map((a) => a.user_id))];
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("*")
            .in("id", userIds);
          const profileMap: Record<string, Profile> = {};
          profilesData?.forEach((p) => {
            profileMap[p.id] = p;
          });
          setApplications(
            apps.map((app) => ({ ...app, applicant: profileMap[app.user_id] }))
          );
        } else {
          setApplications(apps || []);
        }

        const { data: agentsData } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "agent");
        setAgents(agentsData || []);
      }

      setLoading(false);
    };
    fetchJobData();
  }, [jobId, supabase]);

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
    await supabase.from("jobs").delete().eq("id", jobId);
    router.push("/jobs");
    router.refresh();
  };

  const updateStatus = async (appId: string, newStatus: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", appId);
    if (!error) {
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, status: newStatus as Application["status"] } : app
        )
      );
    }
  };

  const requestVerification = async (app: AppRow) => {
    setActionError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const updates: Partial<Application> = { verification_status: "in_review" };
    if (app.verification_status === "unverified") {
      updates.verification_status = "in_review";
    } else {
      setActionError("Une vérification est déjà mentionnée sur cette réponse.");
      return;
    }

    const { error: appError } = await supabase
      .from("applications")
      .update(updates)
      .eq("id", app.id);
    if (appError) {
      setActionError("Impossible de lancer la vérification.");
      return;
    }

    if (selectedAgent) {
      const { error: taskError } = await supabase
        .from("tasks")
        .insert({
          title: `Vérifier le dossier de ${app.applicant?.full_name ?? "ce prestataire"}`,
          description: `Contrôle de l'identité, de l'adresse et des pièces du dossier pour l'offre « ${job?.title} ».`,
          priority: "high",
          job_id: jobId,
          assigned_to: selectedAgent,
          created_by: user.id,
        });
      if (taskError) {
        setActionError("Candidature marquée « en vérification », mais la tâche n'a pas pu être créée.");
      }
    }

    setApplications(
      applications.map((a) =>
        a.id === app.id ? { ...a, verification_status: "in_review" } : a
      )
    );
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
        <p className="mt-4 text-sm font-semibold text-slate-700">Annonce introuvable</p>
        <Link href="/jobs" className="btn-primary mt-4">
          Retour aux offres
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <span className="badge-success"><span className="badge-dot" />Ouvert</span>;
      case "closed":
        return <span className="badge-danger"><span className="badge-dot" />Fermé</span>;
      default:
        return <span className="badge-neutral"><span className="badge-dot" />Brouillon</span>;
    }
  };

  const getVerificationBadge = (status: string) => {
    const styles: Record<string, string> = {
      unverified: "badge-neutral",
      in_review: "badge-warning",
      verified: "badge-success",
      rejected: "badge-danger",
    };
    return (
      <span className={`badge ${styles[status] || "badge-neutral"}`}>
        <span className="badge-dot" />
        {verificationStatusLabels[status] || status}
      </span>
    );
  };

  const getInitials = (name?: string) =>
    (name || "?")
      .split(" ")
      .map((p) => p.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();

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
              <span className="badge badge-neutral">
                {categoryEmoji(job.category)} {categoryLabel(job.category)}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {job.company} &middot; {job.location}
            </p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          {canManage && (
            <Link href={`/jobs/${job.id}/edit`} className="btn-secondary">
              Modifier
            </Link>
          )}
          {canManage && (
            <button onClick={handleDelete} className="btn-danger">
              Supprimer
            </button>
          )}
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

          {/* Candidatures reçues */}
          {canManage && (
            <div className="card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                  <h2 className="text-base font-bold tracking-tight text-slate-900">
                    Réponses reçues
                  </h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                    {applications.length}
                  </span>
                </div>
                <Link
                  href="/applications"
                  className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                >
                  Voir toutes les réponses
                </Link>
              </div>

              {agents.length > 0 && (
                <div className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 sm:flex-row sm:items-center">
                  <label htmlFor="verif-agent" className="text-xs font-semibold text-slate-600">
                    Agent vérificateur :
                  </label>
                  <select
                    id="verif-agent"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="select-field flex-1 !py-1.5 text-xs"
                  >
                    <option value="">Choisir un agent…</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.full_name} {agent.location ? `· ${agent.location}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {actionError && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
                  {actionError}
                </div>
              )}

              {applications.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    Aucune réponse pour l&apos;instant. Partagez votre offre
                    pour recevoir les premiers dossiers.
                  </p>
                </div>
              ) : (
                <ul className="mt-5 space-y-3">
                  {applications.map((app) => (
                    <li
                      key={app.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white">
                            {getInitials(app.applicant?.full_name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {app.applicant?.full_name || "Prestataire inconnu"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Réponse envoyée le{" "}
                              {new Date(app.created_at).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            {(app.contact_phone || app.applicant?.phone) && (
                              <a
                                href={whatsappHref((app.contact_phone || app.applicant?.phone)!)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 transition-colors hover:text-primary-500"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                </svg>
                                {app.contact_phone || app.applicant?.phone}
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app.id, e.target.value)}
                            className="input-field w-40 py-1.5 text-xs"
                          >
                            <option value="pending">En attente</option>
                            <option value="reviewed">Examinée</option>
                            <option value="shortlisted">Présélectionnée</option>
                            <option value="rejected">Rejetée</option>
                            <option value="accepted">Acceptée</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {getVerificationBadge(app.verification_status)}
                          {app.documents && app.documents.length > 0 && (
                            <span className="doc-pill">
                              {app.documents.length} pièce(s)
                            </span>
                          )}
                          <span className="badge-neutral">
                            {applicationStatusLabels[app.status] || app.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {app.verification_status === "unverified" && (
                            <button
                              onClick={() => requestVerification(app)}
                              className="btn-secondary !px-3 !py-1.5 !text-xs"
                            >
                              Demander la vérification
                            </button>
                          )}
                          <Link
                            href="/applications"
                            className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-primary-600 transition-colors hover:bg-primary-50"
                          >
                            Dossier complet
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Tâches */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                <h2 className="text-base font-bold tracking-tight text-slate-900">Tâches</h2>
              </div>
              {canManage && (
                <Link
                  href={`/tasks/new?job_id=${job.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Ajouter une tâche
                </Link>
              )}
            </div>
            <div className="mt-4 space-y-3">
              {tasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-sm text-slate-500">Aucune tâche associée à cette offre pour le moment.</p>
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
                        {task.description.length > 50 ? task.description.substring(0, 50) + "…" : task.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`badge ${task.priority === "urgent" ? "badge-danger" : task.priority === "high" ? "badge-warning" : "badge-neutral"}`}>
                        <span className="badge-dot" />{priorityLabels[task.priority] || task.priority}
                      </span>
                      <span className={`badge ${
                        task.status === "done" ? "badge-success" : task.status === "review" ? "badge-warning" : task.status === "in_progress" ? "badge-info" : "badge-neutral"
                      }`}>
                        <span className="badge-dot" />
                        {statusLabel(task.status)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {viewerRole === "jobseeker" && (
            <div className="card overflow-hidden border-0 bg-brand-gradient p-0">
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  Vous proposez ce service ?
                </p>
                <h2 className="mt-2 text-lg font-bold text-white">
                  Postulez à cette offre
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Envoyez votre motivation et vos pièces. Un agent local les
                  vérifie avant l&apos;engagement.
                </p>
                <Link
                  href={`/jobs/${job.id}/apply`}
                  className="btn-accent mt-5 w-full !py-3"
                >
                  Postuler maintenant
                </Link>
              </div>
            </div>
          )}
          <div className="card">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Détails de l&apos;offre</h2>
            </div>
            <dl className="mt-5 space-y-4">
              {[
                { label: "Type d'engagement", value: employmentTypeLabels[job.employment_type] || job.employment_type.replace("-", " ") },
                { label: "Tarif (FCFA)", value: formatSalary(job.salary_min, job.salary_max) },
                { label: "Contact (WhatsApp)", value: job.contact_phone || "Non spécifié" },
                { label: "Publiée le", value: new Date(job.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) },
                { label: "Mise à jour", value: new Date(job.updated_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50/70 px-4 py-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">{item.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                    {item.label === "Contact (WhatsApp)" && item.value !== "Non spécifié" ? (
                      <a
                        href={whatsappHref(item.value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary-600 transition-colors hover:text-primary-500"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}