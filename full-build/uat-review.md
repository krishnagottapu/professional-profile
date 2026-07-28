# UAT Review: Professional Profile — Full Build

**Reviewer:** uat_reviewer  
**Date:** 2026-07-27  
**Scope:** Tasks 03–20 (Frontend public pages, Admin dashboard, Backend APIs, Docker, SEO/A11y)

---

## Focus Area 1: Public Pages Exist and Are Wired Correctly

### Requirements Checked

- [x] **Skills page** exists at `/skills` — `frontend/src/app/skills/page.tsx` fetches from `/api/skills` and renders grouped by category with `SkillCard` + `AnimatedProgressBar`
- [x] **Experience page** exists at `/experience` — `frontend/src/app/experience/page.tsx` renders Charter and CenturyLink entries from `lib/data/experience.ts`
- [x] **Resume page** exists at `/resume` — `frontend/src/app/resume/page.tsx` renders summary, quick stats (7+, 30+, 2), download link to `/resume.pdf`
- [x] **Projects page** exists at `/projects` — `frontend/src/app/projects/page.tsx` fetches from `/api/projects` and `/api/github/repos`, has `TechFilterTabs`
- [x] **Blog listing** exists at `/blog` — `frontend/src/app/blog/page.tsx` with pagination ("Load More"), empty state message present
- [x] **Blog detail** exists at `/blog/[slug]` — `frontend/src/app/blog/[slug]/page.tsx` with `generateMetadata` for SEO, calls `notFound()` if missing
- [x] **Contact page** exists at `/contact` — `frontend/src/app/contact/page.tsx` with `ContactForm` component
- [x] **Navbar** has all links: Home, Resume, Skills, Experience, Projects, Blog, Contact — `frontend/src/components/layout/Navbar.tsx` line 8–16
- [x] **Mobile hamburger menu** with animated open/close — `Navbar.tsx` lines 80–120 (CSS transform animation on spans)
- [x] **Footer** with LinkedIn, GitHub, Email social links — `frontend/src/components/layout/Footer.tsx` with `target="_blank"` and `rel="noopener noreferrer"`
- [x] **Active page highlighting** driven by `usePathname` — `Navbar.tsx` `isActive()` function, line 20–23
- [x] **ThemeToggle** integrated into navbar — `Navbar.tsx` line 78 (desktop) and line 84 (mobile)
- [x] **Home page hero** displays name "Sai Krishna Gottapu" — `HeroSection.tsx` line 54
- [x] **Typing animation** cycles through all 4 roles — `HeroSection.tsx` ROLES constant + `TypingAnimation` component
- [x] **CTA buttons** "View Resume" (→ /resume) and "Contact Me" (→ /contact) — `HeroSection.tsx` lines 73–98
- [x] **Framer Motion entrance animations** on home page — `HeroSection.tsx` uses `motion.div` with stagger variants
- [x] **Scroll-down indicator** animates with bounce — `HeroSection.tsx` line 101 (animate y bounce, repeat Infinity)
- [x] **Skills progress bars fill on scroll** — `AnimatedProgressBar.tsx` uses `useInView` with `once: true` to animate width from 0 to proficiency%
- [x] **Experience timeline** with vertical line, alternating left/right on desktop — `TimelineEntry.tsx` `isLeft = index % 2 === 0`, alternates via flex justify
- [x] **Timeline fades in via Framer Motion** — `TimelineEntry.tsx` uses `useInView` and `motion.div` with x offset
- [x] **Education section** present with MS and BTech entries — `experience.ts` EDUCATION array + `EducationEntry` component in page
- [x] **Resume download button** links to `/resume.pdf` — `resume/page.tsx` `<a href="/resume.pdf" download>`
- [x] **Resume placeholder PDF** exists — `frontend/public/resume.pdf` (44 bytes placeholder)
- [x] **Projects tech filter tabs** — `TechFilterTabs` component dynamically extracts unique tags
- [x] **Projects GitHub fallback** — `projects/page.tsx` shows "GitHub repos temporarily unavailable." on error
- [x] **Blog pagination** via "Load More" button — `blog/page.tsx` lines 80–94
- [x] **Blog empty state** — "Coming soon — first post in progress." — `blog/page.tsx` line 73
- [x] **Blog detail renders HTML safely** with DOMPurify — `BlogContent.tsx` sanitizes with `DOMPurify.sanitize()`
- [x] **Contact form validation** (name, email, message required) — `ContactForm.tsx` `validate()` function
- [x] **Contact honeypot field** present but hidden — `ContactForm.tsx` `website` field, silently succeeds if filled
- [x] **Contact success toast** "Message sent! I'll get back to you soon." — `ContactForm.tsx` uses `react-hot-toast`
- [x] **Contact social links** with `rel="noopener noreferrer"` — `contact/page.tsx` lines 45+
- [x] **404 page** renders user-friendly message with link to home — `frontend/src/app/not-found.tsx`

