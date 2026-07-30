import type {
  SkillsByCategory,
  Project,
  BlogPostPage,
  BlogPostDetail,
  GitHubRepo,
  ContactFormData,
  ContactResponse,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchSkills(): Promise<SkillsByCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/api/skills`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    return (await res.json()) as SkillsByCategory[];
  } catch {
    return [];
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE}/api/projects`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    return (await res.json()) as Project[];
  } catch {
    return [];
  }
}

export async function fetchBlogPosts(page?: number): Promise<BlogPostPage> {
  const emptyPage: BlogPostPage = {
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  };
  try {
    const params = page !== undefined ? `?page=${page}` : "";
    const res = await fetch(`${API_BASE}/api/blog${params}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return emptyPage;
    return (await res.json()) as BlogPostPage;
  } catch {
    return emptyPage;
  }
}

export async function fetchBlogPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/blog/${encodeURIComponent(slug)}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as BlogPostDetail;
  } catch {
    return null;
  }
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(`${API_BASE}/api/github/repos`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    return (await res.json()) as GitHubRepo[];
  } catch {
    return [];
  }
}

export async function submitContact(data: ContactFormData): Promise<ContactResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return (await res.json()) as ContactResponse;
  } catch {
    return null;
  }
}

// Aliases for backward compatibility with existing pages
export const getProjects = fetchProjects;
export const getGitHubRepos = fetchGitHubRepos;
