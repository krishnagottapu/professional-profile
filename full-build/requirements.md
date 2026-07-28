# Professional Career Website — Full Build Requirements

## User Story

Build a complete multi-page professional career website for **Sai Krishna Gottapu** (Sr. Software Engineer, 7+ years). The site serves as both a job-hunting tool and professional presence, featuring a Next.js 14+ frontend with dual-theme support and a Spring Boot backend with blog CMS, admin dashboard, and GitHub integration.

## Acceptance Criteria

### Foundation (Tasks 3–4)
- Responsive navbar with links: Home, Resume, Skills, Experience, Projects, Blog, Contact
- Mobile hamburger menu with animated open/close
- Footer with LinkedIn, GitHub, Email social links
- Active page highlighting on nav
- Home page hero with typing animation cycling: "Sr. Software Engineer", "Java & Spring Expert", "Full Stack Developer", "AI Integration Specialist"
- CTA buttons: "View Resume" and "Contact Me"
- Framer Motion entrance animations on home page

### Backend — Data Layer (Task 5)
- H2 file-based DB at `jdbc:h2:file:./data/portfolio`
- JPA entities: BlogPost, Project, Skill, ContactMessage
- Spring Data JPA repositories
- Seed data: skills from context.md (7 categories, 28 skills with proficiency values)

### Backend — Public APIs (Task 6)
- GET /api/blog — paginated published posts
- GET /api/blog/{slug} — single post
- GET /api/projects — all projects sorted
- GET /api/skills — skills grouped by category
- POST /api/contact — validated contact form submission
- GET /api/github/repos — cached GitHub proxy (user: krishnagottapu)
- Bean Validation on all inputs
- Global exception handler
- CORS configured for localhost:3000

### Backend — Auth & Admin APIs (Task 7)
- Session-based auth with env var credentials
- POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
- Admin CRUD: /api/admin/blog, /api/admin/projects, /api/admin/skills, /api/admin/messages
- /api/admin/** requires authentication; 401 for unauthenticated requests

### Backend — Email (Task 8)
- Async email notification on contact form submission
- Graceful failure: message always saved even if SMTP unavailable

### Frontend Pages (Tasks 9–14)
- Skills page: animated progress bars filling on scroll, grouped by category, loaded from API
- Experience page: vertical timeline, Charter (2020–Present) and CenturyLink (2018–2020), education section
- Resume page: visual summary, downloadable PDF at /public/resume.pdf, quick stats (7+ years, 30+ technologies)
- Projects page: filterable grid of GitHub repos + manual projects, tech filter tabs
- Blog page: paginated listing + detail page at /blog/[slug] with SEO meta
- Contact page: validated form, social links, honeypot spam prevention, toast on submit

### Admin Dashboard (Tasks 15–18)
- Login page at /admin/login with redirect to /admin on success
- Protected route wrapper; unauthenticated access redirects to login
- Sidebar with: Dashboard, Blog Posts, Projects, Skills, Messages
- Dashboard stats: total posts, unread messages, total projects
- Blog CRUD with TipTap rich text editor, auto-save draft, publish toggle
- Projects CRUD with drag reorder, featured toggle
- Skills CRUD with proficiency slider, category grouping
- Messages inbox: read/unread toggle, delete, unread badge in sidebar

### SEO & Accessibility (Task 19)
- Unique meta tags per page via Next.js metadata API
- JSON-LD Person schema on home page
- Sitemap via next-sitemap
- WCAG AA contrast for both themes
- Keyboard navigation and ARIA labels

### Final Integration (Task 20)
- Error boundaries and graceful fallback states
- 404 page
- Docker Compose for full-stack local dev
- README with complete setup instructions

## Technical Context

- Project: professional-profile
- Frontend: Next.js 14+, TypeScript, Tailwind CSS (App Router) at `/frontend`
- Backend: Spring Boot 3.x, Java 21, Maven at `/backend`
- Database: H2 embedded, file-based
- Auth: session-based, single admin account
- Existing completed: Task 1 (scaffolding), Task 2 (theme system with ThemeProvider + ThemeToggle)

## Personal Data for Hardcoded Content

- Name: Sai Krishna Gottapu
- Email: krishnagottapu4@gmail.com
- GitHub: krishnagottapu
- Location: Denver, CO
- Charter Communications: Software Engineer V, July 2020 – Present
- CenturyLink INC.: Java Full Stack Developer, July 2018 – July 2020
- MS Computer Science, University of Central Missouri, 2018
- BTech Computer Science & Engineering, JNTU Kakinada, 2016

## Skills Seed Data

| Category | Skill | Proficiency |
|----------|-------|-------------|
| AI & Architecture | MCP | 90 |
| AI & Architecture | LLM Integration | 85 |
| AI & Architecture | Prompt Engineering | 80 |
| Languages | Java | 95 |
| Languages | Python | 75 |
| Languages | SQL | 85 |
| Languages | JavaScript | 80 |
| Frameworks | Spring Boot | 95 |
| Frameworks | Hibernate | 90 |
| Frameworks | Atlassian SDK | 85 |
| Frameworks | Angular | 80 |
| Databases | Oracle | 80 |
| Databases | MySQL | 85 |
| Databases | MongoDB | 75 |
| Databases | SQL Server | 70 |
| DevOps | Docker | 80 |
| DevOps | Jenkins | 75 |
| DevOps | GitLab CI/CD | 75 |
| Messaging | Kafka | 80 |
| Messaging | JMS | 70 |
| Messaging | RabbitMQ | 70 |
| Testing | JUnit | 90 |
| Testing | Mockito | 85 |
| Testing | Playwright | 80 |
| Testing | Selenium | 75 |
