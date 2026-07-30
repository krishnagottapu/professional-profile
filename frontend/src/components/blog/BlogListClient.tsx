"use client";

import { useState, useCallback } from "react";
import { BlogCard } from "./BlogCard";
import { Pagination } from "./Pagination";
import type { BlogPost } from "@/types/blog";

interface BlogListClientProps {
  initialPosts: BlogPost[];
  initialTotalPages: number;
  initialPage: number;
}

function estimateReadTime(excerpt: string | null): number {
  if (!excerpt) return 1;
  const words = excerpt.split(/\s+/).length;
  // Rough estimate: excerpt is ~10% of full content
  return Math.max(1, Math.ceil((words * 10) / 200));
}

export function BlogListClient({
  initialPosts,
  initialTotalPages,
  initialPage,
}: BlogListClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/blog?page=${page}&size=10`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch {
      // Keep existing state on error
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = (page: number) => {
    fetchPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-20">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
            role="status"
            aria-label="Loading blog posts"
          />
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                createdAt={post.createdAt}
                readTimeMinutes={estimateReadTime(post.excerpt)}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
