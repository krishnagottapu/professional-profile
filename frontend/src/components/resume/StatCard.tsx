"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center p-6 rounded-xl border"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="text-3xl font-bold mb-1"
        style={{ color: "var(--primary)" }}
      >
        {value}
      </div>
      <div className="text-sm" style={{ color: "var(--secondary)" }}>
        {label}
      </div>
    </motion.div>
  );
}
