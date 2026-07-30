"use client";

import { useApi } from "@/hooks/useApi";
import { apiFetch } from "@/lib/api/client";

interface Stats {
  totalPosts: number;
  unreadMessages: number;
  totalProjects: number;
}

const STAT_CARDS: { key: keyof Stats; label: string }[] = [
  { key: "totalPosts", label: "Total Posts" },
  { key: "totalProjects", label: "Total Projects" },
  { key: "unreadMessages", label: "Unread Messages" },
];

export default function AdminDashboardPage() {
  const { data: stats, loading } = useApi<Stats>(() =>
    apiFetch("/api/admin/dashboard/stats")
  );

  return (
    <div>
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--foreground)" }}
      >
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STAT_CARDS.map(({ key, label }) => (
          <div
            key={key}
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <p className="text-sm mb-2" style={{ color: "var(--secondary)" }}>
              {label}
            </p>
            <p
              className="text-4xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              {loading ? "—" : (stats?.[key] ?? 0)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