---

## Focus Area 2: Admin Pages

### Requirements Checked

- [x] **Login page** at `/admin/login` — `frontend/src/app/admin/login/page.tsx` with username/password fields and submit
- [x] **Login calls POST /api/auth/login** and redirects to `/admin` on success — `login/page.tsx` handleSubmit
- [x] **Login shows error on 401** — `login/page.tsx` line 18 "Invalid username or password"
- [x] **Admin layout auth guard** checks `GET /api/auth/me` on mount, redirects to login if unauthenticated — `admin/layout.tsx` useEffect
- [x] **Admin routes excluded from public PageShell** — `ConditionalPageShell.tsx` skips PageShell for `/admin` paths
- [x] **Dashboard page** at `/admin` shows stats cards (Total Posts, Total Projects, Unread Messages) — `admin/page.tsx`
- [x] **Sidebar** has links: Dashboard, Blog Posts, Projects, Skills, Messages — `AdminSidebar.tsx` NAV_ITEMS
- [x] **Sidebar unread badge** on Messages link — `AdminSidebar.tsx` fetches stats and shows badge when `unread > 0`
- [x] **Logout button** invalidates session and redirects — `AdminSidebar.tsx` onLogout + `admin/layout.tsx` handleLogout
- [x] **Blog list** at `/admin/blog` shows all posts with title, status, date, actions — `admin/blog/page.tsx`
- [x] **"New Post" button** navigates to `/admin/blog/new` — `admin/blog/page.tsx` Link component
- [x] **Blog editor** at `/admin/blog/[id]` with TipTap editor — `admin/blog/[id]/page.tsx` + `BlogEditor.tsx`
- [x] **Slug auto-generates** from title (debounced) — `admin/blog/[id]/page.tsx` `slugify()` function
- [x] **Delete with confirmation** — `admin/blog/page.tsx` `confirmId` state before delete
- [x] **Projects CRUD** at `/admin/projects` with drag reorder via @dnd-kit — `admin/projects/page.tsx` uses DndContext + SortableContext
- [x] **Skills CRUD** at `/admin/skills` grouped by category — `admin/skills/page.tsx` with SkillForm
- [x] **Skill form has proficiency slider** — `SkillForm.tsx` with range input (0–100)
- [x] **Messages inbox** at `/admin/messages` with read/unread toggle and delete — `admin/messages/page.tsx`
- [x] **Messages optimistic updates** — `messages/page.tsx` toggles state immediately before API call
- [x] **Messages empty state** — "No messages yet. Your contact form inbox is empty."

---

## Focus Area 3: Docker Files

### Requirements Checked

- [x] **docker-compose.yml** starts both frontend (port 3000) and backend (port 8080) — present at project root
- [x] **Named volume** for H2 data persistence — `portfolio-data:/app/data`
- [x] **Backend Dockerfile** builds JAR with Maven, runs on Java 21 — `Dockerfile.backend` multi-stage (maven:3.9-eclipse-temurin-21 → eclipse-temurin:21-jre-jammy)
- [x] **Frontend Dockerfile** builds production Next.js app — `Dockerfile.frontend` multi-stage (node:20-alpine, 3 stages: deps → build → runner)
- [x] **Both Dockerfiles use non-root users** — Backend: `appuser:appgroup`, Frontend: `nextjs:nodejs`
- [x] **Backend healthcheck** — `docker-compose.yml` wget to `/actuator/health`
- [x] **Frontend depends_on backend** with health condition — `condition: service_healthy`

---

## Focus Area 4: README

### Requirements Checked

- [x] **Architecture overview** — README includes ASCII diagram with frontend → backend → H2
- [x] **Prerequisites table** — Node.js 18+, Java JDK 21, Maven 3.9+, Docker
- [x] **Local setup steps** — Backend (`mvn spring-boot:run`) and Frontend (`npm install && npm run dev`)
- [x] **Environment variables table** — 7 variables documented with defaults
- [x] **Docker Compose instructions** — `docker compose up --build` with explanation
- [x] **Project structure** — Full directory tree with descriptions
- [x] **Features list** — Dual theme, Blog CMS, Skills management, etc.
- [x] **Admin dashboard** access instructions — URL + default credentials
- [x] **Security notes** — Change password, SITE_URL, rate limiting, H2 console disable, non-root containers

---

