# Architecture — Professional Career Website

**Project:** professional-profile  
**Date:** 2026-07-27  
**Status:** Approved for implementation

---

## 1. System Overview

```
┌───────────────────────────────────────────────────────────┐
│                     BROWSER CLIENT                         │
│                                                           │
│  Next.js 14+ (App Router) — localhost:3000                │
│  TypeScript · Tailwind CSS · Framer Motion · TipTap       │
│                                                           │
│  Public Pages:   / /resume /skills /experience            │
│                  /projects /blog /blog/[slug] /contact    │
│  Admin Pages:    /admin/login /admin /admin/blog          │
│                  /admin/projects /admin/skills /admin/messages│
└──────────────────────────┬────────────────────────────────┘
                           │ REST API (JSON over HTTP)
                           │ CORS: http://localhost:3000
┌──────────────────────────▼────────────────────────────────┐
│                  SPRING BOOT 3.x BACKEND                   │
│                                                           │
│  localhost:8080                                           │
│                                                           │
│  Public:   /api/blog  /api/projects  /api/skills          │
│            /api/contact  /api/github/repos                │
│  Auth:     /api/auth/login  /api/auth/logout /api/auth/me │
│  Admin:    /api/admin/**  (session-required)              │
│                                                           │
│  Spring Security · Spring Data JPA · Spring Mail          │
│  Async Email (@EnableAsync)                               │
└──────────────────────────┬────────────────────────────────┘
                           │ JDBC
┌──────────────────────────▼────────────────────────────────┐
│                     H2 DATABASE                            │
│                                                           │
│  jdbc:h2:file:./data/portfolio  (file-based persistence)  │
│  Tables: blog_post, project, skill, contact_message       │
└───────────────────────────────────────────────────────────┘
                           │ HTTP (cached)
┌──────────────────────────▼────────────────────────────────┐
│               GITHUB PUBLIC API (external)                 │
│                                                           │
│  https://api.github.com/users/krishnagottapu/repos        │
│  Cached in-memory (ConcurrentHashMap, 1-hour TTL)         │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Backend Package Structure

```
backend/src/main/java/com/gottapu/portfolio/
├── PortfolioApplication.java          # @SpringBootApplication, @EnableAsync
│
├── config/
│   ├── SecurityConfig.java            # Spring Security, CORS, session setup
│   ├── WebConfig.java                 # CORS registration, static resource config
│   └── AsyncConfig.java               # ThreadPoolTaskExecutor configuration
│
├── entity/
│   ├── BlogPost.java                  # id, title, slug, content, excerpt, published, createdAt, updatedAt
│   ├── Project.java                   # id, title, description, techTags, githubUrl, liveUrl, featured, sortOrder
│   ├── Skill.java                     # id, name, category, proficiency (0-100), sortOrder
│   └── ContactMessage.java            # id, name, email, message, read, createdAt
│
├── repository/
│   ├── BlogPostRepository.java        # findBySlug, findAllByPublished
│   ├── ProjectRepository.java         # findAllByOrderBySortOrderAsc
│   ├── SkillRepository.java           # findAllByOrderByCategoryAscSortOrderAsc
│   └── ContactMessageRepository.java  # findAllByOrderByCreatedAtDesc, countByReadFalse
│
├── dto/
│   ├── BlogPostDto.java               # Response DTO (no content in list view)
│   ├── BlogPostDetailDto.java         # Full post with content
│   ├── ProjectDto.java
│   ├── SkillDto.java
│   ├── SkillsByCategoryDto.java       # { category, skills[] }
│   ├── ContactMessageDto.java         # Inbound request DTO (with validation)
│   ├── ContactMessageResponseDto.java # Stored message with id/read status
│   ├── AdminBlogPostDto.java          # Create/update request DTO
│   ├── AdminProjectDto.java           # Create/update request DTO
│   ├── AdminSkillDto.java             # Create/update request DTO
│   ├── LoginRequest.java              # username, password
│   ├── DashboardStatsDto.java         # totalPosts, unreadMessages, totalProjects
│   └── GitHubRepoDto.java             # Projection of GitHub API response
│
├── controller/
│   ├── BlogController.java            # GET /api/blog, GET /api/blog/{slug}
│   ├── ProjectController.java         # GET /api/projects
│   ├── SkillController.java           # GET /api/skills
│   ├── ContactController.java         # POST /api/contact
│   ├── GitHubController.java          # GET /api/github/repos
│   ├── AuthController.java            # POST /api/auth/login, logout, GET /api/auth/me
│   └── admin/
│       ├── AdminBlogController.java   # CRUD /api/admin/blog/**
│       ├── AdminProjectController.java# CRUD /api/admin/projects/**
│       ├── AdminSkillController.java  # CRUD /api/admin/skills/**
│       ├── AdminMessageController.java# GET/PATCH/DELETE /api/admin/messages/**
│       └── AdminDashboardController.java # GET /api/admin/dashboard/stats
│
├── service/
│   ├── BlogService.java
│   ├── ProjectService.java
│   ├── SkillService.java
│   ├── ContactService.java
│   ├── GitHubService.java             # HTTP client + in-memory cache
│   └── EmailService.java              # @Async email sending
│
└── exception/
    ├── GlobalExceptionHandler.java    # @ControllerAdvice, maps exceptions to HTTP responses
    ├── ResourceNotFoundException.java # 404 scenarios
    └── ValidationException.java       # 400 scenarios (custom validation failures)
