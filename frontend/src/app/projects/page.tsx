"use client";
import { useState, useMemo } from "react";
import { useApi } from "@/hooks/useApi";
import { getProjects } from "@/lib/api/projects";
import { getGitHubRepos } from "@/lib/api/github";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { TechFilterTabs } from "@/components/projects/TechFilterTabs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function ProjectsPage() {
  const { data: projects, loading: projLoading } = useApi(getProjects);
  const {
    data: repos,
    loading: repoLoading,
    error: repoError,
  } = useApi(getGitHubRepos);
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    (projects ?? []).forEach((p) => p.techTags.forEach((t) => tags.add(t)));
    (repos ?? []).forEach((r) => {
      if (r.language) tags.add(r.language);
      r.topics.forEach((t) => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [projects, repos]);

  const filteredProjects = useMemo(() => {
    if (selectedTag === "All") return projects ?? [];
    return (projects ?? []).filter((p) => p.techTags.includes(selectedTag));
  }, [projects, selectedTag]);

  const filteredRepos = useMemo(() => {
    if (selectedTag === "All") return repos ?? [];
    return (repos ?? []).filter(
      (r) => r.language === selectedTag || r.topics.includes(selectedTag)
    );
  }, [repos, selectedTag]);

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  if (projLoading && repoLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">Projects</h1>
      <p className="text-center mb-10" style={{ color: "var(--secondary)" }}>
        Personal and open-source projects
      </p>

      <TechFilterTabs
        tags={allTags}
        selected={selectedTag}
        onSelect={setSelectedTag}
      />

      <ErrorBoundary>
        {/* Featured projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-12">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--primary)" }}
            >
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProjects.map((p) => (
                <ProjectCard key={p.id} type="manual" project={p} />
              ))}
            </div>
          </section>
        )}

        {/* Regular manual projects */}
        {regularProjects.length > 0 && (
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {regularProjects.map((p) => (
                <ProjectCard key={p.id} type="manual" project={p} />
              ))}
            </div>
          </section>
        )}

        {/* GitHub repos */}
        <section>
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--primary)" }}
          >
            GitHub Repositories
          </h2>
          {repoError ? (
            <p style={{ color: "var(--secondary)" }}>
              GitHub repos temporarily unavailable.
            </p>
          ) : repoLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRepos.map((r) => (
                <ProjectCard key={r.id} type="github" repo={r} />
              ))}
            </div>
          )}
        </section>
      </ErrorBoundary>
    </div>
  );
}
