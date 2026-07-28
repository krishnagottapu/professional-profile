# Sai Krishna Gottapu — Professional Career Website

Full-stack personal portfolio with a Next.js 14+ frontend and Spring Boot 3.x backend.

## Architecture

- **Frontend:** Next.js 14+, TypeScript, Tailwind CSS, Framer Motion — `http://localhost:3000`
- **Backend:** Spring Boot 3.x, Java 21, Spring Security, H2 — `http://localhost:8080`
- **Database:** H2 embedded file-based (`./data/portfolio`)

```
┌─────────────────────────────────────────┐
│          FRONTEND (Next.js 14+)          │
│  Pages: Home, Resume, Skills, Experience │
│         Projects, Blog, Contact, Admin   │
│  Theme: Light (minimal) ↔ Dark (dev)    │
└─────────────────┬───────────────────────┘
                  │ REST API
┌─────────────────▼───────────────────────┐
│         BACKEND (Spring Boot 3.x)        │
│  Auth, Blog CMS, Skills, Projects,       │
│  Contact, GitHub Proxy, Email            │
└─────────────────┬───────────────────────┘
                  │ JDBC
┌─────────────────▼───────────────────────┐
│            H2 DATABASE (file)            │
│  jdbc:h2:file:./data/portfolio           │
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

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `admin123` | Admin login password (**change in production**) |
| `ADMIN_EMAIL` | `krishnagottapu4@gmail.com` | Contact form notification recipient |
| `MAIL_HOST` | `localhost` | SMTP host |
| `MAIL_PORT` | `587` | SMTP port |
| `MAIL_USERNAME` | *(empty)* | SMTP username |
| `MAIL_PASSWORD` | *(empty)* | SMTP password |

## Project Structure

```
professional-profile/
├── frontend/                # Next.js App Router
│   ├── src/app/             # Pages and layouts
│   ├── src/components/      # UI components
│   │   ├── layout/          # Navbar, Footer, PageShell
│   │   ├── home/            # Hero, typing animation
│   │   ├── skills/          # Skill cards, progress bars
│   │   ├── experience/      # Timeline entries
│   │   ├── projects/        # Project cards, filter tabs
│   │   ├── blog/            # Blog cards, content renderer
│   │   ├── contact/         # Contact form
│   │   ├── admin/           # Admin dashboard components
│   │   └── ui/              # Reusable UI primitives
│   ├── src/hooks/           # Custom React hooks
│   ├── src/lib/             # API client, data, utilities
│   └── src/types/           # TypeScript type definitions
├── backend/                 # Spring Boot 3.x
│   └── src/main/java/com/gottapu/portfolio/
│       ├── config/          # Security, CORS, Async config
│       ├── controller/      # REST endpoints (public + admin)
│       ├── service/         # Business logic
│       ├── repository/      # JPA repositories
│       ├── entity/          # Database entities
│       ├── dto/             # Request/response DTOs
│       └── exception/       # Global error handling
├── Dockerfile.backend       # Multi-stage Maven/Java 21 build
├── Dockerfile.frontend      # Multi-stage Node 20 build
├── docker-compose.yml       # Full-stack orchestration
├── start-backend.bat        # Windows quick-start script for backend
├── start-frontend.bat       # Windows quick-start script for frontend
└── README.md
```

## Features

- **Dual theme:** Light (minimal) and Dark (developer) theme toggle
- **Blog CMS:** Rich-text editor (TipTap) with admin management
- **Skills management:** Categorized skills with proficiency levels
- **Project showcase:** Manual projects + GitHub repository integration
- **Contact form:** Email notifications with honeypot spam protection
- **Admin dashboard:** Protected dashboard for content management
- **SEO optimized:** Sitemap, meta tags, Open Graph support
- **Responsive design:** Mobile-first with Tailwind CSS
- **Error boundaries:** Graceful error handling throughout the app

## Admin Dashboard

Access at http://localhost:3000/admin
Default credentials: `admin` / `admin123` (set via env vars)

Manage blog posts, projects, skills, and contact messages from the admin interface.

## Adding Resume PDF

Place your resume PDF at:

```
frontend/public/resume.pdf
```

It will be served at `/resume.pdf` and linked from the Resume and Contact pages.

## Security Notes for Deployment

- Change `ADMIN_PASSWORD` from the default before any public deployment
- Set `SITE_URL` environment variable for correct sitemap and OG tag URLs
- Consider adding rate limiting on `/api/contact` at the reverse proxy layer (nginx/Cloudflare) for production
- The H2 console should be disabled for production: add `spring.h2.console.enabled=false` to a production profile
- Both Docker images run as non-root users for container security
