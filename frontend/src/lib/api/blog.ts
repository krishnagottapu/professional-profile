import { apiFetch } from "./client";
import type { BlogPost, BlogPostDetail, PaginatedResponse } from "@/types/blog";

export function getBlogPosts(
  page = 0,
  size = 10
): Promise<PaginatedResponse<BlogPost>> {
  return apiFetch<PaginatedResponse<BlogPost>>(
    `/api/blog?page=${page}&size=${size}`
  );
}

export function getBlogPost(slug: string): Promise<BlogPostDetail> {
  return apiFetch<BlogPostDetail>(`/api/blog/${encodeURIComponent(slug)}`);
}

// Admin CRUD operations

export interface AdminBlogPostInput {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  published: boolean;
}

export function getAdminBlogPosts(): Promise<BlogPostDetail[]> {
  return apiFetch<BlogPostDetail[]>("/api/admin/blog");
}

export function getAdminBlogPost(id: number): Promise<BlogPostDetail> {
  return apiFetch<BlogPostDetail>(`/api/admin/blog/${id}`);
}

export function createBlogPost(data: AdminBlogPostInput): Promise<BlogPostDetail> {
  return apiFetch<BlogPostDetail>("/api/admin/blog", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateBlogPost(id: number, data: AdminBlogPostInput): Promise<BlogPostDetail> {
  return apiFetch<BlogPostDetail>(`/api/admin/blog/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteBlogPost(id: number): Promise<void> {
  return apiFetch<void>(`/api/admin/blog/${id}`, { method: "DELETE" });
}
