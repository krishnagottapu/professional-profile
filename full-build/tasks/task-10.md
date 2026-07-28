---
id: task-10
task: Build Experience page with vertical timeline for work history and education
agent: frontend
status: approved
depends_on: [task-04]
skills:
  - languages/javascript
  - tooling/eslint
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/experience/page.tsx
    - frontend/src/components/experience/TimelineEntry.tsx
    - frontend/src/components/experience/EducationCard.tsx
    - frontend/src/lib/data/experience.ts
acceptance_criteria:
  - Experience page renders Charter Communications and CenturyLink work history entries
  - Each entry shows company name, role, dates, bullet-point responsibilities, and tech tag pills
  - Vertical timeline with a connecting line and dot markers is visible
  - Timeline alternates left/right on desktop (md+); stacks single-column on mobile
  - Each timeline entry fades in via Framer Motion useInView when scrolled into view
  - Education section appears below work history with MS and BTech entries
  - All data is hardcoded in lib/data/experience.ts (no API call)
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Create `frontend/src/lib/data/experience.ts`

```ts
export interface WorkEntry {
  company: string;
  role: string;
  period: string;
  current: boolean;
  bullets: string[];
  techTags: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
}

export const WORK_HISTORY: WorkEntry[] = [
  {
    company: "Charter Communications",
    role: "Software Engineer V",
    period: "July 2020 – Present",
    current: true,
    bullets: [
      "Building custom Jira/Confluence plugins and integrations for internal enterprise teams using the Atlassian SDK and Active Objects.",
      "Developing AI-powered MCP servers in Python to automate developer workflows and enhance productivity tooling.",
      "Implementing Playwright automation suites for regression testing of internal business applications.",
      "Leading full-stack feature development across Spring Boot microservices and Angular frontends.",
      "Driving SAFe Agile ceremonies and cross-team technical alignment for quarterly planning.",
    ],
    techTags: ["Java", "Spring Boot", "Atlassian SDK", "Python", "MCP", "Playwright", "Angular", "Active Objects", "Docker"],
  },
  {
    company: "CenturyLink INC.",
    role: "Java Full Stack Developer",
    period: "July 2018 – July 2020",
    current: false,
    bullets: [
      "Migrated a monolithic VoIP order processing application to a microservices architecture using Spring Boot.",
      "Built event-driven pipelines with Apache Kafka for real-time order status updates and workflow management.",
      "Developed Angular 8 frontends with reactive forms and REST integration for order management dashboards.",
      "Containerized services with Docker and orchestrated deployments on Kubernetes.",
    ],
    techTags: ["Java", "Spring Boot", "Angular", "Kafka", "Docker", "Kubernetes", "Hibernate", "MongoDB"],
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    degree: "MS Computer Science",
    institution: "University of Central Missouri, MO",
    year: "2018",
  },
  {
    degree: "BTech Computer Science & Engineering",
    institution: "JNTU Kakinada",
    year: "2016",
  },
];
```

### 2. Create `frontend/src/components/experience/TimelineEntry.tsx`

`"use client"` — uses Framer Motion `useInView`.

```tsx
"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { WorkEntry } from "@/lib/data/experience";

interface Props {
  entry: WorkEntry;
  index: number; // used for left/right alternation on desktop
}

export function TimelineEntry({ entry, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : (isLeft ? -40 : 40) }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative flex md:items-center gap-8 mb-12 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* Timeline dot */}
      <div
        className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-2 transform -translate-x-1/2 z-10 hidden md:block"
        style={{ backgroundColor: "var(--primary)", borderColor: "var(--background)" }}
      />

      {/* Content card */}
      <div className={`w-full md:w-5/12 p-6 rounded-xl border ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
           style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        {entry.current && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full mb-2 inline-block"
                style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
            Current
          </span>
        )}
        <h3 className="text-xl font-bold">{entry.role}</h3>
        <p className="font-semibold" style={{ color: "var(--primary)" }}>{entry.company}</p>
        <p className="text-sm mb-4" style={{ color: "var(--secondary)" }}>{entry.period}</p>
        <ul className="space-y-2 mb-4">
          {entry.bullets.map((bullet, i) => (
            <li key={i} className="text-sm flex gap-2">
              <span style={{ color: "var(--primary)" }}>▹</span>
              <span style={{ color: "var(--card-foreground)" }}>{bullet}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          {entry.techTags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-md"
                  style={{ backgroundColor: "var(--muted)", color: "var(--secondary)" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
```

### 3. Create `frontend/src/components/experience/EducationCard.tsx`

```tsx
import type { EducationEntry } from "@/lib/data/experience";

export function EducationCard({ entry }: { entry: EducationEntry }) {
  return (
    <div className="p-5 rounded-xl border"
         style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
      <p className="font-bold">{entry.degree}</p>
      <p style={{ color: "var(--primary)" }}>{entry.institution}</p>
      <p className="text-sm" style={{ color: "var(--secondary)" }}>{entry.year}</p>
    </div>
  );
}
```

### 4. Create `frontend/src/app/experience/page.tsx`

```tsx
import { WORK_HISTORY, EDUCATION } from "@/lib/data/experience";
import { TimelineEntry } from "@/components/experience/TimelineEntry";
import { EducationCard } from "@/components/experience/EducationCard";

export default function ExperiencePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">Experience</h1>
      <p className="text-center mb-16" style={{ color: "var(--secondary)" }}>
        7+ years building enterprise software and developer tooling
      </p>

      {/* Timeline connecting line — visible on md+ */}
      <div className="relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
             style={{ backgroundColor: "var(--border)" }} />
        {WORK_HISTORY.map((entry, i) => (
          <TimelineEntry key={entry.company} entry={entry} index={i} />
        ))}
      </div>

      {/* Education section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {EDUCATION.map((ed) => (
            <EducationCard key={ed.degree} entry={ed} />
          ))}
        </div>
      </section>
    </div>
  );
}
```
