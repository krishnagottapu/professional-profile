"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  proficiency: number; // 0–100
  label?: string;
}

export function AnimatedProgressBar({ proficiency, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span>{label}</span>
          <span style={{ color: "var(--secondary)" }}>{proficiency}%</span>
        </div>
      )}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--border)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: "var(--primary)" }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${proficiency}%` : 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}