```

### Data Models (Entity Details)

#### BlogPost
```
id          BIGINT PK AUTO_INCREMENT
title       VARCHAR(255) NOT NULL
slug        VARCHAR(255) UNIQUE NOT NULL
content     CLOB                        -- TipTap HTML
excerpt     VARCHAR(500)
published   BOOLEAN DEFAULT FALSE
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

#### Project
```
id          BIGINT PK AUTO_INCREMENT
title       VARCHAR(255) NOT NULL
description TEXT
tech_tags   VARCHAR(500)                -- comma-separated list
github_url  VARCHAR(500)
live_url    VARCHAR(500)
featured    BOOLEAN DEFAULT FALSE
sort_order  INT DEFAULT 0
```

#### Skill
```
id          BIGINT PK AUTO_INCREMENT
name        VARCHAR(100) NOT NULL
category    VARCHAR(100) NOT NULL
proficiency INT NOT NULL                -- 0 to 100
sort_order  INT DEFAULT 0
```

#### ContactMessage
```
id          BIGINT PK AUTO_INCREMENT
name        VARCHAR(255) NOT NULL
email       VARCHAR(255) NOT NULL
message     TEXT NOT NULL
read        BOOLEAN DEFAULT FALSE
created_at  TIMESTAMP
```

---

## 3. Frontend Directory Structure

