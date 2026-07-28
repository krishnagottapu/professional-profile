---
id: task-03
task: Implement shared layout shell, responsive navbar, and footer
agent: frontend
status: approved
depends_on: []
skills:
  - languages/javascript
  - tooling/eslint
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/layout.tsx
    - frontend/src/app/globals.css
    - frontend/src/components/layout/Navbar.tsx
    - frontend/src/components/layout/Footer.tsx
    - frontend/src/components/layout/PageShell.tsx
    - frontend/src/app/resume/page.tsx
    - frontend/src/app/skills/page.tsx
    - frontend/src/app/experience/page.tsx
    - frontend/src/app/projects/page.tsx
    - frontend/src/app/blog/page.tsx
    - frontend/src/app/contact/page.tsx
acceptance_criteria:
  - Responsive navbar with links — Home, Resume, Skills, Experience, Projects, Blog, Contact
  - Mobile hamburger menu with animated open/close (CSS/state-based, no external dep needed yet)
  - Footer with LinkedIn, GitHub, and Email social icon links
  - Active page highlighting driven by usePathname
  - ThemeToggle is integrated into the navbar (moved from standalone page)
  - Root layout.tsx wraps children in PageShell (Navbar + main + Footer)
  - Placeholder page.tsx files exist for all routes so navigation works end-to-end
  - All links use Next.js Link component (no hard anchor tags for internal navigation)
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Update `frontend/src/app/layout.tsx`

Import and render `PageShell` inside the `ThemeProvider`. The root layout should look like:

```tsx
<ThemeProvider>
  <PageShell>{children}</PageShell>
</ThemeProvider>
```

Remove the standalone ThemeToggle from `page.tsx` — it belongs in the Navbar now.

### 2. Create `frontend/src/components/layout/Navbar.tsx`

- `"use client"` directive (uses `usePathname` and `useState`)
- Logo/name on left: "Sai Krishna Gottapu" in `font-mono` (or just initials on mobile)
- Nav links on right (desktop): Home `/`, Resume `/resume`, Skills `/skills`, Experience `/experience`, Projects `/projects`, Blog `/blog`, Contact `/contact`
- Active link: compare `pathname` with `href`; apply distinct active style using CSS variables (`--primary` color + underline or bold)
- ThemeToggle placed after nav links
- Hamburger button (3 lines → X) visible on mobile (`md:hidden`), hidden on desktop
- Mobile drawer: full-width dropdown below nav, links stacked; closes on link click
- Use CSS transition for hamburger open/close (not Framer Motion — that's added Task 4+)
- Sticky top nav: `sticky top-0 z-50` with background `var(--nav)` and border-bottom `var(--nav-border)`
- ARIA: `aria-label="Main navigation"` on `<nav>`, `aria-expanded` on hamburger button, `aria-label="Toggle navigation menu"`

### 3. Create `frontend/src/components/layout/Footer.tsx`

- Copyright line: "© 2024 Sai Krishna Gottapu. All rights reserved."
- Three social icon links (open in `_blank`, `rel="noopener noreferrer"`):
  - LinkedIn: `https://linkedin.com/in/sai-krishna-gottapu` — use a simple SVG LinkedIn icon
  - GitHub: `https://github.com/krishnagottapu` — GitHub SVG icon
  - Email: `mailto:krishnagottapu4@gmail.com` — envelope SVG icon
- Use inline SVG icons (no icon library dependency yet)
- ARIA: `aria-label` on each social link (e.g., "LinkedIn profile", "GitHub profile", "Send email")
- Background: `var(--muted)`, border-top: `var(--border)`

### 4. Create `frontend/src/components/layout/PageShell.tsx`

- Simple wrapper: renders `<Navbar />`, `<main className="flex-1">{children}</main>`, `<Footer />`
- The `flex-1` on main ensures footer stays at bottom (root layout body is `flex flex-col`)

### 5. Create placeholder pages

Create minimal `page.tsx` for each route so navigation works:
- `frontend/src/app/resume/page.tsx`
- `frontend/src/app/skills/page.tsx`
- `frontend/src/app/experience/page.tsx`
- `frontend/src/app/projects/page.tsx`
- `frontend/src/app/blog/page.tsx`
- `frontend/src/app/contact/page.tsx`

Each placeholder should render a `<div>` with the page title and "Coming soon". These will be replaced by later tasks.

### 6. Update `frontend/src/app/page.tsx`

Remove the standalone ThemeToggle — nav now handles it. Leave a minimal hero placeholder (will be fully built in task-04).

### Styling Notes

- Use `var(--background)`, `var(--foreground)`, `var(--primary)`, `var(--border)`, `var(--nav)`, `var(--nav-border)` from `globals.css`
- Tailwind utility classes for layout/spacing; CSS variables for colors
- Nav link hover: `hover:text-[var(--primary)]` or equivalent
- Mobile nav z-index must be below sticky nav but above page content
