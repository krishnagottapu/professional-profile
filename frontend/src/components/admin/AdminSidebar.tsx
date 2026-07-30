"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api/client";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Blog Posts", href: "/admin/blog" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Messages", href: "/admin/messages" },
];

interface Props {
  onLogout: () => void;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}

export function AdminSidebar({ onLogout, sidebarOpen, onCloseSidebar }: Props) {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    apiFetch<{ totalPosts: number; unreadMessages: number; totalProjects: number }>(
      "/api/admin/dashboard/stats"
    )
      .then((s) => setUnread(s.unreadMessages))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col border-r transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          backgroundColor: "var(--nav)",
          borderColor: "var(--border)",
        }}
        aria-label="Admin navigation"
      >
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
            Admin Panel
          </p>
          <p className="text-xs" style={{ color: "var(--secondary)" }}>
            Sai Krishna Gottapu
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseSidebar}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: isActive ? "var(--muted)" : "transparent",
                  color: isActive ? "var(--primary)" : "var(--foreground)",
                }}
              >
                <span>{item.label}</span>
                {item.label === "Messages" && unread > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: "var(--primary)", color: "#fff" }}
                    aria-label={`${unread} unread messages`}
                  >
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={onLogout}
            className="w-full px-3 py-2 rounded-lg text-sm text-left transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
            style={{ color: "#ef4444" }}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
