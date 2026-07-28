---
id: task-16
task: Build admin blog management with TipTap rich text editor and CRUD operations
agent: frontend
status: approved
depends_on: [task-15]
skills:
  - languages/javascript
  - tooling/eslint
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/admin/blog/page.tsx
    - frontend/src/app/admin/blog/[id]/page.tsx
    - frontend/src/components/admin/BlogEditor.tsx
    - frontend/src/lib/api/blog.ts
    - frontend/src/types/blog.ts
    - frontend/package.json
acceptance_criteria:
  - Blog list at /admin/blog shows all posts (published and draft) with title, status badge, date, and action buttons
  - "New Post" button navigates to /admin/blog/new
  - Edit button navigates to /admin/blog/{id}
  - Delete button shows a confirmation modal before deleting; on confirm calls DELETE /api/admin/blog/{id}
  - Blog editor page at /admin/blog/[id] (and /admin/blog/new) has title, slug, excerpt, TipTap editor, publish toggle
  - Slug auto-generates from title as user types (debounced); can be manually overridden
  - TipTap editor includes Bold, Italic, Strike, Heading (H2/H3), Bullet List, Ordered List, Code Block, Link extensions
  - Save Draft button calls POST (new) or PUT (edit) with published=false
  - Publish button calls POST/PUT with published=true
  - Auto-save draft triggers after 3 seconds of inactivity (debounced) — shows "Saving..." indicator
  - @tiptap/react, @tiptap/starter-kit, @tiptap/extension-link, @tiptap/extension-code-block added to package.json
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Add TipTap dependencies to package.json

```json
"@tiptap/react": "^2.10.0",
"@tiptap/starter-kit": "^2.10.0",
"@tiptap/extension-link": "^2.10.0",
"@tiptap/extension-code-block-lowlight": "^2.10.0"
```

### 2. Add admin API methods to `frontend/src/lib/api/blog.ts`

```ts
// Append to existing blog.ts

import type { BlogPostDetail } from "@/types/blog";

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
```

### 3. Create `frontend/src/components/admin/BlogEditor.tsx`

`"use client"` TipTap editor component:

```tsx
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";

const lowlight = createLowlight();

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export function BlogEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Link.configure({ openOnClick: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[300px] focus:outline-none p-4",
      },
    },
  });

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, label, children }: {
    onClick: () => void; active?: boolean; label: string; children: React.ReactNode;
  }) => (
    <button type="button" onClick={onClick} aria-label={label} aria-pressed={active}
            className="p-1.5 rounded text-sm transition-colors"
            style={{
              backgroundColor: active ? "var(--primary)" : "transparent",
              color: active ? "#fff" : "var(--foreground)",
            }}>
      {children}
    </button>
  );

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "var(--border)" }}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b"
           style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}
                       active={editor.isActive("bold")} label="Bold">B</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}
                       active={editor.isActive("italic")} label="Italic"><em>I</em></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()}
                       active={editor.isActive("strike")} label="Strike"><s>S</s></ToolbarButton>
        <span className="w-px mx-1" style={{ backgroundColor: "var(--border)" }} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                       active={editor.isActive("heading", { level: 2 })} label="Heading 2">H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                       active={editor.isActive("heading", { level: 3 })} label="Heading 3">H3</ToolbarButton>
        <span className="w-px mx-1" style={{ backgroundColor: "var(--border)" }} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()}
                       active={editor.isActive("bulletList")} label="Bullet List">• List</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()}
                       active={editor.isActive("orderedList")} label="Ordered List">1. List</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                       active={editor.isActive("codeBlock")} label="Code Block">{`<>`}</ToolbarButton>
      </div>
      <EditorContent editor={editor} style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }} />
    </div>
  );
}
```

### 4. Create `frontend/src/app/admin/blog/page.tsx`

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { getAdminBlogPosts, deleteBlogPost } from "@/lib/api/blog";
import { formatDate } from "@/lib/utils/formatDate";