```
frontend/src/
├── app/                               # Next.js App Router
│   ├── layout.tsx                     # Root layout (exists — ThemeProvider)
│   ├── page.tsx                       # Home / (exists — will be replaced Task 4)
│   ├── globals.css                    # Global styles (exists — theme vars)
│   ├── resume/
│   │   └── page.tsx
│   ├── skills/
│   │   └── page.tsx
│   ├── experience/
│   │   └── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx                   # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx               # Blog detail (generateMetadata)
│   ├── contact/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx                 # Admin shell with sidebar + auth guard
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── page.tsx                   # Dashboard stats
│   │   ├── blog/
│   │   │   ├── page.tsx               # Blog list
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Blog editor
│   │   ├── projects/
│   │   │   └── page.tsx
│   │   ├── skills/
│   │   │   └── page.tsx
│   │   └── messages/
│   │       └── page.tsx
│   ├── not-found.tsx                  # 404 page
│   └── error.tsx                      # Global error boundary
│
├── components/
│   ├── ThemeProvider.tsx              # EXISTS — next-themes wrapper
│   ├── ThemeToggle.tsx                # EXISTS — sun/moon toggle
│   ├── layout/
│   │   ├── Navbar.tsx                 # Responsive navbar with hamburger
│   │   ├── Footer.tsx                 # Social links footer
│   │   └── PageShell.tsx             # Navbar + Footer wrapper (used in root layout)
│   ├── home/
│   │   ├── HeroSection.tsx            # Typing animation + CTAs
│   │   └── TypingAnimation.tsx        # Cycles through role titles
│   ├── skills/
│   │   ├── SkillCard.tsx
│   │   └── AnimatedProgressBar.tsx    # Fills on scroll via useInView
│   ├── experience/
│   │   ├── TimelineEntry.tsx
│   │   └── EducationCard.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   └── TechFilterTabs.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   └── BlogContent.tsx            # Renders TipTap HTML safely
│   ├── contact/
│   │   └── ContactForm.tsx            # Validated form with honeypot
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── BlogEditor.tsx             # TipTap integration
│   │   ├── ProjectForm.tsx
│   │   ├── SkillForm.tsx
│   │   └── MessageRow.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
│
├── hooks/
│   ├── useAuth.ts                     # Checks /api/auth/me, exposes user/logout
│   ├── useApi.ts                      # Generic fetch wrapper with loading/error state
│   ├── useDebounce.ts
│   └── useInView.ts                   # Intersection observer (scroll animations)
│
├── lib/
│   ├── api/
│   │   ├── client.ts                  # Base fetch config (baseURL, credentials: include)
│   │   ├── blog.ts                    # getBlogPosts, getBlogPost, admin CRUD
│   │   ├── projects.ts                # getProjects, admin CRUD
│   │   ├── skills.ts                  # getSkills, admin CRUD
│   │   ├── contact.ts                 # submitContact
│   │   ├── github.ts                  # getGitHubRepos
│   │   └── auth.ts                    # login, logout, getMe
│   ├── data/
│   │   ├── experience.ts              # Hardcoded work history + education
│   │   └── resume.ts                  # Hardcoded resume summary + stats
│   └── utils/
│       ├── formatDate.ts
│       ├── readTime.ts
│       └── slugify.ts
│
└── types/
    ├── blog.ts
    ├── project.ts
    ├── skill.ts
    ├── contact.ts
    └── github.ts
```

---

## 4. Full API Contract Table

### Public Endpoints (no auth required)

| Method | Path | Auth | Request Body | Response | Notes |
|--------|------|------|--------------|----------|-------|
| GET | /api/blog | No | — | `{ content: BlogPostDto[], page, size, totalElements, totalPages }` | Only published posts; default page=0, size=10 |
| GET | /api/blog/{slug} | No | — | `BlogPostDetailDto` | 404 if not found or not published |
| GET | /api/projects | No | — | `ProjectDto[]` | Sorted by sort_order ASC |
| GET | /api/skills | No | — | `{ category: string, skills: SkillDto[] }[]` | Grouped by category |
| POST | /api/contact | No | `{ name, email, message, honeypot? }` | `{ id, message: "Sent" }` | honeypot must be empty; Bean Validation on name/email/message |
| GET | /api/github/repos | No | — | `GitHubRepoDto[]` | Cached 1 hour; returns [] on GitHub API failure |

### Auth Endpoints

| Method | Path | Auth | Request Body | Response | Notes |
|--------|------|------|--------------|----------|-------|
| POST | /api/auth/login | No | `{ username, password }` | `{ username }` | Sets HttpOnly session cookie; 401 on bad creds |
| POST | /api/auth/logout | Yes | — | `{ message: "Logged out" }` | Invalidates session |
| GET | /api/auth/me | No | — | `{ username }` or 401 | Used by frontend to check session |

### Admin Endpoints (all require session authentication → 401 if unauthenticated)

