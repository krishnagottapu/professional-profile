# Project Context — Professional Career Website

**Owner:** Sai Krishna Gottapu  
**Last updated:** 2026-07-30  
**Status:** Deployed to production. Frontend on Vercel, Backend on Render.

**Live URLs:**
- Frontend: https://saikrishnagottapu.vercel.app
- Backend: https://portfolio-backend-j4xp.onrender.com

---

## What This Project Is

A full-stack personal portfolio / career website.

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion — runs on `http://localhost:3000`
- **Backend:** Spring Boot 3.4.2, Java 21, Spring Security, H2 — runs on `http://localhost:8080`
- **Database:** H2 embedded file-based (local) / H2 in-memory (production, seeded from `data.sql`)
- **Auth:** Session-based, single admin account (credentials via env vars)
- **Email:** Resend HTTP API (production) / Spring Mail SMTP (local)
- **CI/CD:** GitHub Actions (lint/test/build) + Vercel (frontend deploy) + Render (backend deploy)

---

## How to Run Locally

### Mac (first time)
```bash
# 1. Install prerequisites (Java 21, Maven, Node.js 20)
chmod +x setup-mac.sh && ./setup-mac.sh

# 2. Make start scripts executable
chmod +x start-backend.sh start-frontend.sh

# 3. Start backend in Terminal 1
./start-backend.sh

# 4. Start frontend in Terminal 2
./start-frontend.sh
```

### Windows (first time)
```bat
# Terminal 1 — backend
start-backend.bat

# Terminal 2 — frontend
start-frontend.bat
```

### URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| H2 Console | http://localhost:8080/h2-console |
| Admin Dashboard | http://localhost:3000/admin |

### Admin Credentials
- **Username:** `admin` (override with `ADMIN_USERNAME` env var)
- **Password:** `admin123` (override with `ADMIN_PASSWORD` env var)
- **Access:** Click the faint "Admin" link in the footer, or go directly to `/admin`

### H2 Console
- JDBC URL: `jdbc:h2:file:./data/portfolio`
- Username: `sa`
- Password: *(leave empty)*

---

## Project Structure

