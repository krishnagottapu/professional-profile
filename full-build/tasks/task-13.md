---
id: task-13
task: Build Blog listing and post detail pages with SEO metadata
agent: frontend
status: approved
depends_on: [task-04, task-06]
skills:
  - languages/javascript
  - tooling/eslint
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/blog/page.tsx
    - frontend/src/app/blog/[slug]/page.tsx
    - frontend/src/components/blog/BlogCard.tsx
    - frontend/src/components/blog/BlogContent.tsx
    - frontend/src/lib/api/blog.ts
    - frontend/src/types/blog.ts
    - frontend/src/lib/utils/formatDate.ts
    - frontend/src/lib/utils/readTime.ts
acceptance_criteria:
  - Blog listing page at /blog fetches published posts from GET /api/blog with pagination
  - Each blog card shows title, excerpt, formatted date, and estimated read time
  - "Load more" button (or pagination) fetches additional pages
  - Empty state "Coming soon — first post in progress" shown when no posts exist
  - Blog detail page at /blog/[slug] fetches single post from GET /api/blog/{slug}
  - Detail page renders TipTap HTML content safely (no XSS — use dangerouslySetInnerHTML only with sanitized content or use a trusted rendering approach)
  - Blog detail page generates unique OG/meta tags via Next.js generateMetadata
  - 404 rendered if slug not found
  - Scroll-triggered entrance animations on listing cards (Framer Motion)
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Create `frontend/src/types/blog.ts`

```ts
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
```

### 2. Create `frontend/src/lib/api/blog.ts`

```ts
import { apiFetch } from "./client";
import type { BlogPost, BlogPostDetail, PaginatedResponse } from "@/types/blog";

export function getBlogPosts(page = 0, size = 10): Promise<PaginatedResponse<BlogPost>> {
  return apiFetch<PaginatedResponse<BlogPost>>(`/api/blog?page=${page}&size=${size}`);
}

export function getBlogPost(slug: string): Promise<BlogPostDetail> {
  return apiFetch<BlogPostDetail>(`/api/blog/${slug}`);
}
```

### 3. Create utility functions

**`frontend/src/lib/utils/formatDate.ts`**:
```ts
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}
```

**`frontend/src/lib/utils/readTime.ts`**:
```ts
export function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
```

### 4. Create `frontend/src/components/blog/BlogCard.tsx`

`"use client"` with Framer Motion:

```tsx
"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { formatDate } from "@/lib/utils/formatDate";
import type { BlogPost } from "@/types/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                transition={{ duration: 0.4 }}>
      <Link href={`/blog/${post.slug}`}
            className="block p-6 rounded-xl border hover:border-[var(--primary)] transition-colors"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        {post.excerpt && (
          <p className="text-sm mb-4 line-clamp-3" style={{ color: "var(--secondary)" }}>
            {post.excerpt}
          </p>
        )}
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {formatDate(post.createdAt)}
        </p>
      </Link>
    </motion.div>
  );
}
```

### 5. Create `frontend/src/components/blog/BlogContent.tsx`

Content rendered from TipTap HTML. Note: since this is admin-authored content (not user-submitted), `dangerouslySetInnerHTML` is acceptable. Add a prose class for readable typography.

```tsx
interface Props { html: string; }

export function BlogContent({ html }: Props) {
  return (
    <article
      className="prose prose-lg max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

If `@tailwindcss/typography` is not installed, add it. Alternatively use custom paragraph/heading styles in globals.css targeting the `.blog-content` class.

### 6. Create `frontend/src/app/blog/page.tsx`

`"use client"` with pagination state:

```tsx
"use client";
import { useState, useEffect } from "react";
import { getBlogPosts } from "@/lib/api/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { BlogPost, PaginatedResponse } from "@/types/blog";

export default function BlogPage() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PaginatedResponse<BlogPost> | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlogPosts(page).then((res) => {
      setData(res);
      setPosts(prev => page === 0 ? res.content : [...prev, ...res.content]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page]);

  const hasMore = data ? page < data.totalPages - 1 : false;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">Blog</h1>
      {loading && page === 0 ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : posts.length === 0 ? (
        <p className="text-center py-20" style={{ color: "var(--secondary)" }}>
          Coming soon — first post in progress.
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map(post => <BlogCard key={post.id} post={post} />)}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button onClick={() => setPage(p => p + 1)} disabled={loading}
                      className="px-6 py-2 rounded-lg border transition-colors"
                      style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

### 7. Create `frontend/src/app/blog/[slug]/page.tsx`

Server component with `generateMetadata`:

```tsx
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/api/blog";
import { BlogContent } from "@/components/blog/BlogContent";
import { formatDate } from "@/lib/utils/formatDate";
import { estimateReadTime } from "@/lib/utils/readTime";
import type { Metadata } from "next";

interface Props { params: { slug: string }; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getBlogPost(params.slug);
    return {
      title: `${post.title} | Sai Krishna Gottapu`,
      description: post.excerpt ?? post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt ?? "",
        type: "article",
        publishedTime: post.createdAt,
      },
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  let post;
  try {
    post = await getBlogPost(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <p className="text-sm mb-8" style={{ color: "var(--secondary)" }}>
        {formatDate(post.createdAt)} · {estimateReadTime(post.content ?? "")}
      </p>
      <BlogContent html={post.content ?? ""} />
    </div>
  );
}
```
