"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { tableLabels } from "@/lib/status-labels";

interface Toast {
  id: number;
  table: string;
  type: string;
  message: string;
}

export default function ToastNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("toast-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "jobs" },
        (payload) => {
          const record = payload.new as any;
          addToast("jobs", "INSERT", `Nouvelle offre publiée : ${record.title}`);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "applications" },
        (payload) => {
          addToast("applications", "INSERT", "Nouvelle candidature reçue");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const addToast = (table: string, type: string, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, table, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex w-80 items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{toast.message}</p>
            <p className="mt-0.5 text-xs text-gray-500">{tableLabels[toast.table] || toast.table}</p>
          </div>
          <button
            onClick={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
