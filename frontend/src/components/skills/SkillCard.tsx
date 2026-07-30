import { AnimatedProgressBar } from "./AnimatedProgressBar";
import type { Skill } from "@/types/skill";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div
      className="p-4 rounded-lg border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <AnimatedProgressBar proficiency={skill.proficiency} label={skill.name} />
    </div>
  );
}
