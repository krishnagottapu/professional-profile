"use client";

import { useState, useEffect, useCallback } from "react";
import { getBlogPosts } from "@/lib/api/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import type { BlogPost, PaginatedResponse } from "@/types/blog";

interface BlogState {
  posts: BlogPost[];
  data: PaginatedResponse<BlogPost> | null;
  loading: boolean;
  error: string | null;
}

function estimateReadTimeMinutes(excerpt: string | null): number {
  if (!excerpt) return 1;
  const words = excerpt.split(/\s+/).length;
  return Math.max(1, Math.ceil((words * 10) / 200));
}

export default function BlogPage() {
  const [page, setPage] = useState(0);
  const [state, setState] = useState<BlogState>({
    posts: [],
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getBlogPosts(page)
      .then((res) => {
        if (!cancelled) {
          setState((prev) => ({
            data: res,
            posts: page === 0 ? res.content : [...prev.posts, ...res.content],
            loading: false,
            error: null,
          }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "Failed to load posts.",
          }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  const loadMore = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setPage((p) => p + 1);
  }, []);

  const hasMore = state.data ? page < state.data.totalPages - 1 : false;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1
        className="text-4xl font-bold mb-12 text-center"
        style={{ color: "var(--foreground)" }}
      >
        Blog
      </h1>

      <ErrorBoundary>
        {state.loading && page === 0 ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : state.error && state.posts.length === 0 ? (
          <p
            className="text-center py-20 text-lg"
            style={{ color: "var(--secondary)" }}
          >
            {state.error}
          </p>
        ) : state.posts.length === 0 ? (
          <p
            className="text-center py-20 text-lg"
            style={{ color: "var(--secondary)" }}
          >
            Coming soon — first post in progress.
          </p>
        ) : (
          <>
            <div className="space-y-6">
              {state.posts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  createdAt={post.createdAt}
                  readTimeMinutes={estimateReadTimeMinutes(post.excerpt)}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={state.loading}
                  className="px-6 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  {state.loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </ErrorBoundary>
    </div>
  );
}
