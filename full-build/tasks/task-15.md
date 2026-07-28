---
id: task-15
task: Build admin login page, auth guard, and admin dashboard layout with sidebar
agent: frontend
status: approved
depends_on: [task-07]
skills:
  - languages/javascript
  - tooling/eslint
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/admin/login/page.tsx
    - frontend/src/app/admin/layout.tsx
    - frontend/src/app/admin/page.tsx
    - frontend/src/components/admin/AdminSidebar.tsx
    - frontend/src/components/admin/AdminHeader.tsx
    - frontend/src/hooks/useAuth.ts
    - frontend/src/lib/api/auth.ts
acceptance_criteria:
  - Login page at /admin/login has username and password fields with submit button
  - Login calls POST /api/auth/login; on success redirects to /admin
  - Login shows error message on 401 response
  - Admin layout checks GET /api/auth/me on mount; redirects to /admin/login if 401
  - Admin layout renders a sidebar and main content area (sidebar + content side-by-side on desktop)
  - Sidebar has links: Dashboard, Blog Posts, Projects, Skills, Messages
  - Sidebar shows an unread badge on Messages link (count from GET /api/admin/dashboard/stats)
  - Dashboard page at /admin shows stats cards: Total Posts, Unread Messages, Total Projects
  - Logout button in sidebar/header invalidates session and redirects to /admin/login
  - Admin routes are excluded from the public PageShell (no public navbar/footer in admin area)
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Create `frontend/src/lib/api/auth.ts`

```ts
import { apiFetch } from "./client";

export function login(username: string, password: string) {
  return apiFetch<{ username: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return apiFetch<{ message: string }>("/api/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiFetch<{ username: string }>("/api/auth/me");
}
```

### 2. Create `frontend/src/hooks/useAuth.ts`

```ts
"use client";
import { useState, useEffect } from "react";
import { getMe, logout as apiLogout } from "@/lib/api/auth";

interface AuthState {
  user: { username: string } | null;
  loading: boolean;
}

export function useAuth(): AuthState & { logout: () => Promise<void> } {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    getMe()
      .then((user) => setState({ user, loading: false }))
      .catch(() => setState({ user: null, loading: false }));
  }, []);

  const logout = async () => {
    await apiLogout().catch(() => {});
    setState({ user: null, loading: false });
  };

  return { ...state, logout };
}
```

### 3. Update root `frontend/src/app/layout.tsx`

The root layout wraps public pages with `PageShell`. Admin pages must NOT render the public Navbar/Footer. Handle this by:

- Option A (Recommended): In `PageShell`, check the current path. If it starts with `/admin`, render children only. Use `usePathname` inside a client component wrapper.
- The simplest approach: `admin/layout.tsx` is a SEPARATE nested layout that does NOT use PageShell. Since Next.js App Router allows nested layouts, the admin layout replaces the public layout for all `/admin/*` routes.

However, the root `layout.tsx` still wraps everything including admin. To prevent the public Navbar from showing in admin, create a `ConditionalPageShell` client component:

```tsx
// components/layout/ConditionalPageShell.tsx
"use client";
import { usePathname } from "next/navigation";
import { PageShell } from "./PageShell";

export function ConditionalPageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return <PageShell>{children}</PageShell>;
}
```

Update `layout.tsx` to use `ConditionalPageShell` instead of `PageShell` directly.

### 4. Create `frontend/src/app/admin/layout.tsx`

This is the admin shell — sidebar + main. Since the root layout conditionally skips PageShell for `/admin`, this layout provides the admin-specific UI:

