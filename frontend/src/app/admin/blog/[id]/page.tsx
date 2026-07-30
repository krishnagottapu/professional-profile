"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import {
  getAdminBlogPost,
  createBlogPost,
  updateBlogPost,
} from "@/lib/api/blog";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const postId = isNew ? null : Number(params.id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [savedId, setSavedId] = useState<number | null>(null);

  const initialLoadDone = useRef(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef({ title: "", slug: "", excerpt: "", content: "" });
  const savedIdRef = useRef<number | null>(null);

  // Load existing post
  useEffect(() => {
    if (postId) {
      getAdminBlogPost(postId).then((post) => {
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt ?? "");
        setContent(post.content ?? "");
        setSavedId(postId);
        savedIdRef.current = postId;
        setSlugManuallyEdited(true);
        formRef.current = {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content ?? "",
        };
        initialLoadDone.current = true;
      });
    } else {
      initialLoadDone.current = true;
    }
  }, [postId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  // Derive slug from title (computed)
  const derivedSlug = slugManuallyEdited
    ? slug
    : title
      ? slugify(title)
      : slug;

  const performAutoSave = useCallback(async () => {
    const currentForm = formRef.current;
    if (!currentForm.title) return;

    setSaveStatus("saving");
    try {
      const data = {
        title: currentForm.title,
        slug: currentForm.slug,
        content: currentForm.content,
        excerpt: currentForm.excerpt,
        published: false,
      };
      if (savedIdRef.current) {
        await updateBlogPost(savedIdRef.current, data);
      } else {
        const created = await createBlogPost(data);
        setSavedId(created.id);
        savedIdRef.current = created.id;
        router.replace(`/admin/blog/${created.id}`, { scroll: false });
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("idle");
    }
  }, [router]);

  const scheduleAutoSave = useCallback(() => {
    if (!initialLoadDone.current) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      performAutoSave();
    }, 3000);
  }, [performAutoSave]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    const newSlug = slugManuallyEdited ? slug : slugify(value);
    formRef.current = { ...formRef.current, title: value, slug: newSlug };
    scheduleAutoSave();
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value);
    formRef.current = { ...formRef.current, slug: value };
    scheduleAutoSave();
  };

  const handleExcerptChange = (value: string) => {
    setExcerpt(value);
    formRef.current = { ...formRef.current, excerpt: value };
    scheduleAutoSave();
  };

  const handleContentChange = (html: string) => {
    setContent(html);
    formRef.current = { ...formRef.current, content: html };
    scheduleAutoSave();
  };

  const handleSave = async (publish: boolean) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setSaving(true);
    try {
      const data = {
        title,
        slug: derivedSlug,
        content,
        excerpt,
        published: publish,
      };
      if (savedId) {
        await updateBlogPost(savedId, data);
      } else {
        const created = await createBlogPost(data);
        setSavedId(created.id);
      }
      router.push("/admin/blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isNew ? "New Post" : "Edit Post"}
        </h1>
        <div className="flex items-center gap-3">
          {saveStatus === "saving" && (
            <span className="text-xs" style={{ color: "var(--secondary)" }}>
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-green-500">Saved</span>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm border"
            style={{ borderColor: "var(--border)" }}
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor: "var(--primary)", color: "#fff" }}
          >
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input
          placeholder="Post title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border text-xl font-bold"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
        <input
          placeholder="slug (auto-generated)"
          value={derivedSlug}
          onChange={(e) => handleSlugChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border text-sm font-mono"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--secondary)",
          }}
        />
        <input
          placeholder="Short excerpt (optional)"
          value={excerpt}
          onChange={(e) => handleExcerptChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border text-sm"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
        <BlogEditor content={content} onChange={handleContentChange} />
      </div>
    </div>
  );
}
