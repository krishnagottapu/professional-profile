"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SkillBarProps {
  name: string;
  proficiency: number;
}

export function SkillBar({ name, proficiency }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span style={{ color: "var(--foreground)" }}>{name}</span>
        <span style={{ color: "var(--secondary)" }}>{proficiency}%</span>
      </div>
      <div
        className="h-2.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--muted)" }}
        role="progressbar"
        aria-valuenow={proficiency}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} proficiency: ${proficiency}%`}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: "var(--primary)" }}
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${proficiency}%` : "0%" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}