| Method | Path | Auth | Request Body | Response | Notes |
|--------|------|------|--------------|----------|-------|
| GET | /api/admin/dashboard/stats | Yes | — | `{ totalPosts, unreadMessages, totalProjects }` | |
| GET | /api/admin/blog | Yes | — | `BlogPostDto[]` | All posts (published + draft) |
| POST | /api/admin/blog | Yes | `AdminBlogPostDto` | `BlogPostDetailDto` | Auto-generate slug from title if not provided |
| GET | /api/admin/blog/{id} | Yes | — | `BlogPostDetailDto` | |
| PUT | /api/admin/blog/{id} | Yes | `AdminBlogPostDto` | `BlogPostDetailDto` | |
| DELETE | /api/admin/blog/{id} | Yes | — | 204 No Content | |
| GET | /api/admin/projects | Yes | — | `ProjectDto[]` | All projects |
| POST | /api/admin/projects | Yes | `AdminProjectDto` | `ProjectDto` | |
| GET | /api/admin/projects/{id} | Yes | — | `ProjectDto` | |
| PUT | /api/admin/projects/{id} | Yes | `AdminProjectDto` | `ProjectDto` | |
| DELETE | /api/admin/projects/{id} | Yes | — | 204 No Content | |
| PATCH | /api/admin/projects/reorder | Yes | `[{ id, sortOrder }]` | 200 OK | Bulk sort order update |
| GET | /api/admin/skills | Yes | — | `SkillDto[]` | All skills, flat list |
| POST | /api/admin/skills | Yes | `AdminSkillDto` | `SkillDto` | |
| GET | /api/admin/skills/{id} | Yes | — | `SkillDto` | |
| PUT | /api/admin/skills/{id} | Yes | `AdminSkillDto` | `SkillDto` | |
| DELETE | /api/admin/skills/{id} | Yes | — | 204 No Content | |
| GET | /api/admin/messages | Yes | — | `ContactMessageResponseDto[]` | Sorted newest first |
| GET | /api/admin/messages/{id} | Yes | — | `ContactMessageResponseDto` | |
| PATCH | /api/admin/messages/{id}/read | Yes | `{ read: boolean }` | `ContactMessageResponseDto` | Toggle read status |
| DELETE | /api/admin/messages/{id} | Yes | — | 204 No Content | |

### DTO Shapes

```
BlogPostDto (list view):
  { id, title, slug, excerpt, published, createdAt, updatedAt }

BlogPostDetailDto (detail/editor):
  { id, title, slug, content, excerpt, published, createdAt, updatedAt }

AdminBlogPostDto (create/update):
  { title: required, slug?, content, excerpt, published: boolean }

ProjectDto:
  { id, title, description, techTags: string[], githubUrl, liveUrl, featured, sortOrder }

AdminProjectDto:
  { title: required, description, techTags: string[], githubUrl, liveUrl, featured: boolean, sortOrder: int }

SkillDto:
  { id, name, category, proficiency, sortOrder }

AdminSkillDto:
  { name: required, category: required, proficiency: 0-100 required, sortOrder: int }

ContactMessageDto (inbound):
  { name: @NotBlank, email: @Email @NotBlank, message: @NotBlank @Size(max=2000), honeypot?: string }

ContactMessageResponseDto:
  { id, name, email, message, read, createdAt }

LoginRequest:
  { username: required, password: required }

DashboardStatsDto:
  { totalPosts: long, unreadMessages: long, totalProjects: long }

GitHubRepoDto:
  { id, name, description, htmlUrl, language, stargazersCount, forksCount, topics: string[] }
```

### Error Response Shape

