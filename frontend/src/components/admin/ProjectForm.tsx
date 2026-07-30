"use client";

import { useState } from "react";
import type { Project } from "@/types/project";
import type { AdminProjectInput } from "@/lib/api/projects";

interface Props {
  project?: Project | null;
  onSave: (data: AdminProjectInput) => void;
  onClose: () => void;
}

function buildInitialForm(project?: Project | null): AdminProjectInput {
  if (project) {
    return {
      title: project.title,
      description: project.description ?? "",
      techTags: project.techTags,
      githubUrl: project.githubUrl ?? "",
      liveUrl: project.liveUrl ?? "",
      featured: project.featured,
      sortOrder: project.sortOrder,
    };
  }
  return {
    title: "",
    description: "",
    techTags: [],
    githubUrl: "",
    liveUrl: "",
    featured: false,
    sortOrder: 0,
  };
}

export function ProjectForm({ project, onSave, onClose }: Props) {
  const [form, setForm] = useState<AdminProjectInput>(() =>
    buildInitialForm(project)
  );
  const [tagInput, setTagInput] = useState(() =>
    project ? project.techTags.join(", ") : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      techTags: tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="w-full max-w-md h-full overflow-y-auto p-6"
        style={{
          backgroundColor: "var(--card)",
          borderLeft: "1px solid var(--border)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">
            {project ? "Edit Project" : "New Project"}
          </h2>
          <button onClick={onClose} aria-label="Close panel">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="project-title" className="block text-sm mb-1">
              Title *
            </label>
            <input
              id="project-title"
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div>
            <label htmlFor="project-description" className="block text-sm mb-1">
              Description
            </label>
            <textarea
              id="project-description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full px-3 py-2 rounded border resize-none"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div>
            <label htmlFor="project-tags" className="block text-sm mb-1">
              Tech Tags (comma separated)
            </label>
            <input
              id="project-tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Java, Spring Boot, Docker"
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div>
            <label htmlFor="project-github" className="block text-sm mb-1">
              GitHub URL
            </label>
            <input
              id="project-github"
              type="url"
              value={form.githubUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, githubUrl: e.target.value }))
              }
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div>
            <label htmlFor="project-live" className="block text-sm mb-1">
              Live URL
            </label>
            <input
              id="project-live"
              type="url"
              value={form.liveUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, liveUrl: e.target.value }))
              }
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm((p) => ({ ...p, featured: e.target.checked }))
              }
            />
            Featured project
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg text-sm"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm border"
              style={{ borderColor: "var(--border)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
