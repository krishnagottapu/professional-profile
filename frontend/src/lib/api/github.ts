import { apiFetch } from "./client";
import type { GitHubRepo } from "@/types/github";

export function getGitHubRepos(): Promise<GitHubRepo[]> {
  return apiFetch<GitHubRepo[]>("/api/github/repos");
}
