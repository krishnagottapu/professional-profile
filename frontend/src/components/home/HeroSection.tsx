"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TypingAnimation } from "@/components/home/TypingAnimation";
import { getExperienceLabel } from "@/lib/utils/experience";

const ROLES = [
  "Sr. Software Engineer",
  "Java & Spring Expert",
  "Full Stack Developer",
  "AI Integration Specialist",
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 relative">
      <motion.div
        className="flex flex-col items-center text-center max-w-3xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar Placeholder */}
        <motion.div
          variants={item}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(135deg, #2563eb, #06b6d4)",
          }}
        >
          <span className="text-white text-3xl md:text-4xl font-bold select-none">
            SK
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Sai Krishna Gottapu
        </motion.h1>

        {/* Typing Animation */}
        <motion.div variants={item} className="mb-6 min-h-[2.5rem]">
          <TypingAnimation phrases={ROLES} />
        </motion.div>

        {/* Professional Summary */}
        <motion.p
          variants={item}
          className="text-lg max-w-2xl mb-8 leading-relaxed"
          style={{ color: "var(--secondary)" }}
        >
          Sr. Software Engineer with {getExperienceLabel()} years building enterprise Java systems,
          full-stack web applications, and AI integrations. Specializing in
          Spring Boot, Atlassian plugins, and modern cloud-native architectures.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={item}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            href="/resume"
            className="px-6 py-3 rounded-lg font-medium text-white transition-colors"
            style={{
              backgroundColor: "var(--primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
            }}
          >
            View Resume
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg font-medium border-2 transition-colors"
            style={{
              borderColor: "var(--primary)",
              color: "var(--primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--primary)";
            }}
          >
            Contact Me
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-8"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--secondary)" }}
        >
          <path d="M7 13l5 5 5-5" />
          <path d="M7 6l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  );
}
