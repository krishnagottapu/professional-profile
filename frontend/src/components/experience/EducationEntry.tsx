"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface EducationEntryProps {
  degree: string;
  institution: string;
  year: string;
}

export function EducationEntry({ degree, institution, year }: EducationEntryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-5 rounded-xl border"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <p className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
        {degree}
      </p>
      <p className="mt-1" style={{ color: "var(--primary)" }}>
        {institution}
      </p>
      <p className="text-sm mt-1" style={{ color: "var(--secondary)" }}>
        {year}
      </p>
    </motion.div>
  );
}
