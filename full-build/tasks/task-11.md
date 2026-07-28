---
id: task-11
task: Build Resume page with visual summary, quick stats, and downloadable PDF
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
    - frontend/src/app/resume/page.tsx
    - frontend/src/lib/data/resume.ts
    - frontend/public/resume.pdf
acceptance_criteria:
  - Resume page renders a visual summary including a professional headline, summary paragraph, and key highlights
  - Quick stats section shows 7+ Years Experience, 30+ Technologies, 2 Companies
  - "Download Resume" button links to /resume.pdf and triggers file download
  - Resume page links to /experience and /skills pages for full detail
  - Page has print-friendly styling — navbar/footer hidden on print, clean layout
  - A placeholder PDF file exists at frontend/public/resume.pdf (real PDF upload is manual step)
  - All data hardcoded in lib/data/resume.ts (no API calls)
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Create `frontend/src/lib/data/resume.ts`

```ts
export const RESUME_SUMMARY = {
  headline: "Sr. Software Engineer — Java, Spring Boot & AI Integration",
  summary: `Senior Software Engineer with 7+ years of experience building enterprise-grade applications,
developer tooling, and AI-powered integrations. Currently at Charter Communications as Software Engineer V,
delivering Jira/Confluence plugins, MCP servers, and automation frameworks. Previously at CenturyLink
migrating monolithic VoIP systems to microservices with Kafka and Kubernetes. MS Computer Science from
University of Central Missouri.`,
  highlights: [
    "Deep expertise in Java 21, Spring Boot 3.x, and the Atlassian SDK",
    "Built MCP servers and LLM integration tooling for internal developer productivity",
    "Led microservices migration from monolith at CenturyLink using Kafka and Docker",
    "Full-stack capability: Angular, Next.js, TypeScript across frontend layers",
    "SAFe Agile certified practitioner with cross-team planning and delivery experience",
  ],
};

export const QUICK_STATS = [
  { label: "Years Experience", value: "7+" },
  { label: "Technologies", value: "30+" },
  { label: "Companies", value: "2" },
];

export const KEY_SKILLS = [
  "Java", "Spring Boot", "Python", "JavaScript", "TypeScript",
  "Angular", "Next.js", "Kafka", "Docker", "Kubernetes",
  "Atlassian SDK", "MCP / LLM Integration", "Playwright", "JUnit",
];
```

### 2. Create `frontend/src/app/resume/page.tsx`

```tsx
import Link from "next/link";
import { RESUME_SUMMARY, QUICK_STATS, KEY_SKILLS } from "@/lib/data/resume";

export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 print:py-8">

      {/* Header */}
      <div className="text-center mb-12 print:mb-8">
        <h1 className="text-4xl font-bold mb-2">Sai Krishna Gottapu</h1>
        <p className="text-xl" style={{ color: "var(--primary)" }}>{RESUME_SUMMARY.headline}</p>
        <p className="text-sm mt-1" style={{ color: "var(--secondary)" }}>
          Denver, CO · krishnagottapu4@gmail.com · github.com/krishnagottapu
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6 mb-12 print:mb-8">
        {QUICK_STATS.map((stat) => (
          <div key={stat.label}
               className="text-center p-6 rounded-xl border"
               style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div className="text-4xl font-bold mb-1" style={{ color: "var(--primary)" }}>
              {stat.value}
            </div>
            <div className="text-sm" style={{ color: "var(--secondary)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
        <p className="leading-relaxed" style={{ color: "var(--card-foreground)" }}>
          {RESUME_SUMMARY.summary}
        </p>
      </section>

      {/* Highlights */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Key Highlights</h2>
        <ul className="space-y-2">
          {RESUME_SUMMARY.highlights.map((h, i) => (
            <li key={i} className="flex gap-3">
              <span style={{ color: "var(--primary)" }}>▹</span>
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
            <span key={skill}
                  className="px-3 py-1 rounded-full text-sm border"
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <div className="flex flex-wrap gap-4 justify-center mt-12 print:hidden">
        <a
          href="/resume.pdf"
          download="Sai-Krishna-Gottapu-Resume.pdf"
          className="px-6 py-3 rounded-lg font-semibold transition-colors"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          ↓ Download Resume PDF
        </a>
        <Link href="/experience"
              className="px-6 py-3 rounded-lg font-semibold border transition-colors"
              style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
          View Full Experience
        </Link>
        <Link href="/skills"
              className="px-6 py-3 rounded-lg font-semibold border transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
          View All Skills
        </Link>
      </div>
    </div>
  );
}
```

### 3. Print Styles

Add to `globals.css`:

```css
@media print {
  nav, footer, .print\:hidden {
    display: none !important;
  }
  body {
    background: white !important;
    color: black !important;
  }
}
```

### 4. Placeholder PDF

Create `frontend/public/resume.pdf` as a placeholder text file (real PDF must be dropped in manually):

```
This is a placeholder for the resume PDF.
Replace this file with the actual resume PDF at: frontend/public/resume.pdf
```

Note: A real browser download link (`<a href="/resume.pdf" download>`) will serve whatever file is at that path. The placeholder ensures the link doesn't 404.
