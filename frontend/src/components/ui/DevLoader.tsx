"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TERMINAL_LINES = [
  { text: "$ connecting to api.portfolio-backend...", delay: 0 },
  { text: "→ DNS resolved: portfolio-backend-j4xp.onrender.com", delay: 400 },
  { text: "→ TLS handshake completed (TLSv1.3)", delay: 800 },
  { text: "→ TCP connection established on port 443", delay: 1200 },
  { text: "$ GET /api/data HTTP/2", delay: 1800 },
  { text: "→ sending 3 packets (1.2 KB)...", delay: 2200 },
  { text: "→ waiting for server response...", delay: 2800 },
  { text: "⟳ server cold-starting JVM (free tier)", delay: 3500 },
  { text: "→ 42 packets received (128 KB)", delay: 4500 },
  { text: "→ decompressing gzip payload...", delay: 5200 },
  { text: "→ parsing JSON response...", delay: 5800 },
  { text: "✓ 200 OK — data loaded successfully", delay: 6500 },
];

export function DevLoader() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [dots, setDots] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Cycle through terminal lines
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    TERMINAL_LINES.forEach((line, i) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => Math.max(prev, i + 1));
      }, line.delay);
      timers.push(timer);
    });

    // Loop back after all lines shown
    const loopTimer = setTimeout(() => {
      setVisibleLines(0);
      // Small delay before restarting
      setTimeout(() => {
        TERMINAL_LINES.forEach((line, i) => {
          const timer = setTimeout(() => {
            setVisibleLines((prev) => Math.max(prev, i + 1));
          }, line.delay);
          timers.push(timer);
        });
      }, 300);
    }, 7500);
    timers.push(loopTimer);

    return () => timers.forEach(clearTimeout);
  }, [visibleLines === 0]);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Terminal window */}
      <div
        className="w-full max-w-lg rounded-xl border overflow-hidden"
        style={{
          backgroundColor: "color-mix(in srgb, var(--card) 95%, black)",
          borderColor: "var(--border)",
        }}
      >
        {/* Terminal header */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
          </div>
          <span
            className="text-xs font-mono ml-2"
            style={{ color: "var(--secondary)" }}
          >
            portfolio-api — loading{dots}
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={containerRef}
          className="p-4 font-mono text-xs sm:text-sm space-y-1 h-[240px] overflow-y-auto"
        >
          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={`${visibleLines}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                color: line.text.startsWith("✓")
                  ? "#4ade80"
                  : line.text.startsWith("⟳")
                  ? "#facc15"
                  : line.text.startsWith("$")
                  ? "var(--primary)"
                  : "var(--card-foreground)",
              }}
            >
              {line.text}
            </motion.div>
          ))}

          {/* Blinking cursor */}
          {visibleLines < TERMINAL_LINES.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ color: "var(--primary)" }}
            >
              ▊
            </motion.span>
          )}
        </div>
      </div>

      {/* Subtitle */}
      <p
        className="text-sm mt-4 text-center"
        style={{ color: "var(--secondary)" }}
      >
        Waking up the server — free tier takes a moment{dots}
      </p>
    </div>
  );
}
