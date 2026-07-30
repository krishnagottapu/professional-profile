import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  let title = "Blog Post";
  let excerpt = "";

  try {
    const res = await fetch(
      `${apiUrl}/api/blog/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const post = await res.json();
      title = post.title ?? "Blog Post";
      excerpt = post.excerpt ?? "";
    }
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.2, marginBottom: 24 }}>
          {title}
        </div>
        {excerpt && (
          <div style={{ fontSize: 24, color: "#94a3b8", lineHeight: 1.5 }}>
            {excerpt.length > 120 ? excerpt.slice(0, 120) + "\u2026" : excerpt}
          </div>
        )}
        <div style={{ marginTop: "auto", fontSize: 20, color: "#64748b" }}>
          saikrishnagottapu.com
        </div>
      </div>
    ),
    size
  );
}
