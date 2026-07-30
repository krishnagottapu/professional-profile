"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

export interface TimelineItem {
  type: "education" | "work";
  title: string;
  subtitle: string;
  period: string;
  location?: string;
  current?: boolean;
  bullets?: string[];
  techTags?: string[];
  startYear: number;
  endYear: number;
}

interface VerticalTimelineProps {
  items: TimelineItem[];
}

function getDurationLabel(item: TimelineItem): string {
  const startDate = new Date(item.startYear, 6, 1);
  const endDate = item.current ? new Date() : new Date(item.endYear, 6, 1);

  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) return `${months} mo`;
  if (months === 0) return `${years} yr`;
  return `${years} yr ${months} mo`;
}

/* #6 — Counter animation for the header */
export function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const duration = 1500;
    const step = duration / target;
    const timer = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}+</span>;
}

export function VerticalTimeline({ items }: VerticalTimelineProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(
    new Date().getFullYear()
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-50px" });

  // Generate year markers
  const timelineStart = Math.min(...items.map((i) => i.startYear));
  const timelineEnd = new Date().getFullYear();
  const yearMarkers: number[] = [];
  for (let y = timelineEnd; y >= timelineStart; y -= 2) {
    yearMarkers.push(y);
  }
  if (!yearMarkers.includes(timelineStart)) {
    yearMarkers.push(timelineStart);
  }

  function isItemActive(item: TimelineItem, year: number): boolean {
    return year >= item.startYear && year <= item.endYear;
  }

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      {/* Year selector bar — #4 hover ripple */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {yearMarkers.map((year) => {
          const isSelected = selectedYear === year;
          return (
            <motion.button
              key={year}
              onClick={() => setSelectedYear(isSelected ? null : year)}
              whileHover={{ scale: 1.15, boxShadow: "0 0 12px color-mix(in srgb, var(--primary) 40%, transparent)" }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors duration-200 cursor-pointer"
              style={{
                backgroundColor: isSelected ? "var(--primary)" : "var(--card)",
                borderColor: isSelected ? "var(--primary)" : "var(--border)",
                color: isSelected ? "#fff" : "var(--secondary)",
              }}
              aria-label={`Filter by year ${year}`}
            >
              {year}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 justify-center">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full opacity-60"
            style={{ backgroundColor: "var(--secondary)" }}
          />
          <span className="text-xs" style={{ color: "var(--secondary)" }}>
            Education
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--primary)" }}
          />
          <span className="text-xs" style={{ color: "var(--secondary)" }}>
            Work
          </span>
        </div>
      </div>

      <div className="relative">
        {/* #7 — Connecting line draws itself */}
        <motion.div
          className="absolute left-[60px] sm:left-[80px] top-0 bottom-0 w-0.5 rounded-full origin-top"
          style={{ backgroundColor: "var(--border)" }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          aria-hidden="true"
        />

        {/* Timeline entries */}
        <div className="space-y-0">
          {items.map((item, i) => {
            const isExpanded = expandedIndex === i;
            const isEducation = item.type === "education";
            const isActive =
              selectedYear === null || isItemActive(item, selectedYear);

            return (
              /* #1 — Staggered card entrance from right */
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                animate={
                  inView
                    ? { opacity: isActive ? 1 : 0.25, x: 0 }
                    : { opacity: 0, x: 40 }
                }
                transition={{
                  duration: 0.5,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
                className="relative flex items-stretch gap-4 sm:gap-6"
                style={{
                  minHeight: `${Math.max((item.endYear - item.startYear) * 10, 16) + 48}px`,
                }}
              >
                {/* Year label with vertical progress bar */}
                <div className="flex-shrink-0 w-[48px] sm:w-[64px] flex flex-col items-center justify-center">
                  <span
                    className="text-xs"
                    style={{ color: "var(--secondary)" }}
                  >
                    {item.endYear === new Date().getFullYear()
                      ? "Now"
                      : item.endYear}
                  </span>
                  {/* #2 — Progress bar fill animation */}
                  <div
                    className="relative group cursor-default"
                    style={{
                      width: "4px",
                      height: `${Math.max((item.endYear - item.startYear) * 10, 16)}px`,
                      backgroundColor: "var(--border)",
                      borderRadius: "9999px",
                      margin: "4px 0",
                    }}
                    title={getDurationLabel(item)}
                  >
                    <motion.div
                      className="absolute top-0 w-full rounded-full"
                      initial={{ height: 0 }}
                      animate={inView ? { height: "100%" } : { height: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5 + i * 0.2,
                        ease: "easeOut",
                      }}
                      style={{
                        backgroundColor: isEducation
                          ? "var(--secondary)"
                          : "var(--primary)",
                        opacity: isEducation ? 0.6 : 1,
                      }}
                    />
                    {/* Tooltip */}
                    <span
                      className="absolute top-1/2 -translate-y-1/2 -left-2 -translate-x-full px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20"
                      style={{
                        backgroundColor: "var(--foreground)",
                        color: "var(--background)",
                      }}
                    >
                      {getDurationLabel(item)}
                    </span>
                  </div>
                  <span
                    className="text-xs sm:text-sm font-bold"
                    style={{
                      color: isExpanded
                        ? "var(--primary)"
                        : "var(--secondary)",
                    }}
                  >
                    {item.startYear}
                  </span>
                </div>

                {/* #3 — Dot pulse on active items */}
                <div className="flex-shrink-0 relative pt-5">
                  <motion.div
                    className="w-4 h-4 rounded-full border-[3px] z-10"
                    style={{
                      backgroundColor: isExpanded
                        ? "var(--primary)"
                        : isEducation
                        ? "var(--secondary)"
                        : "var(--primary)",
                      borderColor: "var(--background)",
                    }}
                    animate={
                      isActive && selectedYear !== null
                        ? {
                            scale: [1, 1.4, 1],
                            boxShadow: [
                              "0 0 0 0px color-mix(in srgb, var(--primary) 40%, transparent)",
                              "0 0 0 8px color-mix(in srgb, var(--primary) 0%, transparent)",
                              "0 0 0 0px color-mix(in srgb, var(--primary) 0%, transparent)",
                            ],
                          }
                        : { scale: 1, boxShadow: "none" }
                    }
                    transition={
                      isActive && selectedYear !== null
                        ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.2 }
                    }
                    aria-hidden="true"
                  />
                </div>

                {/* #5 — Card with hover lift */}
                <div className="flex-1 pb-6">
                  <motion.button
                    onClick={() => {
                      setExpandedIndex(isExpanded ? null : i);
                      // Sync year selector to this card's start year
                      if (!isExpanded) {
                        const matchingYear = yearMarkers.find(
                          (y) => y >= item.startYear && y <= item.endYear
                        );
                        if (matchingYear !== undefined) {
                          setSelectedYear(matchingYear);
                        } else {
                          setSelectedYear(item.startYear);
                        }
                      }
                    }}
                    whileHover={{
                      y: -2,
                      boxShadow: "0 8px 20px color-mix(in srgb, var(--primary) 12%, transparent)",
                    }}
                    animate={
                      isExpanded
                        ? {
                            borderColor: "var(--primary)",
                            boxShadow: "0 4px 16px color-mix(in srgb, var(--primary) 20%, transparent)",
                          }
                        : {
                            borderColor: "var(--border)",
                            boxShadow: "none",
                          }
                    }
                    transition={{ duration: 0.2 }}
                    className="w-full text-left p-4 sm:p-5 rounded-xl border-2 cursor-pointer"
                    style={{
                      backgroundColor: isExpanded
                        ? "color-mix(in srgb, var(--primary) 5%, var(--card))"
                        : "var(--card)",
                      borderLeft: isExpanded
                        ? "4px solid var(--primary)"
                        : undefined,
                    }}
                    aria-expanded={isExpanded}
                  >
                    {/* Always visible: highlight summary */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: isEducation
                            ? "color-mix(in srgb, var(--secondary) 20%, transparent)"
                            : "var(--primary)",
                          color: isEducation ? "var(--secondary)" : "#fff",
                        }}
                      >
                        {isEducation
                          ? "Education"
                          : item.current
                          ? "Current"
                          : "Work"}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--secondary)" }}
                      >
                        {item.period}
                      </span>
                      {/* Expand indicator */}
                      <motion.span
                        className="ml-auto text-xs"
                        style={{ color: "var(--secondary)" }}
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.span>
                    </div>

                    <h3
                      className="text-base sm:text-lg font-bold leading-tight"
                      style={{ color: "var(--foreground)" }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="text-sm font-medium mt-0.5"
                      style={{ color: "var(--primary)" }}
                    >
                      {item.subtitle}
                    </p>

                    {item.location && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--secondary)" }}
                      >
                        {item.location}
                      </p>
                    )}

                    {/* Tech tags */}
                    {item.techTags && item.techTags.length > 0 && (
                      <div
                        className="flex flex-wrap gap-1.5 mt-3"
                        aria-label="Technologies used"
                      >
                        {item.techTags
                          .slice(0, isExpanded ? undefined : 5)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-md font-medium"
                              style={{
                                backgroundColor:
                                  "color-mix(in srgb, var(--primary) 12%, transparent)",
                                color: "var(--primary)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        {!isExpanded && item.techTags.length > 5 && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-md font-medium"
                            style={{ color: "var(--secondary)" }}
                          >
                            +{item.techTags.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && item.bullets && item.bullets.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <ul
                            className="space-y-2 mt-4 pt-4 border-t"
                            style={{ borderColor: "var(--border)" }}
                            role="list"
                          >
                            {item.bullets.map((bullet, bi) => (
                              <motion.li
                                key={bi}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: bi * 0.05 }}
                                className="text-sm flex gap-2"
                              >
                                <span
                                  style={{ color: "var(--primary)" }}
                                  aria-hidden="true"
                                >
                                  ▹
                                </span>
                                <span
                                  style={{ color: "var(--card-foreground)" }}
                                >
                                  {bullet}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
