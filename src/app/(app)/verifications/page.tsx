"use client";

import { Fragment, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Application, Job, Profile } from "@/types";
import { verificationStatusLabels, whatsappHref, verificationChecklist } from "@/lib/status-labels";

type AppRow = Application & {
  job?: Job;
  applicant?: Profile;
};

const tabs = [
  { value: "unverified", label: "À vérifier" },
  { value: "in_review", label: "En cours" },
  { value: "verified", label: "Vérifiées" },
  { value: "rejected", label: "Rejetées" },
  { value: "all", label: "Toutes" },
];

export default function VerificationsPage() {
  const [applications, setApplications] = useState<AppRow[]>([]);
  const [filtered, setFiltered] = useState<AppRow[]>([]);
  const [tab, setTab] = useState<string>("unverified");
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(true);
  const [drafts, setDrafts] = useState<
    Record<string, { notes: string; checklist: Record<string, boolean>; status: string }>
  >({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        setAllowed(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "agent" && profile?.role !== "admin") {
        setLoading(false);
        setAllowed(false);
        return;
      }

      const { data: apps } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      let rows: AppRow[] = apps ?? [];
      if (apps && apps.length > 0) {
        const jobIds = [...new Set(apps.map((a) => a.job_id))];
        const userIds = [...new Set(apps.map((a) => a.user_id))];
        const [{ data: jobsData }, { data: profilesData }] = await Promise.all([
          supabase.from("jobs").select("*").in("id", jobIds),
          supabase.from("profiles").select("*").in("id", userIds),
        ]);
        const jobMap: Record<string, Job> = {};
        jobsData?.forEach((j) => {
          jobMap[j.id] = j;
        });
        const profileMap: Record<string, Profile> = {};
        profilesData?.forEach((p) => {
          profileMap[p.id] = p;
        });
        rows = apps.map((app) => ({
          ...app,
          job: jobMap[app.job_id],
          applicant: profileMap[app.user_id],
        }));
      }

      setApplications(rows);
      const nextDrafts: typeof drafts = {};
      rows.forEach((app) => {
        nextDrafts[app.id] = {
          notes: app.verification_notes ?? "",
          checklist: app.verification_checklist ?? {},
          status: app.verification_status,
        };
      });
      setDrafts(nextDrafts);
      setLoading(false);
    };
    load();
  }, [supabase]);

  useEffect(() => {
    setFiltered(tab === "all" ? applications : applications.filter((a) => a.verification_status === tab));
  }, [tab, applications]);

  const saveDraft = async (appId: string) => {
    setError(null);
    setSaving(appId);
    const draft = drafts[appId];
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload: Partial<Application> = {
      verification_notes: draft.notes.trim() || null,
      verification_checklist: draft.checklist,
      verification_status: draft.status as Application["verification_status"],
    };

    if (draft.status === "unverified") {
      payload.verified_by = null;
      payload.verified_at = null;
    } else if (user?.id) {
      payload.verified_by = user.id;
      payload.verified_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("applications")
      .update(payload)
      .eq("id", appId);

    if (updateError) {
      setError("Impossible d'enregistrer la vérification.");
    } else {
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, ...payload } : app
        )
      );
    }
    setSaving(null);
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

  if (!allowed) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient-soft">
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="mt-4 text-lg font-bold text-slate-900">
            Espace réservé aux agents
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Seuls les agents vérificateurs et les administrateurs peuvent mener
            des vérifications.
          </p>
          <Link href="/dashboard" className="btn-primary mt-5">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Vérifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Contrôlez les pièces, menez l&apos;entretien et partagez votre rapport
            avec le client.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          Mode vérificateur actif
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              tab === t.value
                ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-50"
            }`}
          >
            {t.label}
            <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              tab === t.value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              {t.value === "all"
                ? applications.length
                : applications.filter((a) => a.verification_status === t.value).length}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient-soft">
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-bold text-slate-900">
            Rien à afficher ici
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            {tab === "unverified"
              ? "Les nouvelles réponses à vérifier apparaîtront ici."
              : "Aucune réponse dans cette catégorie."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filtered.map((app) => {
            const draft = drafts[app.id];
            if (!draft) return null;
            return (
              <div key={app.id} className="card flex flex-col">
                {/* Candidate */}
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-bold text-white">
                    {getInitials(app.applicant?.full_name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-900">
                        {app.applicant?.full_name || "Candidat inconnu"}
                      </p>
                      <span className={`badge ${
                        app.verification_status === "verified" ? "badge-success"
                        : app.verification_status === "in_review" ? "badge-warning"
                        : app.verification_status === "rejected" ? "badge-danger"
                        : "badge-neutral"
                      }`}>
                        <span className="badge-dot" />
                        {verificationStatusLabels[app.verification_status] || app.verification_status}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {app.job?.title || "Annonce inconnue"} · {app.job?.location}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Postulée le{" "}
                      {new Date(app.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Contact + pièces */}
                <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-slate-50/60 p-3.5 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact</p>
                    <a
                      href={whatsappHref((app.contact_phone || app.applicant?.phone) || "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      {app.contact_phone || app.applicant?.phone || "Non spécifié"}
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pièces du dossier</p>
                    {app.documents && app.documents.length > 0 ? (
                      <ul className="mt-1 flex flex-wrap gap-1.5">
                        {app.documents.map((doc, i) => (
                          <li key={i}>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="doc-pill transition-colors hover:bg-primary-100"
                            >
                              {doc.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-slate-400">Aucune pièce fournie</p>
                    )}
                  </div>
                </div>

                {/* Checklist */}
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Rapport de vérification
                  </p>
                  <div className="mt-3 space-y-2">
                    {verificationChecklist.map((item) => (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={!!draft.checklist[item.id]}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [app.id]: {
                                ...prev[app.id],
                                checklist: {
                                  ...prev[app.id].checklist,
                                  [item.id]: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-primary-600"
                        />
                        <span className="text-sm text-slate-600">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <textarea
                    value={draft.notes}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [app.id]: { ...prev[app.id], notes: e.target.value },
                      }))
                    }
                    rows={3}
                    placeholder="Notes de vérification partagées avec le client…"
                    className="input-field mt-3 resize-y"
                  />
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [app.id]: { ...prev[app.id], status: e.target.value },
                      }))
                    }
                    className="input-field w-full py-1.5 text-xs sm:w-44"
                  >
                    <option value="unverified">Non vérifiée</option>
                    <option value="in_review">En vérification</option>
                    <option value="verified">Vérifiée</option>
                    <option value="rejected">Rejetée</option>
                  </select>
                  <button
                    onClick={() => saveDraft(app.id)}
                    disabled={saving === app.id}
                    className="btn-primary !py-2"
                  >
                    {saving === app.id ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Enregistrement…
                      </>
                    ) : (
                      "Enregistrer le rapport"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}