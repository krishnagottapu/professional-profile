"use client";

import { useState } from "react";

interface Props {
  title: string;
  slug: string;
  excerpt?: string;
}

export function ShareButtons({ title, slug, excerpt }: Props) {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://saikrishnagottapu.vercel.app";
  const postUrl = `${siteUrl}/blog/${slug}`;

  const shareText = excerpt
    ? `${title}\n\n${excerpt}\n\n${postUrl}`
    : `${title}\n\n${postUrl}`;

  const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="flex items-center gap-3 mt-10 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
      <span className="text-sm font-medium" style={{ color: "var(--secondary)" }}>
        Share this post:
      </span>

      {/* LinkedIn */}
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.preventDefault();
          window.open(linkedInUrl, "_blank", "noopener,noreferrer,width=600,height=600");
        }}
        aria-label="Share on LinkedIn"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
        style={{ backgroundColor: "#0A66C2", color: "#fff" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Share on LinkedIn
      </a>

      {/* Copy link */}
      <CopyLinkButton url={postUrl} />
    </div>
  );
}

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      prompt("Copy this link:", url);
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy post link to clipboard"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
      style={{ borderColor: "var(--border)", color: "var(--secondary)" }}
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