```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>;
  }

  if (!user) return null; // briefly shown before redirect

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <AdminSidebar onLogout={logout} />
      <div className="flex-1 flex flex-col">
        <AdminHeader username={user.username} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

Note: `/admin/login` must NOT be wrapped by this auth-checking layout. Since it's a child of `admin/layout.tsx`, add a check: if `pathname === "/admin/login"`, render only `{children}` without the sidebar.

```tsx
// In AdminLayout, above the sidebar render:
const pathname = usePathname();
if (pathname === "/admin/login") return <>{children}</>;
```

### 5. Create `frontend/src/components/admin/AdminSidebar.tsx`

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api/client";
import type { DashboardStatsDto } from "@/types/admin";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Blog Posts", href: "/admin/blog" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Messages", href: "/admin/messages" },
];

interface Props { onLogout: () => void; }

export function AdminSidebar({ onLogout }: Props) {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    apiFetch<{ totalPosts: number; unreadMessages: number; totalProjects: number }>
      ("/api/admin/dashboard/stats")
      .then(s => setUnread(s.unreadMessages))
      .catch(() => {});
  }, []);

  return (
    <aside className="w-60 flex flex-col border-r"
           style={{ backgroundColor: "var(--nav)", borderColor: "var(--border)" }}>
      <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="font-bold text-sm">Admin Panel</p>
        <p className="text-xs" style={{ color: "var(--secondary)" }}>Sai Krishna Gottapu</p>
      </div>

      <nav className="flex-1 p-3 space-y-1" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: pathname === item.href ? "var(--muted)" : "transparent",
                  color: pathname === item.href ? "var(--primary)" : "var(--foreground)",
                }}>
            <span>{item.label}</span>
            {item.label === "Messages" && unread > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
                {unread}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button onClick={onLogout}
                className="w-full px-3 py-2 rounded-lg text-sm text-left transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                style={{ color: "#ef4444" }}>
          Logout
        </button>
      </div>
    </aside>
  );
}
```

### 6. Create `frontend/src/app/admin/login/page.tsx`

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";

export default function AdminLoginPage() {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(creds.username, creds.password);
      router.push("/admin");
    } catch {
      setError("Invalid username or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ backgroundColor: "var(--background)" }}>
      <div className="w-full max-w-sm p-8 rounded-xl border"
           style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" type="text" placeholder="Username" autoComplete="username"
                 value={creds.username} onChange={e => setCreds(p => ({ ...p, username: e.target.value }))}
                 className="w-full px-4 py-2 rounded-lg border"
                 style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          <input name="password" type="password" placeholder="Password" autoComplete="current-password"
                 value={creds.password} onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
                 className="w-full px-4 py-2 rounded-lg border"
                 style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={submitting}
                  className="w-full py-2 rounded-lg font-semibold disabled:opacity-60"
                  style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 7. Create `frontend/src/app/admin/page.tsx` (Dashboard)

```tsx
"use client";
import { useApi } from "@/hooks/useApi";
import { apiFetch } from "@/lib/api/client";

interface Stats { totalPosts: number; unreadMessages: number; totalProjects: number; }

const STAT_CARDS = [
  { key: "totalPosts" as const, label: "Total Posts" },
  { key: "totalProjects" as const, label: "Total Projects" },
  { key: "unreadMessages" as const, label: "Unread Messages" },
];

export default function AdminDashboardPage() {
  const { data: stats, loading } = useApi<Stats>(() =>
    apiFetch("/api/admin/dashboard/stats")
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STAT_CARDS.map(({ key, label }) => (
          <div key={key} className="p-6 rounded-xl border"
               style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <p className="text-sm mb-2" style={{ color: "var(--secondary)" }}>{label}</p>
            <p className="text-4xl font-bold" style={{ color: "var(--primary)" }}>
              {loading ? "—" : stats?.[key] ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Security Notes

- Login form must use `type="password"` for the password input (prevents browser autocomplete exposure)
- `autoComplete="current-password"` helps password managers; do NOT use `autoComplete="off"` on password fields
- The admin layout checks auth on every route by calling `/api/auth/me`; this prevents direct URL access
- Do NOT store auth state in localStorage — rely solely on the HttpOnly session cookie