export default function AdminBlogListPage() {
  const { data: posts, loading, error } = useApi(getAdminBlogPosts);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await deleteBlogPost(id).catch(console.error);
    setDeletingId(null);
    setConfirmId(null);
    // Refresh list
    window.location.reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new"
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
          + New Post
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        {(posts ?? []).map(post => (
          <div key={post.id} className="flex items-center gap-4 p-4 rounded-lg border"
               style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex-1">
              <p className="font-medium">{post.title}</p>
              <p className="text-xs" style={{ color: "var(--secondary)" }}>{formatDate(post.createdAt)}</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: post.published ? "#16a34a22" : "var(--muted)",
                    color: post.published ? "#16a34a" : "var(--secondary)",
                  }}>
              {post.published ? "Published" : "Draft"}
            </span>
            <Link href={`/admin/blog/${post.id}`}
                  className="text-sm px-3 py-1 rounded border"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
              Edit
            </Link>
            <button onClick={() => setConfirmId(post.id)}
                    className="text-sm px-3 py-1 rounded border"
                    style={{ borderColor: "#ef4444", color: "#ef4444" }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Confirm delete modal */}
      {confirmId && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
             style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="p-6 rounded-xl max-w-sm w-full"
               style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h2 className="font-bold mb-2">Delete Post?</h2>
            <p className="text-sm mb-6" style={{ color: "var(--secondary)" }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmId)} disabled={deletingId === confirmId}
                      className="flex-1 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: "#ef4444", color: "#fff" }}>
                {deletingId === confirmId ? "Deleting..." : "Delete"}
              </button>
              <button onClick={() => setConfirmId(null)}
                      className="flex-1 py-2 rounded-lg text-sm border"
                      style={{ borderColor: "var(--border)" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 5. Create `frontend/src/app/admin/blog/[id]/page.tsx`

Handles both `new` (id === "new") and edit (id is a number):

```tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { getAdminBlogPost, createBlogPost, updateBlogPost } from "@/lib/api/blog";
import { useDebounce } from "@/hooks/useDebounce";

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const postId = isNew ? null : Number(params.id);

  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", published: false });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [savedId, setSavedId] = useState<number | null>(null);

  // Load existing post
  useEffect(() => {
    if (postId) {
      getAdminBlogPost(postId).then(post => {
        setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt ?? "",
                  content: post.content ?? "", published: post.published });
        setSavedId(postId);
        setSlugManuallyEdited(true); // don't override existing slug
      });
    }
  }, [postId]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && form.title) {
      setForm(p => ({ ...p, slug: slugify(p.title) }));
    }
  }, [form.title, slugManuallyEdited]);

  const debouncedForm = useDebounce(form, 3000);

  // Auto-save draft
  useEffect(() => {
    if (saveStatus === "idle" && debouncedForm.title) {
      autoSave();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedForm]);

  const autoSave = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const data = { ...form, published: false };
      if (savedId) {
        await updateBlogPost(savedId, data);
      } else {
        const created = await createBlogPost(data);
        setSavedId(created.id);
        router.replace(`/admin/blog/${created.id}`, { scroll: false });
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch { setSaveStatus("idle"); }
  }, [form, savedId, router]);

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    try {
      const data = { ...form, published: publish };
      if (savedId) {
        await updateBlogPost(savedId, data);
      } else {
        const created = await createBlogPost(data);
        setSavedId(created.id);
      }
      router.push("/admin/blog");
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{isNew ? "New Post" : "Edit Post"}</h1>
        <div className="flex items-center gap-3">
          {saveStatus === "saving" && <span className="text-xs" style={{ color: "var(--secondary)" }}>Saving...</span>}
          {saveStatus === "saved" && <span className="text-xs text-green-500">Saved</span>}
          <button onClick={() => handleSave(false)} disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm border"
                  style={{ borderColor: "var(--border)" }}>
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input placeholder="Post title" value={form.title}
               onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
               className="w-full px-4 py-2 rounded-lg border text-xl font-bold"
               style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        <input placeholder="slug (auto-generated)" value={form.slug}
               onChange={e => { setSlugManuallyEdited(true); setForm(p => ({ ...p, slug: e.target.value })); }}
               className="w-full px-4 py-2 rounded-lg border text-sm font-mono"
               style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--secondary)" }} />
        <input placeholder="Short excerpt (optional)" value={form.excerpt}
               onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
               className="w-full px-4 py-2 rounded-lg border text-sm"
               style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        <BlogEditor content={form.content} onChange={content => setForm(p => ({ ...p, content }))} />
      </div>
    </div>
  );
}
```

### 6. Create `frontend/src/hooks/useDebounce.ts`

```ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```
