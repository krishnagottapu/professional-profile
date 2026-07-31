"use client";
import { useApi } from "@/hooks/useApi";
import { getSkills } from "@/lib/api/skills";
import { SkillCard } from "@/components/skills/SkillCard";
import { DevLoader } from "@/components/ui/DevLoader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function SkillsPage() {
  const { data: categories, loading, error } = useApi(getSkills);

  if (loading) return <DevLoader />;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load skills: {error}</div>;
  if (!categories?.length) return <div className="text-center py-20">No skills found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">Skills</h1>
      <ErrorBoundary>
        <div className="space-y-12">
          {categories.map((cat) => (
            <section key={cat.category}>
              <h2
                className="text-xl font-semibold mb-4 pb-2 border-b"
                style={{ borderColor: "var(--border)", color: "var(--primary)" }}
              >
                {cat.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </ErrorBoundary>
    </div>
  );
}
