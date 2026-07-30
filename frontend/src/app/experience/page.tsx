import type { Metadata } from "next";
import { WORK_HISTORY, EDUCATION } from "@/lib/data/experience";
import { VerticalTimeline, AnimatedCounter } from "@/components/experience/HorizontalTimeline";
import type { TimelineItem } from "@/components/experience/HorizontalTimeline";
import { getYearsOfExperience } from "@/lib/utils/experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience timeline — building enterprise Java systems, AI integrations, and full-stack web applications.",
};

function parseYear(period: string, position: "start" | "end"): number {
  if (position === "end" && period.toLowerCase().includes("present")) {
    return new Date().getFullYear();
  }
  const matches = period.match(/(\d{4})/g);
  if (!matches) return 2018;
  return position === "start"
    ? parseInt(matches[0], 10)
    : parseInt(matches[matches.length - 1], 10);
}

export default function ExperiencePage() {
  // Build unified timeline items (education + work), sorted by start year
  const timelineItems: TimelineItem[] = [
    ...EDUCATION.map((ed): TimelineItem => ({
      type: "education",
      title: ed.degree,
      subtitle: ed.institution,
      period: ed.year,
      startYear: ed.degree.includes("BTech") ? 2012 : 2016,
      endYear: parseInt(ed.year, 10),
    })),
    ...WORK_HISTORY.map((work): TimelineItem => ({
      type: "work",
      title: work.role,
      subtitle: work.company,
      period: work.period,
      location: work.location,
      current: work.current,
      bullets: work.bullets,
      techTags: work.techTags,
      startYear: parseYear(work.period, "start"),
      endYear: parseYear(work.period, "end"),
    })),
  ].sort((a, b) => b.startYear - a.startYear);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Page header */}
      <header className="text-center mb-16">
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Experience
        </h1>
        <p style={{ color: "var(--secondary)" }}>
          <AnimatedCounter target={getYearsOfExperience()} /> years building enterprise software and developer tooling
        </p>
      </header>

      {/* Vertical timeline with year selector */}
      <VerticalTimeline items={timelineItems} />
    </main>
  );
}
