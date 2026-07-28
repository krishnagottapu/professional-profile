---
id: task-19
task: Add SEO metadata, JSON-LD schema, sitemap generation, and accessibility improvements
agent: frontend
status: approved
depends_on: [task-16, task-17, task-18]
skills:
  - languages/javascript
  - tooling/eslint
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/layout.tsx
    - frontend/src/app/page.tsx
    - frontend/src/app/resume/page.tsx
    - frontend/src/app/skills/page.tsx
    - frontend/src/app/experience/page.tsx
    - frontend/src/app/projects/page.tsx
    - frontend/src/app/blog/page.tsx
    - frontend/src/app/contact/page.tsx
    - frontend/src/app/not-found.tsx
    - frontend/next.config.ts
    - frontend/next-sitemap.config.js
    - frontend/package.json
acceptance_criteria:
  - Root layout has default metadata with site title template "Page Title | Sai Krishna Gottapu" and default description
  - Each public page exports unique metadata (title, description, Open Graph) via Next.js Metadata API
  - Home page includes a JSON-LD Person schema script in the <head>
  - Sitemap is generated at /sitemap.xml via next-sitemap as a postbuild step
  - robots.txt is generated at /robots.txt
  - All interactive elements (buttons, links, form inputs) have descriptive aria-label attributes
  - Skip-to-content link present in root layout (visually hidden, visible on focus)
  - WCAG AA color contrast verified for both light and dark themes (note areas that may need review)
  - 404 page at /not-found.tsx renders a user-friendly "Page not found" with a link back to home
  - next-sitemap added to package.json devDependencies
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Update `frontend/src/app/layout.tsx`

Add metadata template and default metadata:

```tsx
export const metadata: Metadata = {
  title: {
    default: "Sai Krishna Gottapu | Sr. Software Engineer",
    template: "%s | Sai Krishna Gottapu",
  },
  description: "Senior Software Engineer with 7+ years in Java, Spring Boot, and full-stack development. Available for new opportunities.",
  authors: [{ name: "Sai Krishna Gottapu" }],
  keywords: ["software engineer", "Java", "Spring Boot", "full stack", "Denver"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sai Krishna Gottapu",
  },
};
```

Add skip-to-content link in the root layout body, before `ConditionalPageShell`:

```tsx
<a href="#main-content"
   className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium"
   style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
  Skip to main content
</a>
```

Add `id="main-content"` to the `<main>` element inside `PageShell.tsx`.

### 2. Per-Page Metadata

Add `export const metadata: Metadata` to each page file (static exports — these are not async since content is static):

**`resume/page.tsx`:**
```ts
export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Sai Krishna Gottapu — Senior Software Engineer. 7+ years in Java, Spring Boot, microservices, and AI tooling.",
  openGraph: { title: "Resume | Sai Krishna Gottapu", description: "Download resume and view career summary." },
};
```

**`skills/page.tsx`:**
```ts
export const metadata: Metadata = {
  title: "Skills",
  description: "Technical skills including Java, Spring Boot, Python, MCP/LLM integration, Angular, Docker, and more.",
};
```

**`experience/page.tsx`:**
```ts
export const metadata: Metadata = {
  title: "Experience",
  description: "Work history at Charter Communications and CenturyLink. Enterprise software, microservices, and developer tooling.",
};
```

**`projects/page.tsx`:**
```ts
export const metadata: Metadata = {
  title: "Projects",
  description: "Personal and open-source projects by Sai Krishna Gottapu. GitHub repositories and featured works.",
};
```

**`blog/page.tsx`** — since this is a client component, create a separate `opengraph-image.tsx` or add metadata export in a parent layout. Alternatively, convert the blog listing page to a server component that loads the first page of posts server-side for metadata.

**`contact/page.tsx`:**
```ts
export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Sai Krishna Gottapu. Available for freelance, full-time, or consulting opportunities.",
};
```

### 3. JSON-LD Person Schema on Home Page

Since `page.tsx` is now a client component (HeroSection), add the JSON-LD in a separate server component wrapper, or add it directly to the root `layout.tsx` for the home page using a conditional. The simplest approach: add a `<script>` tag in `page.tsx` wrapped in a server component layer:

```tsx
// In a server wrapper or in layout.tsx conditionally, or add a generateMetadata to page.tsx
// If page.tsx is "use client", extract to a layout segment or add JSON-LD in a script tag in layout
```

Create `frontend/src/app/page.tsx` as a composition:

```tsx
// page.tsx is a SERVER component that renders HeroSection
import { HeroSection } from "@/components/home/HeroSection";

export const metadata = { title: "Sai Krishna Gottapu | Sr. Software Engineer - Home" };

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sai Krishna Gottapu",
  jobTitle: "Sr. Software Engineer",
  email: "krishnagottapu4@gmail.com",
  url: "https://saikrishnagottapu.com",  // update when deployed
  sameAs: [
    "https://github.com/krishnagottapu",
    "https://linkedin.com/in/sai-krishna-gottapu",
  ],
  address: { "@type": "PostalAddress", addressLocality: "Denver", addressRegion: "CO" },
  knowsAbout: ["Java", "Spring Boot", "Microservices", "MCP", "LLM Integration"],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <HeroSection />
    </>
  );
}
```

The JSON-LD object is hardcoded (not from user input), so `dangerouslySetInnerHTML` is safe here.

### 4. Install next-sitemap

Add to `frontend/package.json`:
```json
"devDependencies": {
  ...
  "next-sitemap": "^4.2.3"
}
```

Add to scripts:
```json
"postbuild": "next-sitemap"
```

### 5. Create `frontend/next-sitemap.config.js`

```js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://saikrishnagottapu.com",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/api"] },
    ],
  },
};
```

### 6. Create `frontend/src/app/not-found.tsx`

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-7xl font-bold mb-4" style={{ color: "var(--primary)" }}>404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-center mb-8 max-w-md" style={{ color: "var(--secondary)" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/"
            className="px-6 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
        Go Home
      </Link>
    </div>
  );
}
```

### 7. ARIA Labels Audit

Review all components created in tasks 03–18 and ensure:
- All `<button>` elements without visible text have `aria-label`
- All form `<input>` and `<textarea>` elements have `id` + `<label htmlFor>` associations (already specified in task-14 ContactForm)
- Nav `<nav>` elements have `aria-label` (done in task-03 Navbar)
- Admin sidebar nav has `aria-label="Admin navigation"` (done in task-15)
- Image elements (if any) have descriptive `alt` text
- Color-only information has a text fallback (e.g., unread dots also have `aria-label`)

### WCAG AA Contrast Notes

From the existing `globals.css` color values:
- **Light theme:** `--secondary: #64748b` on `--background: #ffffff` → contrast ratio ~4.7 (passes AA for normal text)
- **Dark theme:** `--secondary: #8b949e` on `--background: #0d1117` → contrast ratio ~4.6 (borderline — review and increase if needed)
- **Dark theme accent:** `--accent: #39d353` on dark bg → very high contrast (passes)
- **Primary on white:** `--primary: #2563eb` on white → contrast ~5.9 (passes AA)

Flag for manual review: secondary text in dark theme should be checked with a contrast checker tool. If below 4.5:1 for normal text, lighten `--muted-foreground` in dark theme from `#8b949e` to `#9ca8b4`.
