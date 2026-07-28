---
id: task-12
task: Build Projects page with GitHub integration, manual projects grid, and tech filter tabs
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
    - frontend/src/app/projects/page.tsx
    - frontend/src/components/projects/ProjectCard.tsx
    - frontend/src/components/projects/TechFilterTabs.tsx
    - frontend/src/lib/api/projects.ts
    - frontend/src/lib/api/github.ts
    - frontend/src/types/project.ts
    - frontend/src/types/github.ts
acceptance_criteria:
  - Projects page fetches from both GET /api/projects and GET /api/github/repos
  - Featured manual projects appear at the top of the grid
  - GitHub repos are merged with manual projects below featured section
  - Tech filter tabs dynamically extract unique tech tags from all displayed projects and repos
  - Selecting a tech filter tab shows only matching projects and repos
  - "All" tab (default) shows everything
  - Each project card shows title, description, tech tags, and links (GitHub/Live) if available
  - GitHub cards show star count and language
  - Scroll-triggered fade-in animation per card (Framer Motion)
  - Graceful fallback if GitHub API fails — GitHub section shows "GitHub repos unavailable" message; manual projects still display
  - Loading state shown for both data sources
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Create `frontend/src/types/project.ts`

```ts
export interface Project {
  id: number;
  title: string;
  description: string;
  techTags: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  sortOrder: number;
}
```

### 2. Create `frontend/src/types/github.ts`

```ts
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  topics: string[];
}
```

### 3. Create `frontend/src/lib/api/projects.ts`

```ts
import { apiFetch } from "./client";
import type { Project } from "@/types/project";

export function getProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/api/projects");
}
```

### 4. Create `frontend/src/lib/api/github.ts`

```ts
import { apiFetch } from "./client";
import type { GitHubRepo } from "@/types/github";

export function getGitHubRepos(): Promise<GitHubRepo[]> {
  return apiFetch<GitHubRepo[]>("/api/github/repos");
}
```

### 5. Create `frontend/src/components/projects/ProjectCard.tsx`

Handles both manual projects and GitHub repos with a discriminated union or union props:

```tsx
"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Project } from "@/types/project";
import type { GitHubRepo } from "@/types/github";

type ProjectCardProps =
  | { type: "manual"; project: Project }
  | { type: "github"; repo: GitHubRepo };

export function ProjectCard(props: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const title = props.type === "manual" ? props.project.title : props.repo.name;
  const description = props.type === "manual"
    ? props.project.description
    : (props.repo.description ?? "No description available.");
  const tags = props.type === "manual"
    ? props.project.techTags
    : [props.repo.language, ...props.repo.topics].filter(Boolean) as string[];
  const githubUrl = props.type === "manual" ? props.project.githubUrl : props.repo.htmlUrl;
  const liveUrl = props.type === "manual" ? props.project.liveUrl : null;
  const stars = props.type === "github" ? props.repo.stargazersCount : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-5 rounded-xl border flex flex-col gap-3 h-full"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-lg">{title}</h3>
        {props.type === "manual" && props.project.featured && (
          <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
            Featured
          </span>
        )}
      </div>

      <p className="text-sm flex-1" style={{ color: "var(--secondary)" }}>{description}</p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1">
        {tags.slice(0, 6).map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Links + stats */}
      <div className="flex items-center gap-3 text-sm mt-auto">
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer"
             style={{ color: "var(--primary)" }}>
            GitHub ↗
          </a>
        )}
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noopener noreferrer"
             style={{ color: "var(--primary)" }}>
            Live ↗
          </a>
        )}
        {stars !== null && (
          <span className="ml-auto" style={{ color: "var(--secondary)" }}>★ {stars}</span>
        )}
      </div>
    </motion.div>
  );
}
```

### 6. Create `frontend/src/components/projects/TechFilterTabs.tsx`

```tsx
"use client";

interface Props {
  tags: string[];
  selected: string;
  onSelect: (tag: string) => void;
}

export function TechFilterTabs({ tags, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {["All", ...tags].map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          style={{
            backgroundColor: selected === tag ? "var(--primary)" : "var(--muted)",
            color: selected === tag ? "#fff" : "var(--secondary)",
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
```

### 7. Create `frontend/src/app/projects/page.tsx`

```tsx
"use client";
import { useState, useMemo } from "react";
import { useApi } from "@/hooks/useApi";
import { getProjects } from "@/lib/api/projects";
import { getGitHubRepos } from "@/lib/api/github";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { TechFilterTabs } from "@/components/projects/TechFilterTabs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProjectsPage() {
  const { data: projects, loading: projLoading } = useApi(getProjects);
  const { data: repos, loading: repoLoading, error: repoError } = useApi(getGitHubRepos);
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    (projects ?? []).forEach(p => p.techTags.forEach(t => tags.add(t)));
    (repos ?? []).forEach(r => {
      if (r.language) tags.add(r.language);
      r.topics.forEach(t => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [projects, repos]);

  const filteredProjects = useMemo(() => {
    if (selectedTag === "All") return projects ?? [];
    return (projects ?? []).filter(p => p.techTags.includes(selectedTag));
  }, [projects, selectedTag]);

  const filteredRepos = useMemo(() => {
    if (selectedTag === "All") return repos ?? [];
    return (repos ?? []).filter(r =>
      r.language === selectedTag || r.topics.includes(selectedTag)
    );
  }, [repos, selectedTag]);

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  if (projLoading && repoLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">Projects</h1>
      <p className="text-center mb-10" style={{ color: "var(--secondary)" }}>
        Personal and open-source projects
      </p>

      <TechFilterTabs tags={allTags} selected={selectedTag} onSelect={setSelectedTag} />

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--primary)" }}>Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProjects.map(p => <ProjectCard key={p.id} type="manual" project={p} />)}
          </div>
        </section>
      )}

      {/* Regular manual projects */}
      {regularProjects.length > 0 && (
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regularProjects.map(p => <ProjectCard key={p.id} type="manual" project={p} />)}
          </div>
        </section>
      )}

      {/* GitHub repos */}
      <section>
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--primary)" }}>
          GitHub Repositories
        </h2>
        {repoError ? (
          <p style={{ color: "var(--secondary)" }}>GitHub repos temporarily unavailable.</p>
        ) : repoLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRepos.map(r => <ProjectCard key={r.id} type="github" repo={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}
```
