import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BlogContent } from "@/components/blog/BlogContent";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { formatDate } from "@/lib/utils/formatDate";
import { estimateReadTime } from "@/lib/utils/readTime";

interface BlogPostDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const fetchBlogPost = cache(async (slug: string): Promise<BlogPostDetail | null> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    const res = await fetch(
      `${apiUrl}/api/blog/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (!post) {
    return { title: "Post Not Found | Sai Krishna Gottapu" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: `${post.title} | Sai Krishna Gottapu`,
    description: post.excerpt ?? post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? "",
      type: "article",
      publishedTime: post.createdAt,
      url: `${siteUrl}/blog/${post.slug}`,
      images: [
        {
          url: `${siteUrl}/blog/${post.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? "",
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm mb-8 transition-colors hover:underline"
        style={{ color: "var(--primary)" }}
      >
        ← Back to Blog
      </Link>

      <article>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: "var(--foreground)" }}
        >
          {post.title}
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--secondary)" }}>
          {formatDate(post.createdAt)} · {estimateReadTime(post.content ?? "")}
        </p>

        <BlogContent html={post.content ?? ""} />

        <ShareButtons title={post.title} slug={post.slug} excerpt={post.excerpt ?? undefined} />
      </article>
    </div>
  );
}
