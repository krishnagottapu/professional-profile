# Implementation Plan — Professional Career Website

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                           │
│              Next.js 14+ (App Router)                │
│                                                      │
│  Pages: Home, Resume, Skills, Experience,            │
│         Projects, Contact, Blog, Admin               │
│  Theme: next-themes (system + toggle + persist)      │
│  Animations: Framer Motion                           │
│  Editor: TipTap (admin blog/project editing)         │
│  GitHub: REST API integration                        │
└──────────────────────┬──────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────────┐
│                    BACKEND                            │
│              Spring Boot 3.x (Java 21)               │
│                                                      │
│  APIs: /api/blog, /api/projects, /api/skills,        │
│        /api/contact, /api/github, /api/auth          │
│  Auth: Spring Security (single admin, session-based) │
│  DB: H2 (embedded, file-based for persistence)       │
│  Email: Spring Mail (SMTP)                           │
└─────────────────────────────────────────────────────┘
```

---

## Task 0: Project Documentation

**Objective:** Create `context.md` and `plan.md` capturing all decisions and the implementation roadmap.

**Status:** Complete

---

## Task 1: Project Scaffolding & Monorepo Setup

**Objective:** Initialize both frontend and backend projects in a monorepo structure with build tooling verified.

**Implementation:**
- Create root structure: `/frontend` (Next.js) and `/backend` (Spring Boot)
- Initialize Next.js 14+ with App Router, TypeScript, Tailwind CSS, ESLint
- Initialize Spring Boot 3.x with Java 21, Maven
- Dependencies: Spring Web, Spring Security, Spring Data JPA, H2, Spring Mail, Validation
- Root `README.md` with setup instructions
- Verify both build independently

**Acceptance Criteria:**
- Next.js renders at localhost:3000
- Spring Boot health check responds at localhost:8080/actuator/health

---

## Task 2: Theme System (Light/Dark Toggle)

**Objective:** Dual-theme with system-default detection and persisted toggle.

**Implementation:**
- Configure `next-themes` for system preference + localStorage
- Tailwind CSS theme palettes:
  - Light: whites, subtle grays, professional blue accents
  - Dark: deep backgrounds (#0d1117), green/cyan terminal accents, monospace
- ThemeToggle component (sun/moon icon)
- CSS variables approach for seamless switching

**Acceptance Criteria:**
- Toggle switches between light and dark
- Preference persists after refresh
- Respects OS preference on first visit

---

## Task 3: Shared Layout & Navigation

**Objective:** Responsive navbar, footer, page routes, and layout shell.

**Implementation:**
- Navbar links: Home, Resume, Skills, Experience, Projects, Blog, Contact
- Mobile hamburger menu with animated open/close
- Footer with social links (LinkedIn, GitHub, Email)
- Active page highlighting
- Placeholder pages for all routes

**Acceptance Criteria:**
- All navigation links route correctly
- Mobile menu opens/closes
- Active state reflects current page

---

## Task 4: Home Page with Hero Section

**Objective:** Landing page with typing animation, intro, and CTAs.

**Implementation:**
- Typing effect cycling: "Sr. Software Engineer", "Java & Spring Expert", "Full Stack Developer", "AI Integration Specialist"
- Professional summary paragraph
- CTA buttons: "View Resume", "Contact Me"
- Framer Motion fade-in/slide-up entrance
- Avatar placeholder area
- Scroll-down indicator

**Acceptance Criteria:**
- Typing animation cycles correctly
- CTAs navigate to correct pages
- Animations trigger on load

---

## Task 5: Backend — Database Schema & Entity Layer

**Objective:** JPA entities, repositories, H2 config, and seed data.

**Implementation:**
- H2 file-based persistence (`jdbc:h2:file:./data/portfolio`)
- H2 console enabled at `/h2-console`
- Entities: BlogPost, Project, Skill, ContactMessage
- Spring Data JPA repositories
- `data.sql` seed data with skills from resume

**Acceptance Criteria:**
- Entities persist and retrieve correctly
- H2 console accessible in dev
- Seed data loads on startup

---

## Task 6: Backend — REST API Endpoints (Public)

**Objective:** Public REST APIs for frontend consumption.

**Endpoints:**
- `GET /api/blog` — Published posts (paginated)
- `GET /api/blog/{slug}` — Single post
- `GET /api/projects` — All projects (sorted)
- `GET /api/skills` — Skills grouped by category
- `POST /api/contact` — Submit contact message (validated)
- `GET /api/github/repos` — Cached GitHub repos proxy

**Implementation:**
- Bean Validation annotations
- Global exception handler (`@ControllerAdvice`)
- CORS configured for localhost:3000

**Acceptance Criteria:**
- Unit tests with MockMvc pass
- Validation rejects invalid submissions
- GitHub proxy returns cached data

---

## Task 7: Backend — Authentication & Admin API

**Objective:** Spring Security + admin CRUD endpoints.

**Implementation:**
- Session-based auth, credentials from env vars
- Endpoints: login, logout, me (auth check)
- Admin CRUD under `/api/admin/*`: blog, projects, skills, messages
- `/api/admin/**` requires auth; public `/api/**` open

**Acceptance Criteria:**
- Unauthenticated → 401
- Login returns session
- CRUD works for authenticated admin

---

## Task 8: Backend — Email Notification Service

**Objective:** SMTP email on contact form submission.

**Implementation:**
- Spring Mail with externalized SMTP config
- EmailService sends to admin email
- Async sending (`@Async`)
- Graceful failure — message saved regardless of email status

**Acceptance Criteria:**
- Mocked test verifies email construction
- Submission succeeds when SMTP unavailable
- Async doesn't block response

---

## Task 9: Skills Page

**Objective:** Animated progress bars with category grouping.

**Implementation:**
- Fetch from `/api/skills`
- Group by category
- Animated bars fill on scroll (Framer Motion `useInView`)
- Responsive grid: cards on desktop, stacked on mobile

**Acceptance Criteria:**
- Skills load and render grouped
- Animations trigger on scroll into view
- Loading state while fetching

---

## Task 10: Experience Page

**Objective:** Timeline with work history and education.

**Implementation:**
- Hardcoded data: Charter (2020–Present), CenturyLink (2018–2020)
- Vertical timeline: alternating left/right (desktop), stacked (mobile)
- Entries: company, role, dates, bullets, tech tags
- Scroll-triggered fade-in per entry
- Education section at bottom

**Acceptance Criteria:**
- Timeline renders all entries correctly
- Responsive on mobile and desktop
- Animations per entry on scroll

---

## Task 11: Resume Page

**Objective:** Visual summary + downloadable PDF.

**Implementation:**
- Visual layout: summary, skills highlights, experience overview
- Download button serving `/public/resume.pdf`
- Quick stats (7+ years, 30+ technologies)
- Links to Experience and Skills pages
- Print-friendly styling (`@media print`)

**Acceptance Criteria:**
- PDF download works
- Clean visual summary renders
- Print view is clean

---

## Task 12: Projects Page with GitHub Integration

**Objective:** GitHub repos + manual projects, filterable.

**Implementation:**
- Fetch from `/api/github/repos` and `/api/projects`
- Merge into filterable grid
- Filter tabs by technology
- Cards: title, description, tech tags, links
- Featured projects at top
- Scroll-triggered animations

**Acceptance Criteria:**
- GitHub repos display correctly
- Manual projects alongside
- Tech filter works
- Graceful fallback if GitHub unavailable

---

## Task 13: Blog Page (List & Detail)

**Objective:** Blog listing and post detail pages.

**Implementation:**
- Listing (`/blog`): paginated, title, excerpt, date, read-time
- Detail (`/blog/[slug]`): HTML content from TipTap
- Dynamic SEO meta tags and Open Graph
- Empty state: "Coming soon"
- Scroll-triggered entrance on listing

**Acceptance Criteria:**
- Posts fetch and display from API
- Click navigates to detail with full content
- SEO meta tags render correctly

---

## Task 14: Contact Page

**Objective:** Form, social links, resume download.

**Implementation:**
- Form: name, email, message (client-side validation)
- Submit to `POST /api/contact`, toast notification
- Social links: LinkedIn, GitHub, Email
- Download Resume button
- Frontend debounce rate limiting
- Honeypot spam prevention

**Acceptance Criteria:**
- Validation works before submission
- Success message + form clear on submit
- Social links open in new tabs

---

## Task 15: Admin Dashboard — Layout & Auth

**Objective:** Protected admin area with login and dashboard shell.

**Implementation:**
- Login page (`/admin/login`)
- Auth state: check `/api/auth/me`, redirect if unauth
- Sidebar: Dashboard, Blog Posts, Projects, Skills, Messages
- Dashboard stats: total posts, unread messages, total projects
- Logout functionality
- Protected route wrapper

**Acceptance Criteria:**
- Unauth access redirects to login
- Login redirects to dashboard
- Session persists across refresh
- Logout clears session

---

## Task 16: Admin Dashboard — Blog Management

**Objective:** Blog CRUD with TipTap editor.

**Implementation:**
- List view: title, status, date, actions
- Create/Edit: title, slug (auto-gen), TipTap editor, excerpt, publish toggle
- Delete confirmation modal
- Auto-save draft (debounced)

**Acceptance Criteria:**
- Create post appears in list
- Edit persists changes
- Delete with confirmation
- TipTap saves HTML correctly

---

## Task 17: Admin Dashboard — Projects & Skills Management

**Objective:** CRUD for projects and skills.

**Implementation:**
- Projects: list, drag-reorder, create/edit form (title, desc, tech tags, URLs, featured), delete
- Skills: grouped by category, create/edit (name, category, proficiency slider), reorder, delete

**Acceptance Criteria:**
- CRUD works end-to-end
- Sort order persists
- Category grouping correct

---

## Task 18: Admin Dashboard — Contact Messages

**Objective:** Message inbox in admin.

**Implementation:**
- List: sender, email, date, read/unread
- Expand to read full message
- Mark read/unread toggle
- Delete messages
- Unread badge in sidebar
- Sort newest first

**Acceptance Criteria:**
- Messages from contact form appear
- Read/unread updates correctly
- Delete works

---

## Task 19: SEO, Performance & Accessibility

**Objective:** Optimize for search engines, performance, accessibility.

**Implementation:**
- Next.js metadata API for titles, descriptions, OG
- JSON-LD Person schema on home
- Sitemap via `next-sitemap`
- `next/image` optimization
- Lighthouse target: 90+ all categories
- ARIA labels, keyboard nav, skip-to-content
- WCAG AA contrast for both themes

**Acceptance Criteria:**
- Unique meta per page
- Sitemap generates
- Keyboard nav works
- Both themes pass WCAG AA

---

## Task 20: Final Integration, Polish & Documentation

**Objective:** Wire together, polish, document.

**Implementation:**
- E2E flow testing
- GitHub integration with live data
- Animation timing polish
- Loading states and error boundaries
- 404 page
- README: setup, env vars, commands, architecture
- Docker Compose for full stack

**Acceptance Criteria:**
- Full flow works without errors
- Error states graceful
- Docker Compose starts both services
- README followable from scratch
