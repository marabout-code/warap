"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Application, Job } from "@/types";
import { applicationStatusLabels } from "@/lib/status-labels";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<
    (Application & { job?: Job })[]
  >([]);
  const [loading, setLoading] = useState(true);
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

      const { data: apps } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (apps && apps.length > 0) {
        const jobIds = [...new Set(apps.map((a) => a.job_id))];
        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .in("id", jobIds);

        const jobMap: Record<string, Job> = {};
        jobsData?.forEach((job) => {
          jobMap[job.id] = job;
        });

        setApplications(
          apps.map((app) => ({ ...app, job: jobMap[app.job_id] }))
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Candidatures
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Suivez et gérez les candidatures.
        </p>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="card-table w-full">
            <thead>
              <tr>
                <th className="th">Offre</th>
                <th className="th">Candidature</th>
                <th className="th">Statut</th>
                <th className="th">Lettre de motivation</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="td text-center py-14">
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
                applications.map((app) => (
                  <tr key={app.id} className="tr-hover">
                    <td className="td">
                      <p className="font-semibold text-slate-900">
                        {app.job?.title || "Offre inconnue"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {app.job?.company}
                      </p>
                    </td>
                    <td className="td text-sm tabular-nums text-slate-500">
                      {new Date(app.created_at).toLocaleDateString("fr-FR")}
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
                    <td className="td max-w-xs">
                      <p className="truncate text-sm text-slate-600">
                        {app.cover_letter || (
                          <span className="text-slate-400">Pas de lettre de motivation</span>
                        )}
                      </p>
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