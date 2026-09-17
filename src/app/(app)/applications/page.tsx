"use client";

import { Fragment, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Application, Job, Profile } from "@/types";
import {
  applicationStatusLabels,
  verificationStatusLabels,
} from "@/lib/status-labels";

type AppRow = Application & {
  job?: Job;
  applicant?: Profile;
  verifier?: Profile;
};

const verificationOptions = [
  { value: "unverified", label: "Non vérifiée" },
  { value: "in_review", label: "En vérification" },
  { value: "verified", label: "Vérifiée" },
  { value: "rejected", label: "Rejetée" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [canVerify, setCanVerify] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchApplications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }
      setCurrentUserId(user.id);

      const roleRes = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setCanVerify(
        roleRes.data?.role === "agent" || roleRes.data?.role === "admin"
      );

      const { data: apps } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (apps && apps.length > 0) {
        const jobIds = [...new Set(apps.map((a) => a.job_id))];
        const userIds = [...new Set(apps.map((a) => a.user_id))];
        const verifierIds = [
          ...new Set(
            apps.map((a) => a.verified_by).filter((id): id is string => !!id)
          ),
        ];

        const [{ data: jobsData }, { data: profilesData }] = await Promise.all([
          supabase.from("jobs").select("*").in("id", jobIds),
          supabase.from("profiles").select("*").in("id", userIds),
        ]);

        let verifiersData: Profile[] | null = [];
        if (verifierIds.length > 0) {
          const res = await supabase
            .from("profiles")
            .select("*")
            .in("id", verifierIds);
          verifiersData = res.data;
        }

        const jobMap: Record<string, Job> = {};
        jobsData?.forEach((job) => {
          jobMap[job.id] = job;
        });

        const profileMap: Record<string, Profile> = {};
        profilesData?.forEach((p) => {
          profileMap[p.id] = p;
        });
        verifiersData?.forEach((p) => {
          profileMap[p.id] = p;
        });

        setApplications(
          apps.map((app) => ({
            ...app,
            job: jobMap[app.job_id],
            applicant: profileMap[app.user_id],
            verifier: app.verified_by ? profileMap[app.verified_by] : undefined,
          }))
        );
      } else {
        setApplications(apps || []);
      }
      setLoading(false);
    };

    fetchApplications();
  }, [supabase]);

  const updateStatus = async (appId: string, newStatus: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", appId);

    if (!error) {
      setApplications(
        applications.map((app) =>
          app.id === appId
            ? { ...app, status: newStatus as Application["status"] }
            : app
        )
      );
    }
  };

  const updateVerification = async (appId: string, newStatus: string) => {
    const payload: Partial<Application> = {
      verification_status:
        newStatus as Application["verification_status"],
    };
    if (newStatus === "unverified") {
      payload.verified_by = null;
      payload.verified_at = null;
    } else if (currentUserId) {
      payload.verified_by = currentUserId;
      payload.verified_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("applications")
      .update(payload)
      .eq("id", appId)
      .select();

    if (!error) {
      const rows = data as AppRow[] | null;
      if (rows?.[0]) {
        const updated = rows[0];
        setApplications(
          applications.map((app) =>
            app.id === appId
              ? {
                  ...app,
                  verification_status: updated.verification_status,
                  verified_by: updated.verified_by,
                  verified_at: updated.verified_at,
                }
              : app
          )
        );
      } else {
        setApplications(
          applications.map((app) =>
            app.id === appId ? { ...app, ...payload } : app
          )
        );
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "badge-warning",
      reviewed: "badge-info",
      shortlisted: "badge-accent",
      rejected: "badge-danger",
      accepted: "badge-success",
    };
    return (
      <span className={`badge ${styles[status] || "badge-neutral"}`}>
        <span className="badge-dot" />
        {applicationStatusLabels[status] || status}
      </span>
    );
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

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Candidatures
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Suivez, examinez et vérifiez les candidatures.
          </p>
        </div>
        {canVerify && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
            Mode vérificateur actif
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="card-table w-full">
            <thead>
              <tr>
                <th className="th">Candidat</th>
                <th className="th">Offre</th>
                <th className="th">Statut</th>
                <th className="th">Vérification</th>
                <th className="th text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="td text-center py-14">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-glow">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-700">
                        Aucune candidature pour le moment
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Les candidatures apparaîtront ici dès que les candidats commenceront à postuler.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const isExpanded = expandedId === app.id;
                  return (
                    <Fragment key={app.id}>
                      <tr className="tr-hover">
                        <td className="td">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white">
                              {getInitials(app.applicant?.full_name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {app.applicant?.full_name || "Candidat inconnu"}
                              </p>
                              <p className="truncate text-xs text-slate-500">
                                {app.contact_phone || app.applicant?.phone || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="td">
                          <p className="max-w-[14rem] truncate font-semibold text-slate-900">
                            {app.job?.title || "Offre inconnue"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {app.job?.company}
                          </p>
                        </td>
                        <td className="td">
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app.id, e.target.value)}
                            className="input-field w-36 py-1.5 text-xs"
                          >
                            <option value="pending">En attente</option>
                            <option value="reviewed">Examinée</option>
                            <option value="shortlisted">Présélectionnée</option>
                            <option value="rejected">Rejetée</option>
                            <option value="accepted">Acceptée</option>
                          </select>
                        </td>
                        <td className="td">
                          {canVerify ? (
                            <select
                              value={app.verification_status}
                              onChange={(e) =>
                                updateVerification(app.id, e.target.value)
                              }
                              className="input-field w-40 py-1.5 text-xs"
                            >
                              {verificationOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            getVerificationBadge(app.verification_status)
                          )}
                        </td>
                        <td className="td text-right">
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : app.id)
                            }
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-500"
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? "Réduire" : "Détails"}
                            <svg
                              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="bg-slate-50/60 p-0">
                            <div className="animate-fade-in grid grid-cols-1 gap-5 border-t border-slate-100 px-6 py-5 md:grid-cols-3">
                              <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Candidature
                                </p>
                                <div className="space-y-1.5 text-sm text-slate-600">
                                  <p>
                                    Postulée le{" "}
                                    <span className="font-semibold text-slate-900">
                                      {new Date(app.created_at).toLocaleDateString("fr-FR", {
                                        year: "numeric", month: "long", day: "numeric",
                                      })}
                                    </span>
                                  </p>
                                  <p>
                                    Contact :{" "}
                                    <span className="font-semibold text-slate-900">
                                      {app.contact_phone || "—"}
                                    </span>
                                  </p>
                                  {app.resume_url && (
                                    <a
                                      href={app.resume_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                                    >
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                      </svg>
                                      Voir le CV
                                    </a>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Documents fournis
                                </p>
                                {app.documents && app.documents.length > 0 ? (
                                  <ul className="space-y-1.5">
                                    {app.documents.map((doc, i) => (
                                      <li key={i}>
                                        <a
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="group flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-primary-600"
                                        >
                                          <svg className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                          </svg>
                                          <span className="truncate">{doc.name}</span>
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-slate-400">
                                    Aucun document fourni
                                  </p>
                                )}
                              </div>

                              <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Vérification
                                </p>
                                <div>{getVerificationBadge(app.verification_status)}</div>
                                {app.verified_by && (
                                  <p className="text-sm text-slate-600">
                                    Vérifiée par{" "}
                                    <span className="font-semibold text-slate-900">
                                      {app.verifier?.full_name || "Agent"}
                                    </span>
                                    {app.verified_at && (
                                      <span className="text-slate-400">
                                        {" "}
                                        le {new Date(app.verified_at).toLocaleDateString("fr-FR")}
                                      </span>
                                    )}
                                  </p>
                                )}
                                {app.verification_notes ? (
                                  <p className="rounded-xl border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-600">
                                    {app.verification_notes}
                                  </p>
                                ) : (
                                  <p className="text-sm text-slate-400">
                                    Aucune note de vérification.
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}