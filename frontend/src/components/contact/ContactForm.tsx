"use client";

import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { submitContact } from "@/lib/api/contact";

interface FormState {
  name: string;
  email: string;
  message: string;
  website: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) {
    errors.name = "Name is required";
  }
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!data.message.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (data.message.trim().length > 2000) {
    errors.message = "Message must be 2000 characters or fewer";
  }
  return errors;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const lastSubmitRef = useRef<number>(0);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => {
        if (prev[name as keyof FormErrors]) {
          return { ...prev, [name]: undefined };
        }
        return prev;
      });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debounce: ignore if less than 300ms since last submit
    const now = Date.now();
    if (now - lastSubmitRef.current < 300) return;
    lastSubmitRef.current = now;

    // Prevent duplicate submissions
    if (submitting) return;

    // Honeypot check: if filled, silently show success without submitting
    if (form.website) {
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: "", email: "", message: "", website: "" });
      return;
    }

    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: "", email: "", message: "", website: "" });
      setErrors({});
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot field — hidden from real users, visible to bots */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <label htmlFor="hp-website">Website</label>
        <input
          id="hp-website"
          name="website"
          type="text"
          tabIndex={-1}
          value={form.website}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>

      {/* Name */}
      <div className="mb-5">
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium mb-1"
        >
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--card)",
            borderColor: errors.name ? "#ef4444" : "var(--border)",
            color: "var(--foreground)",
            // @ts-expect-error CSS custom property for focus ring
            "--tw-ring-color": "var(--primary)",
          }}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-xs mt-1" style={{ color: "#ef4444" }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="mb-5">
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium mb-1"
        >
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--card)",
            borderColor: errors.email ? "#ef4444" : "var(--border)",
            color: "var(--foreground)",
            // @ts-expect-error CSS custom property for focus ring
            "--tw-ring-color": "var(--primary)",
          }}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-xs mt-1" style={{ color: "#ef4444" }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="mb-5">
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium mb-1"
        >
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
          style={{
            backgroundColor: "var(--card)",
            borderColor: errors.message ? "#ef4444" : "var(--border)",
            color: "var(--foreground)",
            // @ts-expect-error CSS custom property for focus ring
            "--tw-ring-color": "var(--primary)",
          }}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-xs mt-1" style={{ color: "#ef4444" }}>
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-lg font-semibold transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ backgroundColor: "var(--primary)", color: "#ffffff" }}
      >
        {submitting && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
