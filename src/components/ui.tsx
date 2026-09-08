export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow">
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "badge-success",
    closed: "badge-danger",
    draft: "badge-neutral",
    pending: "badge-warning",
    reviewed: "badge-info",
    shortlisted: "badge-accent",
    rejected: "badge-danger",
    accepted: "badge-success",
    todo: "badge-neutral",
    in_progress: "badge-info",
    review: "badge-warning",
    done: "badge-success",
    low: "badge-neutral",
    medium: "badge-info",
    high: "badge-warning",
    urgent: "badge-danger",
  };

  return (
    <span className={styles[status] || "badge-neutral"}>
      <span className="badge-dot" />
      {status.replace("_", " ")}
    </span>
  );
}