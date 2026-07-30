"use client";

import { motion } from "framer-motion";
import { SkillBar } from "./SkillBar";
import type { SkillDto } from "@/types";

interface SkillCategoryProps {
  category: string;
  skills: SkillDto[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function SkillCategory({ category, skills }: SkillCategoryProps) {
  return (
    <section>
      <h2
        className="text-xl font-semibold mb-4 pb-2 border-b"
        style={{ borderColor: "var(--border)", color: "var(--primary)" }}
      >
        {category}
      </h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            variants={itemVariants}
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <SkillBar name={skill.name} proficiency={skill.proficiency} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
