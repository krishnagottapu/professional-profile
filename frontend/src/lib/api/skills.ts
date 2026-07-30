import { apiFetch } from "./client";
import type { Skill, SkillsByCategory } from "@/types/skill";

export function getSkills(): Promise<SkillsByCategory[]> {
  return apiFetch<SkillsByCategory[]>("/api/skills");
}

export interface AdminSkillInput {
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
}

export function getAdminSkills(): Promise<Skill[]> {
  return apiFetch<Skill[]>("/api/admin/skills");
}

export function createSkill(data: AdminSkillInput): Promise<Skill> {
  return apiFetch<Skill>("/api/admin/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSkill(id: number, data: AdminSkillInput): Promise<Skill> {
  return apiFetch<Skill>(`/api/admin/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteSkill(id: number): Promise<void> {
  return apiFetch<void>(`/api/admin/skills/${id}`, { method: "DELETE" });
}
