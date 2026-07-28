# Project Context — Professional Career Website

## Overview

Professional career website for **Sai Krishna Gottapu** — a multi-page site serving as both a job-hunting tool and a professional presence. Features a React/Next.js frontend with dual-theme support, a Spring Boot backend with blog CMS and admin dashboard, and GitHub integration.

---

## Personal Information

- **Name:** Sai Krishna Gottapu
- **Role:** Sr. Software Engineer (7+ years experience)
- **Location:** Denver, CO
- **Email:** krishnagottapu4@gmail.com
- **Phone:** 816-287-0391
- **GitHub:** krishnagottapu

---

## Work History

| Company | Role | Period |
|---------|------|--------|
| Charter Communications | Software Engineer V | July 2020 – Present |
| CenturyLink INC. | Java Full Stack Developer | July 2018 – July 2020 |

### Charter Communications
Custom software delivery team for internal employees. Focus areas: data extraction, add-ons, integrations, macros, dashboards, reporting. Technologies: Atlassian SDK, Jira/Confluence plugins, MCP servers (Python), Playwright automation, SAFe Agile, Spring Scanner, Active Objects, Apache Velocity.

### CenturyLink
3Flow VoIP order processing and workflow management. Migrated monolithic application to microservices. Technologies: Spring Boot, Angular 2/8, Apache Kafka, Docker, Kubernetes, Hibernate, MongoDB.

---

## Education

| Degree | Institution | Year |
|--------|-------------|------|
| MS Computer Science | University of Central Missouri, MO | 2018 |
| BTech Computer Science & Engineering | JNTU Kakinada | 2016 |

---

## Technology Decisions

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend Framework | Next.js 14+ (App Router) | Modern SSR/SSG, great SEO, TypeScript support |
| Frontend Styling | Tailwind CSS | Utility-first, rapid prototyping, theme-friendly |
| Frontend Animations | Framer Motion | Industry standard for React animations |
| Frontend Theme | next-themes | System preference detection, localStorage persistence |
| Rich Text Editor | TipTap | Modern, extensible, React-native, great TypeScript support |
| Backend Framework | Spring Boot 3.x (Java 21) | Matches resume tech stack, robust REST API support |
| Database | H2 (embedded, file-based) | Simple setup for dev, swappable to PostgreSQL/MySQL later |
| Authentication | Spring Security | Session-based, single admin account, env-based credentials |
| Email | Spring Mail (SMTP) | Async email notifications on contact form submission |
| Containerization | Docker Compose | Local full-stack development |

---

## Design Decisions

### Theme System
- **Default:** System OS preference (light or dark)
- **Light theme:** Minimal and clean — whites, subtle grays, professional blue accents
- **Dark theme:** Developer/terminal aesthetic — deep backgrounds (#0d1117), green/cyan accents, monospace touches
- **Persistence:** Manual toggle override saved to localStorage across visits

### Data Strategy
- **Hardcoded in frontend:** Experience/work history, education, resume content
- **Editable from admin:** Skills (categories + proficiency), projects, blog posts
- **GitHub API:** Public repos fetched and cached via backend proxy

### Authentication
- Single admin account
- Credentials stored in environment variables (ADMIN_USERNAME, ADMIN_PASSWORD)
- Session-based auth (not JWT)
- All `/api/admin/**` routes protected; all public `/api/**` routes open

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero with typing animation, CTAs, Framer Motion entrance |
| Resume | `/resume` | Visual summary, downloadable PDF, quick stats |
| Skills | `/skills` | Animated progress bars, category grouping (from API) |
| Experience | `/experience` | Vertical timeline, work history, education |
| Projects | `/projects` | GitHub repos + manual entries, filterable by tech |
| Blog | `/blog` | Post listing + detail (`/blog/[slug]`) |
| Contact | `/contact` | Form + social links + resume download |
| Admin | `/admin/*` | Protected dashboard for content management |

---

## Features

- **Typing animation** on hero section (cycles through roles)
- **Animated skill bars** that fill on scroll
- **Scroll-triggered animations** for timeline entries, project cards, blog cards
- **GitHub integration** — public repos fetched via backend proxy, cached
- **Blog CMS** — TipTap rich text editor, draft/publish workflow
- **Admin dashboard** — Manage blog, projects, skills, view contact messages
- **Contact form** — Stores to DB + SMTP email notification (async)
- **Downloadable resume PDF** — Served from `/public/resume.pdf`
- **Spam prevention** — Honeypot field on contact form
- **Responsive design** — Mobile-first with hamburger nav
- **SEO** — Dynamic meta tags, Open Graph, JSON-LD, sitemap
- **Accessibility** — WCAG AA compliance, keyboard nav, skip links, ARIA labels

---

## Skills Categories (Seed Data)

| Category | Skills |
|----------|--------|
| AI & Architecture | MCP (90%), LLM Integration (85%), Prompt Engineering (80%) |
| Languages | Java (95%), Python (75%), SQL (85%), JavaScript (80%) |
| Frameworks | Spring Boot (95%), Hibernate (90%), Atlassian SDK (85%), Angular (80%) |
| Databases | Oracle (80%), MySQL (85%), MongoDB (75%), SQL Server (70%) |
| DevOps | Docker (80%), Jenkins (75%), GitLab CI/CD (75%) |
| Messaging | Kafka (80%), JMS (70%), RabbitMQ (70%) |
| Testing | JUnit (90%), Mockito (85%), Playwright (80%), Selenium (75%) |

---

## Hosting

Deferred — focus on building first. Docker Compose for local development. Future options: AWS (EC2/ECS + S3/CloudFront), Vercel + Railway, or Docker on VPS.

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| ADMIN_USERNAME | Admin login username |
| ADMIN_PASSWORD | Admin login password |
| MAIL_HOST | SMTP server host |
| MAIL_PORT | SMTP server port |
| MAIL_USERNAME | SMTP auth username |
| MAIL_PASSWORD | SMTP auth password |
| ADMIN_EMAIL | Email to receive contact form notifications |