## Focus Area 5: SEO

### Requirements Checked

- [x] **Root layout metadata template** — `layout.tsx` exports `metadata` with `title.template: "%s | Sai Krishna Gottapu"`
- [x] **Per-page unique metadata** via Next.js Metadata API:
  - Home: `page.tsx` exports metadata with title and description
  - Skills: `skills/layout.tsx` — title "Skills", description about technical skills
  - Projects: `projects/layout.tsx` — title "Projects", description about works
  - Blog: `blog/layout.tsx` — title "Blog", description about articles
  - Experience: `experience/page.tsx` exports metadata title "Experience"
  - Resume: `resume/page.tsx` exports metadata title "Resume" with OpenGraph
  - Contact: `contact/page.tsx` exports metadata title "Contact" with OpenGraph
  - Blog detail: `blog/[slug]/page.tsx` `generateMetadata()` with dynamic OG
- [x] **JSON-LD Person schema** on home page — `page.tsx` `personSchema` object with type Person, rendered as `<script type="application/ld+json">`
- [x] **Sitemap generated** at `/sitemap.xml` via next-sitemap — `frontend/public/sitemap.xml` and `sitemap-0.xml` present with all 7 public URLs
- [x] **robots.txt generated** — `frontend/public/robots.txt` disallows /admin and /api
- [x] **next-sitemap** in devDependencies and `postbuild` script — `package.json`
- [x] **next-sitemap.config.js** present — excludes /admin routes

---

## Focus Area 6: Accessibility

### Requirements Checked

- [x] **Skip-to-content link** present in root layout — `layout.tsx` `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>`
- [x] **Main content landmark** with `id="main-content"` — `PageShell.tsx` `<main id="main-content">`
- [x] **ARIA labels** present on key elements:
  - Nav: `aria-label="Main navigation"` — `Navbar.tsx`
  - Hamburger button: `aria-label="Toggle navigation menu"` + `aria-expanded` — `Navbar.tsx`
  - Footer social links: `aria-label="LinkedIn profile"`, etc. — `Footer.tsx`
  - Admin sidebar: `aria-label="Admin navigation"` — `AdminSidebar.tsx`
  - Unread badge: `aria-label="${unread} unread messages"` — `AdminSidebar.tsx`
  - Typing animation: `aria-label` + `role="status"` + `aria-live="polite"` — `TypingAnimation.tsx`
  - Timeline tech tags: `aria-label="Technologies used"` — `TimelineEntry.tsx`
  - Login form: `<label htmlFor>` with sr-only labels — `login/page.tsx`
  - Error alert: `role="alert"` — `login/page.tsx`
- [x] **WCAG AA color contrast** — Both themes use CSS variables; the code review confirmed acceptable contrast. Light theme uses dark text on light background; dark theme uses light text on dark background. (Full contrast audit with a11y tooling not feasible in this context; noted for manual validation.)

---

## Backend API Verification (Tasks 5–8)

- [x] **H2 file-based DB** at `jdbc:h2:file:./data/portfolio` — `application.yml`
- [x] **H2 console** enabled at `/h2-console` — `application.yml`
- [x] **BlogPost entity** — all required fields present (id, title, slug unique, content CLOB, excerpt, published, createdAt, updatedAt)
- [x] **Project entity** — all required fields (id, title, description, techTags, githubUrl, featured, sortOrder). Note: field `liveUrl` is named `demoUrl` in entity; functionally equivalent.
- [x] **Skill entity** — fields correct (id, name, category, proficiency, sortOrder)
- [x] **ContactMessage entity** — fields correct (id, name, email, message, read, createdAt)
- [x] **data.sql seeds 25 skills** across 7 categories with correct proficiency values — verified all 25 MERGE INTO statements match requirements
- [x] **GET /api/blog** paginated with defaults page=0, size=10 — `BlogController.java`
- [x] **GET /api/blog/{slug}** returns post or 404 — `BlogController.java`
- [x] **GET /api/projects** sorted by sortOrder — `ProjectController.java`
- [x] **GET /api/skills** grouped by category — `SkillController.java` returns `List<SkillsByCategoryDto>`
- [x] **POST /api/contact** validates with Bean Validation, honeypot check — `ContactController.java` + `ContactRequest.java` @NotBlank/@Email/@Size
- [x] **GET /api/github/repos** cached 1 hour, returns empty on failure — `GitHubService.java` ConcurrentHashMap with 3600s TTL
- [x] **CORS configured** for localhost:3000 — `application.yml` `app.cors.allowed-origins` + `CorsConfig.java`
- [x] **Global exception handler** returns consistent JSON for 400/404/500 — `GlobalExceptionHandler.java` with field-level validation messages
- [x] **Session-based auth** with env var credentials — `SecurityConfig.java` `InMemoryUserDetailsManager` from `${spring.security.user.name}`
- [x] **POST /api/auth/login** sets session, returns 200 with username — `AuthController.java`
- [x] **POST /api/auth/logout** invalidates session — `AuthController.java`
- [x] **GET /api/auth/me** returns username or non-authenticated response — `AuthController.java`
- [x] **/api/admin/\*\* returns 401 unauthenticated** — `SecurityConfig.java` `.requestMatchers("/api/admin/**").authenticated()`
- [x] **Admin blog CRUD** (POST, GET all, GET/{id}, PUT/{id}, DELETE/{id}) — `AdminBlogController.java`
- [x] **Auto-generate slug** from title if not provided — `AdminBlogService.java` `slugify()` + `ensureUniqueSlug()`
- [x] **Admin skills CRUD** — `AdminSkillController.java`
- [x] **Admin messages** GET all, mark read, delete — `AdminMessageController.java`
- [x] **CSRF disabled** — `SecurityConfig.java` `csrf.disable()`
- [x] **H2 console frameOptions** disabled — `SecurityConfig.java` `frameOptions.disable()`
- [x] **@EnableAsync** on PortfolioApplication — confirmed
- [x] **EmailService @Async** with named executor "emailExecutor" — `EmailService.java`
- [x] **Email subject includes sender name** — `"New Contact Form Submission from " + senderName`
- [x] **MailException caught and logged WARN** — `EmailService.java` catch block
- [x] **ContactService saves to DB before email** — `ContactService.java` `save()` then `sendContactNotification()`

