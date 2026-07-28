---
id: task-17
task: Build admin Projects and Skills management pages with CRUD and drag reorder
agent: frontend
status: approved
depends_on: [task-15]
skills:
  - languages/javascript
  - tooling/eslint
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/admin/projects/page.tsx
    - frontend/src/app/admin/skills/page.tsx
    - frontend/src/components/admin/ProjectForm.tsx
    - frontend/src/components/admin/SkillForm.tsx
    - frontend/src/lib/api/projects.ts
    - frontend/src/lib/api/skills.ts
    - frontend/package.json
acceptance_criteria:
  - Projects page at /admin/projects lists all projects with title, featured badge, sort order, edit and delete buttons
  - Projects can be reordered by drag-and-drop using @dnd-kit/core and @dnd-kit/sortable
  - On drop, PATCH /api/admin/projects/reorder is called with updated sort order values
  - Create/Edit project form in a slide-over panel — fields: title, description, tech tags (comma-separated input), GitHub URL, live URL, featured toggle
  - Delete with confirmation dialog
  - Skills page at /admin/skills groups skills by category with create/edit/delete per skill
  - Skill form has name, category (text input), proficiency slider (0–100 with live value display), sort order
  - All CRUD operations call the correct /api/admin/skills/** endpoints
  - @dnd-kit/core and @dnd-kit/sortable added to package.json
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Add dnd-kit to package.json

```json
"@dnd-kit/core": "^6.1.0",
"@dnd-kit/sortable": "^8.0.0"
```

### 2. Add admin methods to `frontend/src/lib/api/projects.ts`

```ts
// Append to existing projects.ts

export interface AdminProjectInput {
  title: string;
  description?: string;
  techTags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  sortOrder: number;
}

export function getAdminProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/api/admin/projects");
}

export function createProject(data: AdminProjectInput): Promise<Project> {
  return apiFetch<Project>("/api/admin/projects", {
    method: "POST", body: JSON.stringify(data),
  });
}

export function updateProject(id: number, data: AdminProjectInput): Promise<Project> {
  return apiFetch<Project>(`/api/admin/projects/${id}`, {
    method: "PUT", body: JSON.stringify(data),
  });
}

export function deleteProject(id: number): Promise<void> {
  return apiFetch<void>(`/api/admin/projects/${id}`, { method: "DELETE" });
}

export function reorderProjects(items: { id: number; sortOrder: number }[]): Promise<void> {
  return apiFetch<void>("/api/admin/projects/reorder", {
    method: "PATCH", body: JSON.stringify(items),
  });
}
```

### 3. Add admin methods to `frontend/src/lib/api/skills.ts`

```ts
// Append to existing skills.ts

export interface AdminSkillInput {
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
}

export function getAdminSkills(): Promise<Skill[]> {
  return apiFetch<Skill[]>("/api/admin/skills");
}

export function createSkill(data: AdminSkillInput): Promise<Skill> {
  return apiFetch<Skill>("/api/admin/skills", {
    method: "POST", body: JSON.stringify(data),
  });
}

export function updateSkill(id: number, data: AdminSkillInput): Promise<Skill> {
  return apiFetch<Skill>(`/api/admin/skills/${id}`, {
    method: "PUT", body: JSON.stringify(data),
  });
}

export function deleteSkill(id: number): Promise<void> {
  return apiFetch<void>(`/api/admin/skills/${id}`, { method: "DELETE" });
}
```

### 4. Create `frontend/src/components/admin/ProjectForm.tsx`

Slide-over panel with form fields:

```tsx
"use client";
import { useState, useEffect } from "react";
import type { Project } from "@/types/project";
import type { AdminProjectInput } from "@/lib/api/projects";

interface Props {
  project?: Project | null;
  onSave: (data: AdminProjectInput) => void;
  onClose: () => void;
}

export function ProjectForm({ project, onSave, onClose }: Props) {
  const [form, setForm] = useState<AdminProjectInput>({
    title: "", description: "", techTags: [], githubUrl: "", liveUrl: "",
    featured: false, sortOrder: 0,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (project) {
      setForm({ title: project.title, description: project.description ?? "",
                techTags: project.techTags, githubUrl: project.githubUrl ?? "",
                liveUrl: project.liveUrl ?? "", featured: project.featured, sortOrder: project.sortOrder });
      setTagInput(project.techTags.join(", "));
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, techTags: tagInput.split(",").map(t => t.trim()).filter(Boolean) });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="w-full max-w-md h-full overflow-y-auto p-6"
           style={{ backgroundColor: "var(--card)", borderLeft: "1px solid var(--border)" }}>
        <div className="flex justify-between mb-6">
          <h2 className="font-bold text-lg">{project ? "Edit Project" : "New Project"}</h2>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title *</label>
            <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                   className="w-full px-3 py-2 rounded border"
                   style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      className="w-full px-3 py-2 rounded border resize-none"
                      style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          <div>
            <label className="block text-sm mb-1">Tech Tags (comma separated)</label>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                   placeholder="Java, Spring Boot, Docker"
                   className="w-full px-3 py-2 rounded border"
                   style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          <div>
            <label className="block text-sm mb-1">GitHub URL</label>
            <input type="url" value={form.githubUrl} onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))}
                   className="w-full px-3 py-2 rounded border"
                   style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          <div>
            <label className="block text-sm mb-1">Live URL</label>
            <input type="url" value={form.liveUrl} onChange={e => setForm(p => ({ ...p, liveUrl: e.target.value }))}
                   className="w-full px-3 py-2 rounded border"
                   style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.featured}
                   onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
            Featured project
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2 rounded-lg text-sm"
                    style={{ backgroundColor: "var(--primary)", color: "#fff" }}>Save</button>
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm border"
                    style={{ borderColor: "var(--border)" }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 5. Create `frontend/src/app/admin/projects/page.tsx`

Use `@dnd-kit/sortable` for drag-and-drop reorder. Key implementation:

```tsx
"use client";
import { useState, useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getAdminProjects, createProject, updateProject, deleteProject, reorderProjects } from "@/lib/api/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Project } from "@/types/project";

function SortableRow({ project, onEdit, onDelete }: {
  project: Project; onEdit: (p: Project) => void; onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style}
         className="flex items-center gap-3 p-4 rounded-lg border mb-2"
         style2={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
      <span {...attributes} {...listeners} className="cursor-grab text-lg" aria-label="Drag to reorder">⠿</span>
      <span className="flex-1">{project.title}</span>
      {project.featured && (
        <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}>Featured</span>
      )}
      <button onClick={() => onEdit(project)} className="text-sm px-3 py-1 rounded border"
              style={{ borderColor: "var(--border)" }}>Edit</button>
      <button onClick={() => onDelete(project.id)} className="text-sm px-3 py-1 rounded border"
              style={{ borderColor: "#ef4444", color: "#ef4444" }}>Delete</button>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null | "new">(null);

  useEffect(() => { getAdminProjects().then(setProjects); }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = projects.findIndex(p => p.id === active.id);
    const newIdx = projects.findIndex(p => p.id === over.id);
    const reordered = arrayMove(projects, oldIdx, newIdx).map((p, i) => ({ ...p, sortOrder: i }));
    setProjects(reordered);
    await reorderProjects(reordered.map(p => ({ id: p.id, sortOrder: p.sortOrder })));
  };

  const handleSave = async (data: Parameters<typeof createProject>[0]) => {
    if (!editingProject || editingProject === "new") {
      const created = await createProject(data);
      setProjects(p => [...p, created]);
    } else {
      const updated = await updateProject(editingProject.id, data);
      setProjects(p => p.map(x => x.id === updated.id ? updated : x));
    }
    setEditingProject(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    setProjects(p => p.filter(x => x.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={() => setEditingProject("new")}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
          + New Project
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {projects.map(p => (
            <SortableRow key={p.id} project={p}
                         onEdit={setEditingProject}
                         onDelete={handleDelete} />
          ))}
        </SortableContext>
      </DndContext>

      {editingProject !== null && (
        <ProjectForm
          project={editingProject === "new" ? null : editingProject}
          onSave={handleSave}
          onClose={() => setEditingProject(null)} />
      )}
    </div>
  );
}
```

### 6. Create `frontend/src/components/admin/SkillForm.tsx`

Inline form (not slide-over) for skill editing — simpler since skills are small:

```tsx
"use client";
import type { Skill } from "@/types/skill";
import type { AdminSkillInput } from "@/lib/api/skills";
import { useState, useEffect } from "react";

interface Props {
  skill?: Skill | null;
  onSave: (data: AdminSkillInput) => void;
  onCancel: () => void;
}

export function SkillForm({ skill, onSave, onCancel }: Props) {
  const [form, setForm] = useState<AdminSkillInput>({
    name: "", category: "", proficiency: 50, sortOrder: 0,
  });

  useEffect(() => {
    if (skill) setForm({ name: skill.name, category: skill.category,
                         proficiency: skill.proficiency, sortOrder: skill.sortOrder });
  }, [skill]);

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }}
          className="p-4 rounded-lg border space-y-3"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
      <input required placeholder="Skill name" value={form.name}
             onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
             className="w-full px-3 py-2 rounded border"
             style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
      <input required placeholder="Category" value={form.category}
             onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
             className="w-full px-3 py-2 rounded border"
             style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
      <div>
        <label className="block text-sm mb-1">Proficiency: {form.proficiency}%</label>
        <input type="range" min={0} max={100} value={form.proficiency}
               onChange={e => setForm(p => ({ ...p, proficiency: Number(e.target.value) }))}
               className="w-full" style={{ accentColor: "var(--primary)" }} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 rounded text-sm"
                style={{ backgroundColor: "var(--primary)", color: "#fff" }}>Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border text-sm"
                style={{ borderColor: "var(--border)" }}>Cancel</button>
      </div>
    </form>
  );
}
```

### 7. Create `frontend/src/app/admin/skills/page.tsx`

Groups skills by category. Each group shows skills with edit/delete. "Add Skill" button opens `SkillForm` inline.

- Fetch all skills flat via `getAdminSkills()`
- Group by `category` using `reduce` or `Map`
- Each skill row shows name, proficiency bar (static, not animated), edit/delete buttons
- Inline SkillForm appears at bottom of the relevant category when editing, or at top when creating new
