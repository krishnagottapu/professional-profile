# Sai Krishna Gottapu — Professional Career Website

Full-stack personal portfolio with a Next.js 14+ frontend and Spring Boot 3.x backend.

**Live:** https://saikrishnagottapu.vercel.app

## Architecture

- **Frontend:** Next.js 14+, TypeScript, Tailwind CSS, Framer Motion — `http://localhost:3000`
- **Backend:** Spring Boot 3.x, Java 21, Spring Security, H2 — `http://localhost:8080`
- **Database:** H2 embedded file-based (local) / H2 in-memory (production)
- **Email:** Resend HTTP API (production) / Spring Mail SMTP (local)

```
┌─────────────────────────────────────────┐
│          FRONTEND (Next.js 14+)          │
│  Pages: Home, Resume, Skills, Experience │
│         Projects, Blog, Contact, Admin   │
│  Host: Vercel (auto-deploy from main)    │
└─────────────────┬───────────────────────┘
                  │ REST API (Next.js proxy)
┌─────────────────▼───────────────────────┐
│         BACKEND (Spring Boot 3.x)        │
│  Auth, Blog CMS, Skills, Projects,       │
│  Contact, GitHub Proxy, Email (Resend)   │
│  Host: Render (Docker, manual deploy)    │
└─────────────────┬───────────────────────┘
                  │ JDBC
┌─────────────────▼───────────────────────┐
│            H2 DATABASE                   │
│  Local: jdbc:h2:file:./data/portfolio    │
│  Prod:  jdbc:h2:mem:portfolio (seeded)   │
└─────────────────────────────────────────┘
```

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| Java JDK | 21 |
| Maven | 3.9+ |
| Docker + Compose | (optional, for containerized dev) |

## Local Development

### Quick Start (Windows)

Two batch scripts are provided at the project root. Run each in a separate terminal — start the backend first.

```bat
# Terminal 1 — backend
start-backend.bat

# Terminal 2 — frontend
start-frontend.bat
```

`start-frontend.bat` will automatically run `npm install` if `node_modules` is missing.

### Manual Start

#### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at http://localhost:8080
H2 Console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:file:./data/portfolio`)

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at http://localhost:3000

## Docker Compose (full stack)

```bash
# Create .env file with secrets (see Environment Variables below)
docker compose up --build
```

Frontend: http://localhost:3000
Backend: http://localhost:8080

The backend uses a named volume (`portfolio-data`) to persist H2 database files across container restarts.

## Environment Variables

### Local Development

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `admin123` | Admin login password |
| `ADMIN_EMAIL` | `krishnagottapu4@gmail.com` | Contact form notification recipient |
| `MAIL_HOST` | `localhost` | SMTP host |
| `MAIL_PORT` | `587` | SMTP port |
| `MAIL_USERNAME` | *(empty)* | SMTP username |
| `MAIL_PASSWORD` | *(empty)* | SMTP password |

### Production (Render)

| Variable | Description |
|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | Set to `prod` (auto-configured via render.yaml) |
| `PORT` | Set to `10000` (Render's default, auto-configured) |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password (**use a strong password**) |
| `ADMIN_EMAIL` | Contact form notification recipient |
| `CORS_ALLOWED_ORIGINS` | Vercel frontend URL |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) |

### Production (Vercel)

| Variable | Description |
|----------|-------------|
| `BACKEND_URL` | Render backend URL (server-side proxy) |
| `NEXT_PUBLIC_API_URL` | Render backend URL (SSR calls) |
| `NEXT_PUBLIC_SITE_URL` | *(optional)* Site URL for OG tags. Falls back to `window.location.origin` |

## Project Structure

```
professional-profile/
├── frontend/                # Next.js App Router
│   ├── src/app/             # Pages and layouts
│   ├── src/components/      # UI components
│   │   ├── layout/          # Navbar, Footer, PageShell
│   │   ├── home/            # Hero, typing animation
│   │   ├── skills/          # Skill cards, progress bars
│   │   ├── experience/      # Animated vertical timeline
│   │   ├── projects/        # Project cards, filter tabs
│   │   ├── blog/            # Blog cards, content renderer, share buttons
│   │   ├── contact/         # Contact form
│   │   ├── admin/           # Admin dashboard components
│   │   └── ui/              # Reusable UI primitives
│   ├── src/hooks/           # Custom React hooks
│   ├── src/lib/             # API client, data, utilities
│   │   ├── api/             # API client modules
│   │   ├── data/            # Static data (experience, resume)
│   │   └── utils/           # Utility functions (experience calculator)
│   ├── src/types/           # TypeScript type definitions
│   ├── vercel.json          # Vercel deployment config
│   └── .gitignore           # Frontend-specific ignores
├── backend/                 # Spring Boot 3.x
│   ├── src/main/java/com/gottapu/portfolio/
│   │   ├── config/          # Security, CORS, Async config
│   │   ├── controller/      # REST endpoints (public + admin)
│   │   ├── service/         # Business logic (incl. Resend email)
│   │   ├── repository/      # JPA repositories
│   │   ├── entity/          # Database entities
│   │   ├── dto/             # Request/response DTOs
│   │   └── exception/       # Global error handling
│   ├── src/main/resources/
│   │   ├── application.yml      # Base config
│   │   ├── application-prod.yml # Production overrides
│   │   └── data.sql             # Seed data (skills, etc.)
│   └── Dockerfile           # Multi-stage Maven/Java 21 build (for Render)
├── .github/workflows/
│   ├── ci-frontend.yml      # Frontend CI: lint, test, build
│   └── ci-backend.yml       # Backend CI: test, package
├── Dockerfile.backend       # Multi-stage build (Docker Compose)
├── Dockerfile.frontend      # Multi-stage Node 20 build
├── docker-compose.yml       # Full-stack local orchestration
├── render.yaml              # Render Blueprint (backend deployment)
├── start-backend.bat        # Windows quick-start script for backend
├── start-frontend.bat       # Windows quick-start script for frontend
└── README.md
```

## Features

- **Dual theme:** Light (minimal) and Dark (developer) theme toggle
- **Blog CMS:** Rich-text editor (TipTap) with admin management and LinkedIn sharing
- **Skills management:** Categorized skills with proficiency levels
- **Animated experience timeline:** Vertical timeline with year selector, progress bars, hover tooltips, staggered animations, and bidirectional card/year sync
- **Dynamic experience calculator:** Years of experience auto-updates based on career start date
- **Project showcase:** Manual projects + GitHub repository integration
- **Contact form:** Email notifications via Resend HTTP API (no SMTP port restrictions)
- **Admin dashboard:** Protected dashboard for content management
- **SEO optimized:** Sitemap, meta tags, Open Graph support
- **Responsive design:** Mobile-first with Tailwind CSS
- **Error boundaries:** Graceful error handling throughout the app
- **Custom favicon:** SKG initials

## Admin Dashboard

Access at https://saikrishnagottapu.vercel.app/admin (or http://localhost:3000/admin locally)

Manage blog posts, projects, skills, and contact messages from the admin interface.

**Note:** In production, data added through the admin panel resets on each deploy. To persist content permanently, add it to `backend/src/main/resources/data.sql`.

## Adding Resume PDF

Place your resume PDF at:

```
frontend/public/resume.pdf
```

It will be served at `/resume.pdf` and linked from the Resume and Contact pages.

## Deployment (Vercel + Render)

The project uses a split deployment: **Vercel** for the Next.js frontend and **Render** for the Spring Boot backend.

| Component | Platform | URL | Deploy Trigger |
|-----------|----------|-----|----------------|
| Frontend | Vercel | https://saikrishnagottapu.vercel.app | Auto on push (frontend/ changes only) |
| Backend | Render | https://portfolio-backend-j4xp.onrender.com | Manual deploy |

### CI/CD Pipeline

GitHub Actions runs on every push/PR to `main`:
- **Frontend CI** (`.github/workflows/ci-frontend.yml`): lint, test, build
- **Backend CI** (`.github/workflows/ci-backend.yml`): test, package

Vercel deploys automatically when `frontend/` files change (configured via Ignored Build Step: `git diff --quiet HEAD^ HEAD -- .`).

Render deploys manually from the dashboard.

### Backend — Render Setup

1. Create a free account at [render.com](https://render.com)
2. Click **New → Blueprint** and connect your GitHub repo
3. Render detects `render.yaml` and creates the service automatically
4. Fill in the environment variable values in the Render dashboard
5. Set **Root Directory** to `backend`
6. Disable **Auto-Deploy** if you only want manual deploys

The backend uses H2 in-memory with seeded data (`data.sql`) in production. Data resets on each deploy, which is expected for a portfolio site.

**Note:** Render free tier spins down after 15 minutes of inactivity. First request after idle takes ~60-90 seconds (JVM cold start).

### Frontend — Vercel Setup

1. Create a free account at [vercel.com](https://vercel.com)
2. Click **Import Project** and connect your GitHub repo
3. Set the **Root Directory** to `frontend`
4. Set environment variables: `BACKEND_URL` and `NEXT_PUBLIC_API_URL`
5. Under **Settings → General → Build & Development Settings**, set Ignored Build Step to: `git diff --quiet HEAD^ HEAD -- .`
6. Under **Settings → Deployment Protection**, set Vercel Authentication to "Only Preview Deployments" for a public site
7. Deploy

### Post-Deploy Checklist

- [x] Set `CORS_ALLOWED_ORIGINS` on Render to Vercel domain
- [x] Set `BACKEND_URL` and `NEXT_PUBLIC_API_URL` on Vercel to Render URL
- [x] Change `ADMIN_PASSWORD` from default
- [x] Configure Resend API key for contact form emails
- [x] Disable Vercel Authentication on production deployments
- [x] Set Ignored Build Step to only deploy on frontend changes
- [ ] (Optional) Add a custom domain in Vercel settings
- [ ] (Optional) Verify domain in Resend for custom sender address

## Content Management

### Adding/Updating Content

Since the production database resets on each deploy, all persistent content lives in `backend/src/main/resources/data.sql`. To add or modify content:

1. Edit `data.sql` with your SQL inserts (uses `MERGE INTO ... KEY` to avoid duplicates)
2. Push to `main`
3. Manually deploy on Render

### Dynamic Values

The following values update automatically without code changes:
- **Years of experience** — calculated from career start date (July 2018) in `frontend/src/lib/utils/experience.ts`
- **Share URLs** — uses `window.location.origin` for the current domain

## Security Notes

- Change `ADMIN_PASSWORD` from the default before any public deployment
- H2 console is disabled in production (`application-prod.yml`)
- Both Docker images run as non-root users
- Session cookies use `HttpOnly`, `Secure`, and `SameSite=Lax` in production
- Contact form uses honeypot spam protection
- All API calls between frontend and backend go through the Next.js proxy (no direct browser-to-backend CORS needed for client-side calls)
- Resend API key is stored as a server-side environment variable (never exposed to the browser)