```
professional-profile/
├── frontend/                        # Next.js 14+ App Router
│   ├── src/
│   │   ├── app/                     # Pages and layouts
│   │   │   ├── layout.tsx           # Root layout (ThemeProvider, ToastProvider, skip link)
│   │   │   ├── page.tsx             # Home page (JSON-LD schema, HeroSection)
│   │   │   ├── resume/page.tsx
│   │   │   ├── skills/page.tsx
│   │   │   ├── experience/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── layout.tsx       # Blog metadata
│   │   │   │   ├── page.tsx         # Blog listing with pagination
│   │   │   │   └── [slug]/page.tsx  # Blog detail (SSR + generateMetadata)
│   │   │   ├── contact/page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx       # Auth guard + sidebar shell
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── page.tsx         # Dashboard stats
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx     # Blog list + delete
│   │   │   │   │   └── [id]/page.tsx # TipTap editor + auto-save
│   │   │   │   ├── projects/page.tsx # CRUD + dnd-kit drag reorder
│   │   │   │   ├── skills/page.tsx  # CRUD + proficiency slider
│   │   │   │   └── messages/page.tsx # Inbox + read toggle + delete
│   │   │   ├── not-found.tsx        # 404 page
│   │   │   └── error.tsx            # Global error boundary
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx       # Responsive nav, mobile hamburger, active state
│   │   │   │   ├── Footer.tsx       # Social links + discreet Admin link
│   │   │   │   ├── PageShell.tsx    # Wraps Navbar + Footer for public pages
│   │   │   │   └── ConditionalPageShell.tsx  # Skips shell for /admin/* routes
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.tsx  # Framer Motion entrance, CTA buttons
│   │   │   │   └── TypingAnimation.tsx
│   │   │   ├── skills/
│   │   │   │   ├── SkillCard.tsx
│   │   │   │   └── AnimatedProgressBar.tsx   # Fills on scroll via useInView
│   │   │   ├── experience/
│   │   │   │   ├── TimelineEntry.tsx         # Alternating L/R timeline with Framer Motion
│   │   │   │   └── EducationCard.tsx
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.tsx           # Handles manual + GitHub repo cards
│   │   │   │   └── TechFilterTabs.tsx
│   │   │   ├── blog/
│   │   │   │   ├── BlogCard.tsx
│   │   │   │   └── BlogContent.tsx           # DOMPurify sanitized HTML renderer
│   │   │   ├── contact/
│   │   │   │   └── ContactForm.tsx           # Validation, honeypot, react-hot-toast
│   │   │   ├── admin/
│   │   │   │   ├── AdminSidebar.tsx          # Nav links, unread badge, logout
│   │   │   │   ├── AdminHeader.tsx
│   │   │   │   ├── BlogEditor.tsx            # TipTap rich text editor
│   │   │   │   ├── ProjectForm.tsx
│   │   │   │   └── SkillForm.tsx
│   │   │   └── ui/
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── ErrorBoundary.tsx         # React class-based boundary
│   │   │       └── Toast.tsx                 # react-hot-toast provider
│   │   ├── hooks/
│   │   │   ├── useApi.ts            # Generic fetch hook (loading/error/refetch)
│   │   │   ├── useAuth.ts           # Calls /api/auth/me, exposes user + logout
│   │   │   └── useDebounce.ts
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts        # Base fetch (NEXT_PUBLIC_API_URL, credentials: include)
│   │   │   │   ├── auth.ts          # login, logout, getMe
│   │   │   │   ├── blog.ts          # getBlogPosts, getBlogPost
│   │   │   │   ├── projects.ts      # getProjects + admin CRUD
│   │   │   │   ├── skills.ts        # getSkills + admin CRUD
│   │   │   │   ├── contact.ts       # submitContact
│   │   │   │   ├── github.ts        # getGitHubRepos
│   │   │   │   └── messages.ts      # admin messages CRUD
│   │   │   ├── data/
│   │   │   │   ├── experience.ts    # Hardcoded Charter + CenturyLink entries
│   │   │   │   └── resume.ts        # Hardcoded summary, stats, key skills
│   │   │   └── utils/
│   │   │       ├── formatDate.ts
│   │   │       ├── readTime.ts
│   │   │       └── slugify.ts
│   │   └── types/
│   │       ├── blog.ts
│   │       ├── project.ts
│   │       ├── skill.ts
│   │       ├── contact.ts
│   │       └── github.ts
│   ├── public/
│   │   ├── resume.pdf               # PLACEHOLDER — replace with real PDF
│   │   ├── sitemap.xml              # Generated by next-sitemap on build
│   │   └── robots.txt               # Generated by next-sitemap on build
│   ├── next.config.ts               # output: standalone (for Docker)
│   ├── vitest.config.ts             # Test config (jsdom, @testing-library/react)
│   └── package.json
│
├── backend/
│   └── src/main/java/com/gottapu/portfolio/
│       ├── config/
│       │   ├── SecurityConfig.java  # Spring Security, session auth, path rules
│       │   ├── CorsConfig.java      # CorsConfigurationSource bean (GET/POST/PUT/PATCH/DELETE)
│       │   └── AsyncConfig.java     # ThreadPoolTaskExecutor for email
│       ├── controller/
│       │   ├── AuthController.java  # login/logout/me
│       │   ├── BlogController.java
│       │   ├── ProjectController.java
│       │   ├── SkillController.java
│       │   ├── ContactController.java
│       │   ├── GitHubController.java
│       │   └── admin/
│       │       ├── AdminDashboardController.java
│       │       ├── AdminBlogController.java
│       │       ├── AdminProjectController.java  # includes PATCH /reorder
│       │       ├── AdminSkillController.java
│       │       └── AdminMessageController.java  # PATCH /{id}/read
│       ├── entity/                  # BlogPost, Project, Skill, ContactMessage
│       ├── repository/              # JPA repos + countByReadFalse
│       ├── service/                 # Business logic + GitHubService (1h cache)
│       ├── dto/                     # Request/response DTOs + DashboardStatsDto
│       └── exception/               # GlobalExceptionHandler, ResourceNotFoundException
│   └── src/main/resources/
│       ├── application.yml          # DB, CORS, mail, security env vars
│       └── data.sql                 # Seeds 25 skills across 7 categories on first boot
│
├── Dockerfile.backend               # Multi-stage Maven + Java 21 JRE, non-root user
├── Dockerfile.frontend              # Multi-stage Node 20, standalone output, non-root user
├── docker-compose.yml               # Backend + frontend + named volume for H2
├── start-backend.bat                # Windows: runs mvn spring-boot:run
├── start-frontend.bat               # Windows: npm install if needed + npm run dev
├── start-backend.sh                 # Mac: same as bat
├── start-frontend.sh                # Mac: same as bat
├── setup-mac.sh                     # Mac: installs Homebrew, Java 21, Maven, Node 20
└── README.md
```

---

## Environment Variables

Set these before starting the backend to override defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `admin123` | Admin login password |
| `ADMIN_EMAIL` | `krishnagottapu4@gmail.com` | Contact form notification recipient |
| `MAIL_HOST` | `localhost` | SMTP host |
| `MAIL_PORT` | `587` | SMTP port |
| `MAIL_USERNAME` | *(empty)* | SMTP username |
| `MAIL_PASSWORD` | *(empty)* | SMTP password |

For the frontend:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Backend base URL |

---

## Key Technical Decisions