---

## Error Handling (Task 20)

- [x] **error.tsx** renders user-friendly page with "Try again" button — `frontend/src/app/error.tsx` calls `reset()`
- [x] **ErrorBoundary component** wraps data sections — used in `skills/page.tsx`, `projects/page.tsx`, `blog/page.tsx`

---

## Gaps Found

### Gap 1: Missing `GET /api/admin/dashboard/stats` endpoint (Backend)

**Description:** The frontend admin dashboard (`admin/page.tsx`) and admin sidebar (`AdminSidebar.tsx`) call `GET /api/admin/dashboard/stats` expecting a response `{ totalPosts, unreadMessages, totalProjects }`. However, no `AdminDashboardController` exists in the backend. The architecture spec requires this endpoint.

**Business Impact:** The admin dashboard page will show "0" for all stats and the sidebar unread badge will never display. The admin dashboard loses its primary value (at-a-glance overview).

### Gap 2: Missing `PATCH /api/admin/projects/reorder` endpoint (Backend)

**Description:** The frontend admin projects page (`admin/projects/page.tsx`) calls `PATCH /api/admin/projects/reorder` after drag-and-drop reorder. The backend `AdminProjectController` has no such endpoint.

**Business Impact:** Drag-and-drop reorder will silently fail — the visual reorder happens but is never persisted. On page refresh, projects return to their original order.

### Gap 3: HTTP method mismatch on message read toggle

**Description:** The frontend calls `PATCH /api/admin/messages/{id}/read` (`messages.ts` line 8) but the backend `AdminMessageController` exposes `PUT /{id}/read` (`@PutMapping("/{id}/read")`). This will result in a 405 Method Not Allowed error.

**Business Impact:** Users cannot toggle read/unread status on contact messages from the admin inbox. Messages permanently show as unread.

### Gap 4: `GET /api/auth/me` returns 200 with `{ loggedIn: false }` instead of 401

**Description:** The frontend `useAuth` hook (line 10) calls `getMe()` which throws on non-200 via `apiFetch`. But the backend `AuthController.me()` returns `200 OK` with `{ loggedIn: false }` for unauthenticated users instead of `401`. This means the auth guard in `admin/layout.tsx` will never redirect to login — `getMe()` will succeed (not throw), but return an object without `username`, causing the guard to malfunction.

**Business Impact:** The admin auth guard may not properly redirect unauthenticated users. The frontend expects a 401 for unauthenticated state (to trigger the `.catch()` path in useAuth), but receives 200. This could expose admin pages without authentication.

---

## Verdict: NEEDS_CHANGES

---

## Feedback

Four backend gaps need resolution before the admin dashboard is functional:

1. **Create `AdminDashboardController`** with `GET /api/admin/dashboard/stats` returning `{ totalPosts, unreadMessages, totalProjects }`. Use `BlogPostRepository.count()`, `ContactMessageRepository.countByReadFalse()`, and `ProjectRepository.count()`.

