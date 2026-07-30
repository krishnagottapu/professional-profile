"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { formatDate } from "@/lib/utils/formatDate";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: string;
  readTimeMinutes: number;
}

export function BlogCard({
  title,
  slug,
  excerpt,
  createdAt,
  readTimeMinutes,
}: BlogCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/blog/${slug}`}
        className="block p-6 rounded-xl border transition-colors hover:border-[var(--primary)]"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          {title}
        </h2>
        {excerpt && (
          <p
            className="text-sm mb-4 line-clamp-2"
            style={{ color: "var(--secondary)" }}
          >
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
          <span>{formatDate(createdAt)}</span>
          <span aria-hidden="true">·</span>
          <span>{readTimeMinutes} min read</span>
        </div>
      </Link>
    </motion.div>
  );
}