| Decision | What was chosen | Why |
|----------|----------------|-----|
| Auth | Session cookie (not JWT) | Single admin, HttpOnly cookie prevents XSS |
| Database | H2 file-based | Zero infra for personal site; swap to Postgres later by changing datasource config |
| Experience/Resume data | Hardcoded in `lib/data/` | Rarely changes; no CMS needed for static bio content |
| GitHub repos | Backend proxy with 1h in-memory cache | Avoids GitHub rate limits; no Redis needed |
| Blog editor | TipTap v2 | React-native, produces clean HTML |
| Blog content rendering | DOMPurify + `dangerouslySetInnerHTML` | Defense-in-depth even though content is admin-authored |
| Admin layout | `ConditionalPageShell` + nested layout | Prevents public navbar showing in admin without complex routing |
| CORS config | `CorsConfigurationSource` bean | Avoids conflict between `WebMvcConfigurer` and Spring Security CORS filter |

---

## API Quick Reference

### Public
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/skills` | Returns `[{ category, skills[] }]` grouped |
| GET | `/api/projects` | Sorted by `sortOrder` |
| GET | `/api/blog` | Paginated: `?page=0&size=10` |
| GET | `/api/blog/{slug}` | 404 if not found/unpublished |
| GET | `/api/github/repos` | Proxied + cached 1h |
| POST | `/api/contact` | `{ name, email, message }` — honeypot checked |

### Auth
| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/auth/login` | `{ username, password }` → sets session cookie |
| POST | `/api/auth/logout` | Invalidates session |
| GET | `/api/auth/me` | Returns `{ username }` or 401 |

### Admin (session required → 401 if not logged in)
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/admin/dashboard/stats` | `{ totalPosts, unreadMessages, totalProjects }` |
| CRUD | `/api/admin/blog/**` | POST/GET/PUT/DELETE |
| CRUD | `/api/admin/projects/**` | POST/GET/PUT/DELETE |
| PATCH | `/api/admin/projects/reorder` | `[{ id, sortOrder }]` |
| CRUD | `/api/admin/skills/**` | POST/GET/PUT/DELETE |
| GET | `/api/admin/messages` | All messages, newest first |
| PATCH | `/api/admin/messages/{id}/read` | `{ read: boolean }` |
| DELETE | `/api/admin/messages/{id}` | — |

---

## Known Bugs Fixed

| Bug | Fix applied |
|-----|------------|
| Login redirects back to login page | Chrome blocks `SameSite=None` cookies over plain HTTP. Fixed by adding a Next.js Route Handler proxy at `src/app/api/[...path]/route.ts` that forwards all `/api/*` requests server-side to `localhost:8080`, strips `SameSite` and `Secure` cookie attributes on the way back, and stores the session cookie on `localhost:3000`. Browser never makes cross-origin calls. |
| `PATCH` requests failing (reorder, read toggle) | Added `PATCH` to allowed methods in `CorsConfig` |
| Docker `NEXT_PUBLIC_API_URL` baked as `localhost` | Removed `ENV NEXT_PUBLIC_API_URL` from Dockerfile build stage — value is now set at CI/CD build time or falls back to `localhost:8080` default |

## API Proxy Architecture (Local Dev)

All frontend API calls go through a Next.js Route Handler proxy instead of directly to the backend:

```
Browser (localhost:3000)
  → GET/POST /api/**
  → src/app/api/[...path]/route.ts  (Next.js server-side)
  → http://localhost:8080/api/**     (Spring Boot backend)
  → Response + Set-Cookie forwarded back, SameSite/Secure stripped
  → Cookie stored on localhost:3000 ✓
```

This means `client.ts` uses an empty `BASE_URL` (`""`), so all API calls are relative paths on `localhost:3000`. The proxy handles forwarding cookies to the backend transparently.

---

## What Still Needs Manual Attention

- **Resume PDF** — `frontend/public/saikrishnagottapu_updated_resume.pdf` is in place ✓
- **Admin password** — Change before any public deployment (`ADMIN_PASSWORD` env var).
- **LinkedIn URL** — Updated to `www.linkedin.com/in/sai-krishna-gottapu-0710b73b8` ✓
- **GitHub username** — `krishnagottapu` used in GitHub proxy — verify it matches your actual GitHub username.
- **SMTP config** — Email notifications are configured but SMTP credentials are empty by default. Set `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD` env vars to enable email on contact form submission. The contact form saves to DB regardless — email is best-effort.
- **`SITE_URL`** — Set this in `next-sitemap.config.js` before deploying to production so sitemap URLs are correct.

---

## Continuing Development

All spec files are stored at:
```
~/.kiro/specs/professional-profile/implementation/full-build/
├── requirements.md
├── architecture.md
├── code-review.md
├── uat-review.md
└── tasks/
    ├── task-03.md  (approved)
    ├── task-04.md  (approved)
    ...
    └── task-20.md  (approved)
```

All 20 tasks are `approved`. To add new features, create a new task set under a new issue key in `~/.kiro/specs/professional-profile/implementation/{issueKey}/`.
