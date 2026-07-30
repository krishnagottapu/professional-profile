import { apiFetch } from "./client";
import type { Project } from "@/types/project";

export function getProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/api/projects");
}

export interface AdminProjectInput {
  title: string;
  description?: string;
  techTags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  sortOrder: number;
}

export function getAdminProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/api/admin/projects");
}

export function createProject(data: AdminProjectInput): Promise<Project> {
  return apiFetch<Project>("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProject(id: number, data: AdminProjectInput): Promise<Project> {
  return apiFetch<Project>(`/api/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProject(id: number): Promise<void> {
  return apiFetch<void>(`/api/admin/projects/${id}`, { method: "DELETE" });
}

export function reorderProjects(items: { id: number; sortOrder: number }[]): Promise<void> {
  return apiFetch<void>("/api/admin/projects/reorder", {
    method: "PATCH",
    body: JSON.stringify(items),
  });
}
