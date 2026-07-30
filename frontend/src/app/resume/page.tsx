import type { Metadata } from "next";
import Link from "next/link";
import { RESUME_SUMMARY, QUICK_STATS, KEY_SKILLS } from "@/lib/data/resume";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Professional resume of Sai Krishna Gottapu — Sr. Software Engineer specializing in Java, Spring Boot, and AI Integration.",
  openGraph: {
    title: "Resume | Sai Krishna Gottapu",
    description:
      "Sr. Software Engineer specializing in enterprise applications and AI-powered tooling.",
  },
};

export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 print:py-8">
      {/* Header */}
      <div className="text-center mb-12 print:mb-8">
        <h1 className="text-4xl font-bold mb-2">Sai Krishna Gottapu</h1>
        <p className="text-xl" style={{ color: "var(--primary)" }}>
          {RESUME_SUMMARY.headline}
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--secondary)" }}>
          Denver, CO &middot; krishnagottapu4@gmail.com &middot;
          github.com/krishnagottapu
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6 mb-12 print:mb-8">
        {QUICK_STATS.map((stat) => (
          <div
            key={stat.label}
            className="text-center p-6 rounded-xl border"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="text-4xl font-bold mb-1"
              style={{ color: "var(--primary)" }}
            >
              {stat.value}
            </div>
            <div className="text-sm" style={{ color: "var(--secondary)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
        <p
          className="leading-relaxed"
          style={{ color: "var(--card-foreground)" }}
        >
          {RESUME_SUMMARY.summary}
        </p>
      </section>

      {/* Highlights */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Key Highlights</h2>
        <ul className="space-y-2">
          {RESUME_SUMMARY.highlights.map((h, i) => (
            <li key={i} className="flex gap-3">
              <span style={{ color: "var(--primary)" }}>&#9655;</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Key Skills */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Core Technologies</h2>
        <div className="flex flex-wrap gap-2">
          {KEY_SKILLS.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-sm border"
              style={{
                borderColor: "var(--primary)",
                color: "var(--primary)",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <div className="flex flex-wrap gap-4 justify-center mt-12 print:hidden">
        <a
          href="/saikrishnagottapu_updated_resume.pdf"
          download="Sai-Krishna-Gottapu-Resume.pdf"
          className="px-6 py-3 rounded-lg font-semibold transition-colors"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          &darr; Download Resume PDF
        </a>
        <Link
          href="/experience"
          className="px-6 py-3 rounded-lg font-semibold border transition-colors"
          style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
        >
          View Full Experience
        </Link>
        <Link
          href="/skills"
          className="px-6 py-3 rounded-lg font-semibold border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
        >
          View All Skills
        </Link>
      </div>
    </div>
  );
}
