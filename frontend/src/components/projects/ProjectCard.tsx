"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Project } from "@/types/project";
import type { GitHubRepo } from "@/types/github";

type ProjectCardProps =
  | { type: "manual"; project: Project }
  | { type: "github"; repo: GitHubRepo };

export function ProjectCard(props: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const title = props.type === "manual" ? props.project.title : props.repo.name;
  const description =
    props.type === "manual"
      ? props.project.description
      : (props.repo.description ?? "No description available.");
  const tags =
    props.type === "manual"
      ? props.project.techTags
      : ([props.repo.language, ...(props.repo.topics ?? [])].filter(Boolean) as string[]);
  const githubUrl =
    props.type === "manual" ? props.project.githubUrl : props.repo.htmlUrl;
  const liveUrl = props.type === "manual" ? props.project.liveUrl : null;
  const stars = props.type === "github" ? props.repo.stargazersCount : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-5 rounded-xl border flex flex-col gap-3 h-full"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-lg">{title}</h3>
        {props.type === "manual" && props.project.featured && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--primary)", color: "#fff" }}
          >
            Featured
          </span>
        )}
      </div>

      <p className="text-sm flex-1" style={{ color: "var(--secondary)" }}>
        {description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1">
        {tags.slice(0, 6).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links + stats */}
      <div className="flex items-center gap-3 text-sm mt-auto">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--primary)" }}
          >
            GitHub ↗
          </a>
        )}
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--primary)" }}
          >
            Live ↗
          </a>
        )}
        {stars !== null && (
          <span className="ml-auto" style={{ color: "var(--secondary)" }}>
            ★ {stars}
          </span>
        )}
      </div>
    </motion.div>
  );
}
