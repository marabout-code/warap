"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RealtimeEvent {
  id: string;
  table: string;
  type: string;
  message: string;
  timestamp: string;
}

interface RealtimeUpdatesProps {
  channels?: {
    table: string;
    filter?: string;
    label: string;
  }[];
}

export default function RealtimeUpdates({
  channels = [
    { table: "jobs", label: "Job" },
    { table: "tasks", label: "Task" },
    { table: "applications", label: "Application" },
  ],
}: RealtimeUpdatesProps) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel("realtime-updates");

    channels.forEach(({ table, filter }) => {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          const newEvent: RealtimeEvent = {
            id: `${Date.now()}-${Math.random()}`,
            table,
            type: payload.eventType,
            message: formatMessage(table, payload.eventType, payload.new as any),
            timestamp: new Date().toISOString(),
          };
          setEvents((prev) => [newEvent, ...prev].slice(0, 20));
        }
      );
    });

    channel.subscribe((status) => {
      setIsConnected(status === "SUBSCRIBED");
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channels, supabase]);

  const formatMessage = (table: string, eventType: string, record: any) => {
    const tableLabels: Record<string, string> = {
      jobs: "Job",
      tasks: "Task",
      applications: "Application",
    };
    const label = tableLabels[table] || table;
    const title = record?.title || "";

    switch (eventType) {
      case "INSERT":
        return `${label} "${title}" was created`;
      case "UPDATE":
        return `${label} "${title}" was updated`;
      case "DELETE":
        return `${label} was deleted`;
      default:
        return `${label} changed`;
    }
  };

  const getEventStyles = (type: string) => {
    switch (type) {
      case "INSERT":
        return "border-emerald-200/60 bg-emerald-50/70 text-emerald-500";
      case "UPDATE":
        return "border-sky-200/60 bg-sky-50/70 text-sky-500";
      case "DELETE":
        return "border-rose-200/60 bg-rose-50/70 text-rose-500";
      default:
        return "border-slate-200/60 bg-slate-50 text-slate-400";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "INSERT":
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        );
      case "UPDATE":
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        );
      case "DELETE":
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Live Updates
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${
              isConnected ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
          <span className="text-xs font-medium text-slate-500">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="relative">
              <span className="flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Waiting for real-time updates...
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Changes to jobs, tasks, and applications appear here instantly.
            </p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`animate-fade-in flex items-start gap-3 rounded-xl border p-3.5 ${getEventStyles(event.type)}`}
            >
              <span className="mt-0.5 shrink-0">{getEventIcon(event.type)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">{event.message}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  <span className="capitalize">{event.table}</span>
                </p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-slate-400">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}