"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/lib/api/skills";
import type { AdminSkillInput } from "@/lib/api/skills";
import { SkillForm } from "@/components/admin/SkillForm";
import type { Skill } from "@/types/skill";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null | "new">(null);

  const fetchSkills = useCallback(async () => {
    try {
      const data = await getAdminSkills();
      setSkills(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const handleSave = async (data: AdminSkillInput) => {
    if (editing === "new") {
      const created = await createSkill(data);
      setSkills((prev) => [...prev, created]);
    } else if (editing) {
      const updated = await updateSkill(editing.id, data);
      setSkills((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    }
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this skill?")) return;
    await deleteSkill(id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) {
    return <p className="text-center py-12">Loading skills...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Skills</h1>
        <button
          onClick={() => setEditing("new")}
          className="px-4 py-2 rounded-lg text-sm"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          + Add Skill
        </button>
      </div>

      {editing === "new" && (
        <div className="mb-6">
          <SkillForm
            skill={null}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {Object.keys(grouped).length === 0 && editing !== "new" && (
        <p className="text-center py-8 opacity-60">
          No skills yet. Add one to get started.
        </p>
      )}

      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold mb-3 opacity-80">{category}</h2>
          <div className="space-y-2">
            {categorySkills.map((skill) => (
              <div key={skill.id}>
                {editing && editing !== "new" && editing.id === skill.id ? (
                  <SkillForm
                    skill={skill}
                    onSave={handleSave}
                    onCancel={() => setEditing(null)}
                  />
                ) : (
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg border"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span className="flex-1 font-medium">{skill.name}</span>
                    <div className="w-32 flex items-center gap-2">
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: "var(--border)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${skill.proficiency}%`,
                            backgroundColor: "var(--primary)",
                          }}
                        />
                      </div>
                      <span className="text-xs opacity-60">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <button
                      onClick={() => setEditing(skill)}
                      className="text-sm px-3 py-1 rounded border"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="text-sm px-3 py-1 rounded border"
                      style={{ borderColor: "#ef4444", color: "#ef4444" }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
