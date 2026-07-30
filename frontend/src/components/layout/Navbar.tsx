"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/resume", label: "Resume" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--nav)",
        borderColor: "var(--nav-border)",
      }}
    >
      <nav aria-label="Main navigation" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Name */}
          <Link
            href="/"
            className="font-mono font-bold text-lg shrink-0"
            style={{ color: "var(--foreground)" }}
          >
            <span className="hidden sm:inline">Sai Krishna Gottapu</span>
            <span className="sm:hidden">SKG</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  color: isActive(link.href)
                    ? "var(--primary)"
                    : "var(--secondary)",
                  borderBottom: isActive(link.href)
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.color = "var(--primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.color = "var(--secondary)";
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="w-9 h-9 flex items-center justify-center rounded-lg border transition-colors"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              {/* Hamburger / X icon */}
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span
                  className="block h-0.5 w-full rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: "var(--foreground)",
                    transform: mobileMenuOpen
                      ? "translateY(7px) rotate(45deg)"
                      : "translateY(0) rotate(0)",
                  }}
                />
                <span
                  className="block h-0.5 w-full rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: "var(--foreground)",
                    opacity: mobileMenuOpen ? 0 : 1,
                  }}
                />
                <span
                  className="block h-0.5 w-full rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: "var(--foreground)",
                    transform: mobileMenuOpen
                      ? "translateY(-7px) rotate(-45deg)"
                      : "translateY(0) rotate(0)",
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: mobileMenuOpen ? "400px" : "0px",
            opacity: mobileMenuOpen ? 1 : 0,
          }}
        >
          <div className="pb-4 pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors"
                style={{
                  color: isActive(link.href)
                    ? "var(--primary)"
                    : "var(--secondary)",
                  backgroundColor: isActive(link.href)
                    ? "var(--muted)"
                    : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
