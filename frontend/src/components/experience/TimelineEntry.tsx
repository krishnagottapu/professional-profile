"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TimelineEntryProps {
  company: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  bullets: string[];
  techTags: string[];
  index: number;
}

export function TimelineEntry({
  company,
  role,
  period,
  location,
  current,
  bullets,
  techTags,
  index,
}: TimelineEntryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex w-full mb-12 ${
        isLeft ? "md:justify-start" : "md:justify-end"
      }`}
    >
      {/* Timeline dot — centered on the vertical line (desktop only) */}
      <div
        className="absolute left-4 md:left-1/2 top-6 w-4 h-4 rounded-full border-4 -translate-x-1/2 z-10"
        style={{
          backgroundColor: "var(--primary)",
          borderColor: "var(--background)",
        }}
        aria-hidden="true"
      />

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -40 : 40 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="ml-10 md:ml-0 w-full md:w-[45%] p-6 rounded-xl border"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {current && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}
            >
              Current
            </span>
          )}
          <h3 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            {role}
          </h3>
        </div>

        <p className="font-semibold" style={{ color: "var(--primary)" }}>
          {company}
        </p>

        <div className="flex items-center gap-3 mt-1 mb-4 text-sm" style={{ color: "var(--secondary)" }}>
          <span>{period}</span>
          <span aria-hidden="true">·</span>
          <span>{location}</span>
        </div>

        <ul className="space-y-2 mb-4" role="list">
          {bullets.map((bullet, i) => (
            <li key={i} className="text-sm flex gap-2">
              <span style={{ color: "var(--primary)" }} aria-hidden="true">
                ▹
              </span>
              <span style={{ color: "var(--card-foreground)" }}>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2" aria-label="Technologies used">
          {techTags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-md font-medium"
              style={{
                backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)",
                color: "var(--primary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