All errors return:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Human-readable description",
  "timestamp": "2026-07-27T12:00:00Z"
}
```

Validation errors (400) include:
```json
{
  "status": 400,
  "error": "Validation Failed",
  "fields": { "email": "must be a valid email", "name": "must not be blank" },
  "timestamp": "..."
}
```

---

## 5. Security Design

### Spring Security Configuration

- **Session-based auth** using `HttpSessionSecurityContextRepository`
- **Credentials** from environment variables via `application.yml` (`${ADMIN_USERNAME}` / `${ADMIN_PASSWORD}`)
- **CSRF** disabled for API (stateless JSON clients; session cookie is HttpOnly, SameSite)
- **Public paths:** `GET /api/**`, `POST /api/contact`, `POST /api/auth/login`, `/h2-console/**`, `/actuator/health`
- **Protected paths:** `POST /api/auth/logout`, `/api/admin/**` → require `ROLE_ADMIN`
- **Unauthenticated → 401** (not redirect) for API paths; frontend handles redirect to `/admin/login`
- **H2 console** frames allowed in dev (frameOptions disabled for `/h2-console`)

### Frontend Auth Guard

- `useAuth` hook calls `GET /api/auth/me` on mount
- Admin layout checks auth state; redirects to `/admin/login` if 401
- `fetch` calls use `credentials: 'include'` to send session cookie
- Login form posts credentials; on success, router pushes to `/admin`

---

## 6. GitHub Proxy & Caching

- Backend fetches `https://api.github.com/users/krishnagottapu/repos?per_page=100&sort=updated`
- In-memory cache using `ConcurrentHashMap<String, CachedResponse>` with a 1-hour TTL
- On cache miss or expiry: fetch from GitHub, store response + timestamp
- On GitHub API failure (timeout, 5xx, rate limit): return cached response if available, else return empty array
- No GitHub token required (public repos, unauthenticated rate limit sufficient for personal site)

**Rationale:** Avoids GitHub rate limit (60 req/hour unauthenticated); simple in-memory cache avoids adding Redis dependency for a personal portfolio.

---

## 7. Email Service

- `EmailService.sendContactNotification(ContactMessage)` is `@Async`
- Uses `JavaMailSender` with SMTP config from `application.yml`
- On `MailException`: logs warning, does NOT propagate exception
- `ContactService.submitContact()` saves to DB first, then calls `emailService.sendNotification()` — DB save never depends on email success
- Email template: plain text with sender name, email, and message body; sent to `${ADMIN_EMAIL}`

---

## 8. Frontend Data Strategy

| Data Source | Pages | Fetch Strategy |
|-------------|-------|---------------|
| `/api/skills` | Skills page | Client-side fetch with loading state |
| `/api/projects`, `/api/github/repos` | Projects page | Client-side fetch, merged and filtered |
| `/api/blog` | Blog listing | Client-side fetch, paginated |
| `/api/blog/{slug}` | Blog detail | Can be server component (SSR for SEO) |
| Hardcoded `lib/data/experience.ts` | Experience page | Static — no API needed |
| Hardcoded `lib/data/resume.ts` | Resume page | Static — no API needed |
| `/api/contact` POST | Contact page | Client-side form submit |
| `/api/auth/me` | Admin layout | Client-side, on mount |
| `/api/admin/**` | Admin pages | Client-side CRUD |

**Blog detail** (`/blog/[slug]`) uses a server component with `generateMetadata` for correct OG tags without client-side hydration cost.

---

## 9. Key Design Decisions

### Decision 1: H2 File-Based Persistence
- **Choice:** `jdbc:h2:file:./data/portfolio` with `ddl-auto: update`
- **Rationale:** Zero-infrastructure dependency for a personal portfolio; `update` mode preserves data across restarts; `data.sql` seeds initial skills on first boot
- **Trade-off:** Not suitable for multi-instance deployment; easily swapped to PostgreSQL by changing datasource config

### Decision 2: Session-Based Auth (Not JWT)
- **Choice:** Spring Security session cookie
- **Rationale:** Single admin user, single server; no token refresh complexity; HttpOnly cookies prevent XSS token theft
- **Trade-off:** Requires sticky sessions if ever scaled horizontally; acceptable for personal portfolio

### Decision 3: Hardcoded Experience/Resume vs. CMS
- **Choice:** Experience and Resume content hardcoded in `lib/data/`
- **Rationale:** This content changes rarely and is specific to one person; putting it in a CMS adds CRUD complexity for no real benefit
- **Trade-off:** Requires code change to update experience; acceptable for sole owner

### Decision 4: In-Memory GitHub Cache (No Redis)
- **Choice:** `ConcurrentHashMap` with TTL in `GitHubService`
- **Rationale:** Keeps the stack simple; GitHub public repos rarely change within an hour; adding Redis for cache on a personal portfolio introduces unnecessary ops overhead
- **Trade-off:** Cache resets on server restart; acceptable

### Decision 5: TipTap for Blog Editor
- **Choice:** TipTap v2 rich text editor in admin
- **Rationale:** React-native, extensible, produces clean HTML; already in design decisions doc
- **Trade-off:** Adds ~100KB bundle to admin routes only (lazy loaded)

### Decision 6: Client-Side Data Fetching for Most Pages
- **Choice:** Client components with `useApi` hook for skills, projects, blog listing
- **Rationale:** Keeps Next.js server components simple; avoids ISR invalidation complexity for a portfolio; loading states provide good UX
- **Trade-off:** Slight SEO disadvantage for Skills/Projects; mitigated by Task 19 metadata additions. Blog detail remains SSR for SEO.

### Decision 7: next-sitemap for Sitemap Generation
- **Choice:** `next-sitemap` npm package
- **Rationale:** Integrates with Next.js build, auto-discovers static routes, allows dynamic blog slug injection
- **Trade-off:** Requires `postbuild` script; adds a dev dependency

---

## 10. Dependencies to Add

### Frontend (additions to existing package.json)
```json
{
  "framer-motion": "^11.0.0",
  "@tiptap/react": "^2.10.0",
  "@tiptap/starter-kit": "^2.10.0",
  "@tiptap/extension-link": "^2.10.0",
  "@tiptap/extension-image": "^2.10.0",
  "@tiptap/extension-code-block": "^2.10.0",
  "next-sitemap": "^4.2.3",
  "react-hot-toast": "^2.4.1",
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0"
}
```

### Backend (additions to existing pom.xml)
No new Maven dependencies required. All needed libraries (Spring Web, Security, Data JPA, H2, Validation, Mail, Actuator) are already in pom.xml. The GitHub proxy uses Spring's `RestTemplate` or `RestClient` (built-in to Spring Boot 3.x).

---

## 11. Task Dependency Graph

```
[task-03] Layout/Nav ──────────────────────────────────┐
[task-05] Backend Entities ────────────────────────────┤
                                                        ↓
[task-04] Home Page (← task-03) ──────────────────────┐│
[task-06] Public APIs (← task-05) ────────────────────┤│
[task-07] Auth/Admin APIs (← task-05) ────────────────┤│
[task-08] Email Service (← task-05) ──────────────────┤│
                                                        ↓↓
[task-09] Skills Page (← task-04, task-06) ────────────┐│
[task-10] Experience Page (← task-04) ─────────────────┤│
[task-11] Resume Page (← task-04) ─────────────────────┤│
[task-12] Projects Page (← task-04, task-06) ──────────┤│
[task-13] Blog Page (← task-04, task-06) ──────────────┤│
[task-14] Contact Page (← task-04, task-06) ───────────┤│
[task-15] Admin Layout (← task-07) ────────────────────┤│
                                                        ↓↓
[task-16] Admin Blog CRUD (← task-15) ─────────────────┐│
[task-17] Admin Projects/Skills (← task-15) ───────────┤│
[task-18] Admin Messages (← task-15) ──────────────────┤│
                                                        ↓↓
[task-19] SEO/A11y (← task-16, task-17, task-18) ──────┐│
[task-20] Final Integration (← task-19) ───────────────┘│
```

Parallel execution groups:
- **Group A** (immediate): task-03, task-05
- **Group B** (after A): task-04, task-06, task-07, task-08
- **Group C** (after B): task-09, task-10, task-11, task-12, task-13, task-14, task-15
- **Group D** (after C): task-16, task-17, task-18
- **Group E** (after D): task-19, task-20
