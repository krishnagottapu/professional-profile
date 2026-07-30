import type { Metadata } from "next";
import { WORK_HISTORY, EDUCATION } from "@/lib/data/experience";
import { TimelineEntry } from "@/components/experience/TimelineEntry";
import { EducationEntry } from "@/components/experience/EducationEntry";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience timeline — 7+ years building enterprise Java systems, AI integrations, and full-stack web applications.",
};

export default function ExperiencePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Page header */}
      <header className="text-center mb-16">
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Experience
        </h1>
        <p style={{ color: "var(--secondary)" }}>
          7+ years building enterprise software and developer tooling
        </p>
      </header>

      {/* Work history timeline */}
      <section aria-label="Work history">
        <div className="relative">
          {/* Vertical timeline line — centered on desktop, left-aligned on mobile */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ backgroundColor: "var(--border)" }}
            aria-hidden="true"
          />

          {WORK_HISTORY.map((entry, i) => (
            <TimelineEntry
              key={entry.company}
              company={entry.company}
              role={entry.role}
              period={entry.period}
              location={entry.location}
              current={entry.current}
              bullets={entry.bullets}
              techTags={entry.techTags}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Education section */}
      <section className="mt-20" aria-label="Education">
        <h2
          className="text-2xl font-bold mb-8 text-center"
          style={{ color: "var(--foreground)" }}
        >
          Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {EDUCATION.map((ed) => (
            <EducationEntry
              key={ed.degree}
              degree={ed.degree}
              institution={ed.institution}
              year={ed.year}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
