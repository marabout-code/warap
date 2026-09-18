"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateUserRole,
  updateUserStatus,
  type UserRow,
} from "@/lib/actions/users";
import { accountStatusLabels, userRoleLabels } from "@/lib/status-labels";

type Feedback = { type: "error" | "success"; text: string } | null;

function RowActions({ profile, currentUserId }: { profile: UserRow; currentUserId: string }) {
  const [role, setRole] = useState<UserRow["role"]>(profile.role);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isSelf = profile.id === currentUserId;

  const saveRole = async () => {
    if (role === profile.role) return;
    const formData = new FormData();
    formData.set("userId", profile.id);
    formData.set("role", role);
    const result = await updateUserRole(null, formData);
    if (result && "error" in result) {
      setFeedback({ type: "error", text: result.error });
      setRole(profile.role);
      return;
    }
    setFeedback({ type: "success", text: "Rôle mis à jour." });
    startTransition(() => router.refresh());
  };

  const toggleStatus = async () => {
    const next = profile.account_status === "active" ? "disabled" : "active";
    const formData = new FormData();
    formData.set("userId", profile.id);
    formData.set("status", next);
    const result = await updateUserStatus(null, formData);
    if (result && "error" in result) {
      setFeedback({ type: "error", text: result.error });
      return;
    }
    setFeedback({
      type: "success",
      text: next === "active" ? "Compte réactivé." : "Compte désactivé.",
    });
    startTransition(() => router.refresh());
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRow["role"])}
          disabled={isSelf}
          className="select-field py-2 text-xs"
          title={isSelf ? "Vous ne pouvez pas modifier votre propre rôle" : "Rôle du compte"}
        >
          {Object.entries(userRoleLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {role !== profile.role && (
          <button
            type="button"
            onClick={saveRole}
            disabled={isPending}
            className="btn-primary px-3 py-2 text-xs"
          >
            {isPending ? "…" : "Enregistrer"}
          </button>
        )}
      </div>

      {!isSelf && (
        <button
          type="button"
          onClick={toggleStatus}
          disabled={isPending}
          className={
            profile.account_status === "active"
              ? "btn-danger px-3 py-2 text-xs"
              : "btn-secondary px-3 py-2 text-xs"
          }
        >
          {profile.account_status === "active" ? "Désactiver" : "Réactiver"}
        </button>
      )}

      {feedback && (
        <span
          className={`ml-1 text-xs font-medium ${
            feedback.type === "error" ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {feedback.text}
        </span>
      )}
    </div>
  );
}

export default function UsersManager({
  profiles,
  currentUserId,
}: {
  profiles: UserRow[];
  currentUserId: string;
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const stats = useMemo(() => {
    const total = profiles.length;
    const active = profiles.filter((p) => p.account_status === "active").length;
    const disabled = total - active;
    const admins = profiles.filter((p) => p.role === "admin").length;
    return { total, active, disabled, admins };
  }, [profiles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchesQuery =
        !q ||
        p.full_name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.location ?? "").toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || p.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [profiles, query, roleFilter]);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Utilisateurs", value: stats.total, tone: "text-slate-900" },
          { label: "Comptes actifs", value: stats.active, tone: "text-emerald-600" },
          { label: "Comptes désactivés", value: stats.disabled, tone: "text-rose-600" },
          { label: "Administrateurs", value: stats.admins, tone: "text-primary-600" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className={`text-2xl font-bold tracking-tight ${stat.tone}`}>{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field pl-9"
            placeholder="Rechercher par nom, e-mail ou ville…"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="select-field sm:w-56"
        >
          <option value="all">Tous les rôles</option>
          {Object.entries(userRoleLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card-table overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="border-b border-slate-200/70 bg-slate-50/60">
            <tr>
              <th className="th">Utilisateur</th>
              <th className="th">Rôle</th>
              <th className="th">Statut</th>
              <th className="th">Localisation</th>
              <th className="th">Inscrit le</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="td px-6 py-10 text-center text-slate-400">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
            {filtered.map((profile) => (
              <tr key={profile.id} className="transition-colors hover:bg-slate-50/60">
                <td className="td whitespace-normal">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-white">
                      {profile.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {profile.full_name}
                        {profile.id === currentUserId && (
                          <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                            Vous
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-slate-400">{profile.email}</p>
                      {profile.phone && (
                        <p className="truncate text-xs text-slate-400">{profile.phone}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="td">
                  <span className="badge-neutral">{userRoleLabels[profile.role]}</span>
                </td>
                <td className="td">
                  {profile.account_status === "active" ? (
                    <span className="badge-success">
                      <span className="badge-dot" />
                      {accountStatusLabels[profile.account_status]}
                    </span>
                  ) : (
                    <span className="badge-danger">
                      <span className="badge-dot" />
                      {accountStatusLabels[profile.account_status]}
                    </span>
                  )}
                </td>
                <td className="td">{profile.location || "—"}</td>
                <td className="td">
                  {new Date(profile.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="td">
                  <RowActions profile={profile} currentUserId={currentUserId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}