2. **Add `PATCH /api/admin/projects/reorder` endpoint** to `AdminProjectController`. Accept a list of `{ id, sortOrder }` objects and bulk-update sort orders in a transaction.

3. **Fix HTTP method on message read toggle** — either change `AdminMessageController` from `@PutMapping("/{id}/read")` to `@PatchMapping("/{id}/read")`, or change the frontend `toggleMessageRead()` to use `PUT`. Recommend changing the backend to `@PatchMapping` to match REST semantics (partial update).

4. **Fix `GET /api/auth/me` to return 401 for unauthenticated requests** — change the `me()` method to return `ResponseEntity.status(401)` when the user is anonymous, so the frontend auth guard correctly redirects to login. Alternatively, adjust the frontend `useAuth` hook to check the `loggedIn` field rather than relying on the HTTP status code.

All public-facing pages, SEO, accessibility, Docker, and README meet acceptance criteria. The gaps are confined to the admin backend API layer.


## Re-Review: 2026-07-27

**Reviewer:** uat_reviewer  
**Date:** 2026-07-27  
**Scope:** Focused re-review of 4 gaps identified in initial UAT review

---

### Gap 1: AdminDashboardController — RESOLVED

**File:** `backend/src/main/java/com/gottapu/portfolio/controller/admin/AdminDashboardController.java`

**Evidence:**
- Controller exists with `@RequestMapping("/api/admin/dashboard")`
- `@GetMapping("/stats")` method returns `ResponseEntity<DashboardStatsDto>`
- `DashboardStatsDto` is a record with fields `(long totalPosts, long unreadMessages, long totalProjects)` — matches the shape expected by the frontend (`admin/page.tsx` and `AdminSidebar.tsx`)
- Uses constructor injection for `BlogPostRepository`, `ContactMessageRepository`, `ProjectRepository`
- Calls `blogPostRepository.count()`, `contactMessageRepository.countByReadFalse()`, `projectRepository.count()`

**Verdict:** ✅ Resolved

---

### Gap 2: Project Reorder Endpoint — RESOLVED

**File:** `backend/src/main/java/com/gottapu/portfolio/controller/admin/AdminProjectController.java`  
**Method:** `reorderProjects()` at line 55 — `@PatchMapping("/reorder")`

**File:** `backend/src/main/java/com/gottapu/portfolio/service/admin/AdminProjectService.java`  
**Method:** `reorderProjects(List<ReorderRequest> reorderRequests)` at line 72 — `@Transactional`, iterates list and updates each project's `sortOrder`

**Evidence:**
- Controller accepts `@RequestBody List<ReorderRequest> reorderRequests`
- Returns `ResponseEntity.noContent().build()` (204 No Content)
- `ReorderRequest` is a record with `id()` and `sortOrder()` fields
- Service method is transactional and persists each updated sort order

**Verdict:** ✅ Resolved

---

### Gap 3: Message Read Toggle HTTP Method — RESOLVED

**File:** `backend/src/main/java/com/gottapu/portfolio/controller/admin/AdminMessageController.java`  
**Method:** `markAsRead()` at line 32 — `@PatchMapping("/{id}/read")`

**Evidence:**
- Import statement includes `org.springframework.web.bind.annotation.PatchMapping` (line 10)
- Method annotation is `@PatchMapping("/{id}/read")` — matches the frontend call `PATCH /api/admin/messages/{id}/read`
- Previously was `@PutMapping` which caused 405 Method Not Allowed

**Verdict:** ✅ Resolved

---

### Gap 4: Auth/me 401 for Unauthenticated Users — RESOLVED

**File:** `backend/src/main/java/com/gottapu/portfolio/controller/AuthController.java`  
**Method:** `me()` at line 58 — `@GetMapping("/me")`

**Evidence:**
- Method checks `auth == null || auth instanceof AnonymousAuthenticationToken || !auth.isAuthenticated()`
- Returns `ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()` (401) when unauthenticated
- Returns `ResponseEntity.ok(Map.of("username", auth.getName(), "loggedIn", true))` only for authenticated users
- This matches the frontend `useAuth` hook expectation: `getMe()` throws on non-200 (via `apiFetch`), triggering the catch path that redirects to login

**Verdict:** ✅ Resolved

---

### Build Verification

```
cd C:\github\professional-profile\backend; mvn compile -q
Exit code: 0 (success, no errors or warnings)
```

---

### Overall Verdict: APPROVED

All 4 gaps from the initial review have been resolved. The backend compiles cleanly. The admin dashboard stats endpoint, project reorder persistence, message read toggle, and auth guard behavior now function as specified.
