---
id: task-20
task: Final integration — error boundaries, Docker Compose, and complete README
agent: backend
status: approved
depends_on: [task-19]
skills:
  - languages/java
  - tooling/checkstyle
  - global/security
  - global/docker
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - docker-compose.yml
    - Dockerfile.frontend
    - Dockerfile.backend
    - README.md
    - frontend/src/app/error.tsx
    - frontend/src/components/ui/ErrorBoundary.tsx
acceptance_criteria:
  - docker-compose.yml starts both frontend (port 3000) and backend (port 8080) with a single command
  - Backend Dockerfile builds a runnable JAR with Maven and runs on Java 21
  - Frontend Dockerfile builds a production Next.js app and serves it
  - Frontend error.tsx renders a user-friendly error page with a "Try again" reset button
  - ErrorBoundary component wraps async data sections in pages (Skills, Projects, Blog)
  - README.md documents: architecture overview, prerequisites, local setup steps, env var table, Docker Compose instructions, and project structure
  - docker-compose.yml mounts a named volume for H2 data persistence at /app/data
  - Both Dockerfiles use non-root users for security
  - ESLint passes with no violations on all frontend files
---

## Implementation Instructions

### 1. Create `Dockerfile.backend`

```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/pom.xml .
RUN mvn dependency:go-offline -q
COPY backend/src ./src
RUN mvn clean package -DskipTests -q

# Stage 2: Run
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p /app/data && chown -R appuser:appgroup /app
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. Create `Dockerfile.frontend`

```dockerfile
# Stage 1: Install deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=http://localhost:8080
RUN npm run build

# Stage 3: Run
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system nodejs && adduser --system --ingroup nodejs nextjs
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
CMD ["node", "server.js"]
```

For the standalone output, add to `frontend/next.config.ts`:
```ts
const nextConfig = {
  output: "standalone",
};
export default nextConfig;
```

### 3. Create `docker-compose.yml`

```yaml
version: "3.9"

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8080:8080"
    environment:
      ADMIN_USERNAME: ${ADMIN_USERNAME:-admin}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD:-changeme}
      ADMIN_EMAIL: ${ADMIN_EMAIL:-krishnagottapu4@gmail.com}
      MAIL_HOST: ${MAIL_HOST:-localhost}
      MAIL_PORT: ${MAIL_PORT:-587}
      MAIL_USERNAME: ${MAIL_USERNAME:-}
      MAIL_PASSWORD: ${MAIL_PASSWORD:-}
    volumes:
      - portfolio-data:/app/data
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080
    depends_on:
      backend:
        condition: service_healthy

volumes:
  portfolio-data:
    driver: local
```

### 4. Create `frontend/src/app/error.tsx`

Next.js App Router error boundary (must be `"use client"`):

```tsx
"use client";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-center mb-6 max-w-md" style={{ color: "var(--secondary)" }}>
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button onClick={reset}
              className="px-6 py-3 rounded-lg font-semibold"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
        Try again
      </button>
    </div>
  );
}
```

### 5. Create `frontend/src/components/ui/ErrorBoundary.tsx`

A React class-based error boundary for use around client-side async sections:

```tsx
"use client";
import React from "react";

interface Props {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

interface State { hasError: boolean; }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="text-center py-10" style={{ color: "var(--secondary)" }}>
          Failed to load content. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap the main content in pages like Skills and Projects with `<ErrorBoundary>`.

### 6. Update `README.md`

Create a comprehensive README at the project root:

```markdown
# Sai Krishna Gottapu — Professional Career Website

Full-stack personal portfolio with a Next.js 14+ frontend and Spring Boot 3.x backend.

## Architecture

- **Frontend:** Next.js 14+, TypeScript, Tailwind CSS, Framer Motion — `http://localhost:3000`
- **Backend:** Spring Boot 3.x, Java 21, Spring Security, H2 — `http://localhost:8080`
- **Database:** H2 embedded file-based (`./data/portfolio`)

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| Java JDK | 21 |
| Maven | 3.9+ |
| Docker + Compose | (optional, for containerized dev) |

## Local Development

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at http://localhost:8080  
H2 Console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:file:./data/portfolio`)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at http://localhost:3000

## Docker Compose (full stack)

```bash
# Create .env file with secrets (see .env.example)
docker compose up --build
```

Frontend: http://localhost:3000  
Backend: http://localhost:8080

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
├── frontend/         # Next.js App Router
│   ├── src/app/      # Pages and layouts
│   ├── src/components/
│   ├── src/lib/      # API client, data, utilities
│   ├── src/hooks/
│   └── src/types/
├── backend/          # Spring Boot 3.x
│   └── src/main/java/com/gottapu/portfolio/
│       ├── config/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       └── exception/
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml
└── README.md
```

## Admin Dashboard

Access at http://localhost:3000/admin  
Default credentials: `admin` / `admin123` (set via env vars)

## Adding Resume PDF

Place your resume PDF at:
```
frontend/public/resume.pdf
```
It will be served at `/resume.pdf` and linked from the Resume and Contact pages.
```

### Security Notes for Deployment

- Change `ADMIN_PASSWORD` from the default before any public deployment
- Set `SITE_URL` environment variable for correct sitemap and OG tag URLs
- Consider adding rate limiting on `/api/contact` at the reverse proxy layer (nginx/Cloudflare) for production
- The H2 console should be disabled for production: add `spring.h2.console.enabled=false` to a production profile
