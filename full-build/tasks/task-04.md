---
id: task-04
task: Build home page hero section with typing animation and Framer Motion entrance
agent: frontend
status: approved
depends_on: [task-03]
skills:
  - languages/javascript
  - tooling/eslint
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/page.tsx
    - frontend/src/components/home/HeroSection.tsx
    - frontend/src/components/home/TypingAnimation.tsx
    - frontend/package.json
acceptance_criteria:
  - Home page hero displays "Hi, I'm Sai Krishna Gottapu" as a static heading
  - Typing animation below cycles through "Sr. Software Engineer", "Java & Spring Expert", "Full Stack Developer", "AI Integration Specialist" with a blinking cursor
  - Two CTA buttons — "View Resume" (links to /resume) and "Contact Me" (links to /contact)
  - Framer Motion fade-in + slide-up entrance animation triggers on page load
  - Professional summary paragraph is visible below the typing animation
  - Scroll-down indicator (chevron or arrow) animates with a bounce
  - framer-motion is added to package.json dependencies
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Install framer-motion

Add to `frontend/package.json` dependencies:
```
"framer-motion": "^11.0.0"
```

### 2. Create `frontend/src/components/home/TypingAnimation.tsx`

`"use client"` component. Implementation approach:
- Accept `phrases: string[]` as a prop
- State: `currentPhraseIndex`, `currentText`, `isDeleting`, `isPaused`
- `useEffect` with `setInterval`/`setTimeout` to type forward, pause, then delete, then advance to next phrase
- Typing speed: ~80ms per char; deletion speed: ~40ms per char; pause on complete phrase: 2000ms
- Render as `<span>` with a blinking cursor character `|` styled with a CSS blink animation (`animate-pulse` or a keyframe)
- Wrap with a color using `var(--primary)` or `var(--accent)` to make it stand out

### 3. Create `frontend/src/components/home/HeroSection.tsx`

`"use client"` component (uses Framer Motion). Structure:

```
<section> (full viewport height, centered flex column)
  <motion.div> (fade-in container, staggered children)
    <h1> Hi, I'm Sai Krishna Gottapu </h1>
    <div> <TypingAnimation phrases={ROLES} /> </div>
    <p> Professional summary paragraph </p>
    <div> CTA buttons row </div>
  </motion.div>
  <motion.div> scroll indicator (bounce animation) </motion.div>
</section>
```

Framer Motion variants:
```ts
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}
```

Professional summary text:
> "Senior Software Engineer with 7+ years building enterprise applications at Charter Communications. Specializing in Java, Spring Boot, Atlassian integrations, and AI-powered tooling. Passionate about clean architecture and developer productivity."

ROLES array:
```ts
const ROLES = [
  "Sr. Software Engineer",
  "Java & Spring Expert",
  "Full Stack Developer",
  "AI Integration Specialist",
]
```

### 4. CTA Buttons

Use Next.js `Link` wrapped in styled button elements:
- "View Resume" → `/resume`: filled primary button style (`bg-[var(--primary)]`, white text)
- "Contact Me" → `/contact`: outlined button style (`border border-[var(--primary)]`, `var(--primary)` text)
- Hover transitions via Tailwind `transition-colors`

### 5. Scroll Indicator

A chevron-down icon (inline SVG) inside a `motion.div` with:
```ts
animate={{ y: [0, 8, 0] }}
transition={{ repeat: Infinity, duration: 1.5 }}
```
Position it at the bottom of the hero section.

### 6. Update `frontend/src/app/page.tsx`

Replace the placeholder content with:
```tsx
import { HeroSection } from "@/components/home/HeroSection";
export default function Home() {
  return <HeroSection />;
}
```

### Styling Notes

- Hero section: `min-h-screen flex flex-col items-center justify-center` with some `px-6` padding
- `h1` font size: `text-4xl md:text-6xl font-bold`
- Typing animation wrapper: `text-2xl md:text-3xl font-mono` (monospace suits the terminal theme)
- Summary paragraph: `text-lg max-w-2xl text-center` with `var(--secondary)` color
- CTA row: `flex gap-4 flex-wrap justify-center mt-6`
- Both themes should look good — verify light and dark
