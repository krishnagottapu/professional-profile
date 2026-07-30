import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sai Krishna Gottapu. Open to new opportunities, collaborations, and interesting projects.",
  openGraph: {
    title: "Contact | Sai Krishna Gottapu",
    description:
      "Get in touch with Sai Krishna Gottapu. Open to new opportunities, collaborations, and interesting projects.",
  },
};

export default function ContactPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h1
        className="text-4xl font-bold mb-4 text-center"
        style={{ color: "var(--foreground)" }}
      >
        Get In Touch
      </h1>
      <p
        className="text-center mb-12 max-w-xl mx-auto"
        style={{ color: "var(--secondary)" }}
      >
        Open to new opportunities and interesting projects. Feel free to reach
        out — I&apos;ll get back to you as soon as possible.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="relative">
          <ContactForm />
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Connect With Me
            </h2>
            <ul className="space-y-4">
              {/* Email */}
              <li>
                <a
                  href="mailto:krishnagottapu4@gmail.com"
                  className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
                  style={{ color: "var(--foreground)" }}
                >
                  <span
                    className="w-9 h-9 rounded-lg border flex items-center justify-center shrink-0"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--muted)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: "var(--primary)" }}
                      aria-hidden="true"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <span>krishnagottapu4@gmail.com</span>
                </a>
              </li>

              {/* LinkedIn */}
              <li>
                <a
                  href="https://www.linkedin.com/in/sai-krishna-gottapu-0710b73b8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
                  style={{ color: "var(--foreground)" }}
                >
                  <span
                    className="w-9 h-9 rounded-lg border flex items-center justify-center shrink-0"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--muted)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: "var(--primary)" }}
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </span>
                  <span>linkedin.com/in/krishnagottapu</span>
                </a>
              </li>

              {/* GitHub */}
              <li>
                <a
                  href="https://github.com/krishnagottapu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
                  style={{ color: "var(--foreground)" }}
                >
                  <span
                    className="w-9 h-9 rounded-lg border flex items-center justify-center shrink-0"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--muted)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: "var(--primary)" }}
                      aria-hidden="true"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </span>
                  <span>github.com/krishnagottapu</span>
                </a>
              </li>

              {/* Location */}
              <li>
                <div
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  <span
                    className="w-9 h-9 rounded-lg border flex items-center justify-center shrink-0"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--muted)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: "var(--primary)" }}
                      aria-hidden="true"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <span>Denver, CO</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Resume Download */}
          <div>
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Resume
            </h2>
            <a
              href="/saikrishnagottapu_updated_resume.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                borderColor: "var(--primary)",
                color: "var(--primary)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
