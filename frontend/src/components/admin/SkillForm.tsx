"use client";

import { useState } from "react";
import type { Skill } from "@/types/skill";
import type { AdminSkillInput } from "@/lib/api/skills";

interface Props {
  skill?: Skill | null;
  onSave: (data: AdminSkillInput) => void;
  onCancel: () => void;
}

function buildInitialForm(skill?: Skill | null): AdminSkillInput {
  if (skill) {
    return {
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      sortOrder: skill.sortOrder,
    };
  }
  return {
    name: "",
    category: "",
    proficiency: 50,
    sortOrder: 0,
  };
}

export function SkillForm({ skill, onSave, onCancel }: Props) {
  const [form, setForm] = useState<AdminSkillInput>(() =>
    buildInitialForm(skill)
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="p-4 rounded-lg border space-y-3"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div>
        <label htmlFor="skill-name" className="block text-sm mb-1">
          Skill Name *
        </label>
        <input
          id="skill-name"
          required
          placeholder="Skill name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full px-3 py-2 rounded border"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
      </div>
      <div>
        <label htmlFor="skill-category" className="block text-sm mb-1">
          Category *
        </label>
        <input
          id="skill-category"
          required
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          className="w-full px-3 py-2 rounded border"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
      </div>
      <div>
        <label htmlFor="skill-proficiency" className="block text-sm mb-1">
          Proficiency: {form.proficiency}%
        </label>
        <input
          id="skill-proficiency"
          type="range"
          min={0}
          max={100}
          value={form.proficiency}
          onChange={(e) =>
            setForm((p) => ({ ...p, proficiency: Number(e.target.value) }))
          }
          className="w-full"
          style={{ accentColor: "var(--primary)" }}
        />
      </div>
      <div>
        <label htmlFor="skill-sort-order" className="block text-sm mb-1">
          Sort Order
        </label>
        <input
          id="skill-sort-order"
          type="number"
          value={form.sortOrder}
          onChange={(e) =>
            setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))
          }
          className="w-full px-3 py-2 rounded border"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded text-sm"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border text-sm"
          style={{ borderColor: "var(--border)" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
