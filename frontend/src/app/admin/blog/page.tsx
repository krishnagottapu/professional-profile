"use client";

import { useState } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { getAdminBlogPosts, deleteBlogPost } from "@/lib/api/blog";
import { formatDate } from "@/lib/utils/formatDate";

export default function AdminBlogListPage() {
  const { data: posts, loading, error, refetch } = useApi(getAdminBlogPosts);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteBlogPost(id);
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
    setDeletingId(null);
    setConfirmId(null);
    refetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          + New Post
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        {(posts ?? []).map((post) => (
          <div
            key={post.id}
            className="flex items-center gap-4 p-4 rounded-lg border"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{post.title}</p>
              <p
                className="text-xs"
                style={{ color: "var(--secondary)" }}
              >
                {formatDate(post.createdAt)}
              </p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{
                backgroundColor: post.published ? "#16a34a22" : "var(--muted)",
                color: post.published ? "#16a34a" : "var(--secondary)",
              }}
            >
              {post.published ? "Published" : "Draft"}
            </span>
            <Link
              href={`/admin/blog/${post.id}`}
              className="text-sm px-3 py-1 rounded border whitespace-nowrap"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Edit
            </Link>
            <button
              onClick={() => setConfirmId(post.id)}
              className="text-sm px-3 py-1 rounded border whitespace-nowrap"
              style={{ borderColor: "#ef4444", color: "#ef4444" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Confirm delete modal */}
      {confirmId && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="p-6 rounded-xl max-w-sm w-full"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <h2 id="delete-dialog-title" className="font-bold mb-2">
              Delete Post?
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--secondary)" }}
            >
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#ef4444", color: "#fff" }}
              >
                {deletingId === confirmId ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2 rounded-lg text-sm border"
                style={{ borderColor: "var(--border)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
