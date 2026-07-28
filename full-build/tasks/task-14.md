---
id: task-14
task: Build Contact page with validated form, honeypot spam prevention, and social links
agent: frontend
status: approved
depends_on: [task-04, task-06]
skills:
  - languages/javascript
  - tooling/eslint
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/contact/page.tsx
    - frontend/src/components/contact/ContactForm.tsx
    - frontend/src/lib/api/contact.ts
    - frontend/src/types/contact.ts
    - frontend/src/components/ui/Toast.tsx
acceptance_criteria:
  - Contact form has name, email, and message fields with client-side validation before submit
  - Name is required; email is required and must match email format; message is required
  - Submit button is disabled while submission is in progress
  - On success: form is cleared, toast notification shows "Message sent! I'll get back to you soon."
  - On error: toast notification shows error message, form is not cleared
  - Honeypot field is present in DOM but visually hidden and never submitted by real users (CSS hidden, not display:none)
  - Social links for LinkedIn, GitHub, and email open in new tabs with rel="noopener noreferrer"
  - Resume download link to /resume.pdf present on the page
  - react-hot-toast is used for toast notifications (add to package.json)
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Add react-hot-toast to package.json

```json
"react-hot-toast": "^2.4.1"
```

### 2. Create `frontend/src/types/contact.ts`

```ts
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}
```

### 3. Create `frontend/src/lib/api/contact.ts`

```ts
import { apiFetch } from "./client";
import type { ContactFormData } from "@/types/contact";

export function submitContact(data: ContactFormData): Promise<{ id: number; message: string }> {
  return apiFetch("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
```

### 4. Create `frontend/src/components/ui/Toast.tsx`

Wrapper to initialize react-hot-toast Toaster (placed in layout or contact page):

```tsx
"use client";
import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
        },
      }}
    />
  );
}
```

Add `<ToastProvider />` to `PageShell.tsx` (renders once in the layout).

### 5. Create `frontend/src/components/contact/ContactForm.tsx`

`"use client"` component:

```tsx
"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { submitContact } from "@/lib/api/contact";

interface FormState {
  name: string;
  email: string;
  message: string;
  honeypot: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(data: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email";
  if (!data.message.trim()) errors.message = "Message is required";
  return errors;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "", honeypot: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await submitContact(form);
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: "", email: "", message: "", honeypot: "" });
      setErrors({});
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users, visible to bots */}
      <div style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}
           aria-hidden="true">
        <label htmlFor="hp-website">Website</label>
        <input id="hp-website" name="honeypot" type="text" tabIndex={-1}
               value={form.honeypot} onChange={handleChange} autoComplete="off" />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium mb-1">Name *</label>
        <input id="contact-name" name="name" type="text" value={form.name}
               onChange={handleChange} autoComplete="name"
               className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
               style={{
                 backgroundColor: "var(--card)",
                 borderColor: errors.name ? "#ef4444" : "var(--border)",
                 color: "var(--foreground)",
               }} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium mb-1">Email *</label>
        <input id="contact-email" name="email" type="email" value={form.email}
               onChange={handleChange} autoComplete="email"
               className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
               style={{
                 backgroundColor: "var(--card)",
                 borderColor: errors.email ? "#ef4444" : "var(--border)",
                 color: "var(--foreground)",
               }} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium mb-1">Message *</label>
        <textarea id="contact-message" name="message" rows={5} value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: errors.message ? "#ef4444" : "var(--border)",
                    color: "var(--foreground)",
                  }} />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
      </div>

      <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-lg font-semibold transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
```

### 6. Create `frontend/src/app/contact/page.tsx`

```tsx
import { ContactForm } from "@/components/contact/ContactForm";

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/sai-krishna-gottapu", icon: "in" },
  { label: "GitHub", href: "https://github.com/krishnagottapu", icon: "gh" },
  { label: "Email", href: "mailto:krishnagottapu4@gmail.com", icon: "@" },
];

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">Get In Touch</h1>
      <p className="text-center mb-12" style={{ color: "var(--secondary)" }}>
        Open to new opportunities and interesting projects. Let's connect.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <ContactForm />
        </div>

        {/* Info sidebar */}
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Connect</h2>
            <div className="space-y-3">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href}
                   target={s.href.startsWith("mailto") ? "_self" : "_blank"}
                   rel="noopener noreferrer"
                   className="flex items-center gap-3 text-sm hover:underline"
                   style={{ color: "var(--primary)" }}
                   aria-label={s.label}>
                  <span className="w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold"
                        style={{ borderColor: "var(--border)" }}>
                    {s.icon}
                  </span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Resume</h2>
            <a href="/resume.pdf" download="Sai-Krishna-Gottapu-Resume.pdf"
               className="inline-block px-5 py-2 rounded-lg border text-sm font-medium transition-colors"
               style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
              ↓ Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Security Notes

- The honeypot field is positioned off-screen via inline CSS (`position: absolute; left: -9999px`), NOT `display: none` or `visibility: hidden`. Screen readers should skip it via `aria-hidden="true"`. Real browsers cannot see it; bots that read the DOM will fill it and trigger server-side rejection.
- The contact API (`submitContact`) uses `credentials: "include"` from the base client — this is fine for the contact form (public endpoint) since the session cookie is simply passed through harmlessly.
- Do NOT log or display the honeypot value in any user-visible error message.
