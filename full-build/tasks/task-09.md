---
id: task-09
task: Build Skills page with animated progress bars grouped by category
agent: frontend
status: approved
depends_on: [task-04, task-06]
skills:
  - languages/javascript
  - tooling/eslint
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/skills/page.tsx
    - frontend/src/components/skills/SkillCard.tsx
    - frontend/src/components/skills/AnimatedProgressBar.tsx
    - frontend/src/lib/api/skills.ts
    - frontend/src/lib/api/client.ts
    - frontend/src/hooks/useApi.ts
    - frontend/src/types/skill.ts
acceptance_criteria:
  - Skills page fetches from GET /api/skills and displays skills grouped by category
  - Each category is rendered as a named section/card group
  - Each skill shows its name and an animated progress bar indicating proficiency (0–100)
  - Progress bar fills from 0% to the actual proficiency value when the skill card scrolls into the viewport
  - Loading spinner shown while fetching
  - Error state shown if API fails
  - Responsive grid — 2 columns on tablet, 1 column on mobile, up to 3 columns on large desktop within each category
  - Both light and dark themes render correctly
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Create `frontend/src/lib/api/client.ts`

Base fetch wrapper used by all API modules:

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? "API error");
  }
  return res.json() as Promise<T>;
}
```

### 2. Create `frontend/src/types/skill.ts`

```ts
export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
}

export interface SkillsByCategory {
  category: string;
  skills: Skill[];
}
```

### 3. Create `frontend/src/lib/api/skills.ts`

```ts
import { apiFetch } from "./client";
import type { SkillsByCategory } from "@/types/skill";

export function getSkills(): Promise<SkillsByCategory[]> {
  return apiFetch<SkillsByCategory[]>("/api/skills");
}
```

### 4. Create `frontend/src/hooks/useApi.ts`

Generic hook for client-side data fetching:

```ts
"use client";
import { useState, useEffect } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(fetcher: () => Promise<T>): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    fetcher()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch((err) => { if (!cancelled) setState({ data: null, loading: false, error: err.message }); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
```

### 5. Create `frontend/src/components/skills/AnimatedProgressBar.tsx`

`"use client"` component using Framer Motion `useInView`:

```tsx
"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  proficiency: number; // 0–100
  label?: string;
}

export function AnimatedProgressBar({ proficiency, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span>{label}</span>
          <span style={{ color: "var(--secondary)" }}>{proficiency}%</span>
        </div>
      )}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--border)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: "var(--primary)" }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${proficiency}%` : 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}
```

### 6. Create `frontend/src/components/skills/SkillCard.tsx`

```tsx
import { AnimatedProgressBar } from "./AnimatedProgressBar";
import type { Skill } from "@/types/skill";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div
      className="p-4 rounded-lg border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <AnimatedProgressBar proficiency={skill.proficiency} label={skill.name} />
    </div>
  );
}
```

### 7. Create `frontend/src/app/skills/page.tsx`

```tsx
"use client";
import { useApi } from "@/hooks/useApi";
import { getSkills } from "@/lib/api/skills";
import { SkillCard } from "@/components/skills/SkillCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function SkillsPage() {
  const { data: categories, loading, error } = useApi(getSkills);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load skills: {error}</div>;
  if (!categories?.length) return <div className="text-center py-20">No skills found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">Skills</h1>
      <div className="space-y-12">
        {categories.map((cat) => (
          <section key={cat.category}>
            <h2
              className="text-xl font-semibold mb-4 pb-2 border-b"
              style={{ borderColor: "var(--border)", color: "var(--primary)" }}
            >
              {cat.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
```

### 8. Create `frontend/src/components/ui/LoadingSpinner.tsx`

```tsx
export function LoadingSpinner() {
  return (
    <div
      className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
      style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }}
      aria-label="Loading"
      role="status"
    />
  );
}
```
