"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "@/lib/api/projects";
import type { AdminProjectInput } from "@/lib/api/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Project } from "@/types/project";

function SortableRow({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 rounded-lg border mb-2"
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab text-lg select-none"
        aria-label="Drag to reorder"
      >
        ⠿
      </span>
      <span className="flex-1 font-medium">{project.title}</span>
      {project.featured && (
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          Featured
        </span>
      )}
      <button
        onClick={() => onEdit(project)}
        className="text-sm px-3 py-1 rounded border"
        style={{ borderColor: "var(--border)" }}
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(project.id)}
        className="text-sm px-3 py-1 rounded border"
        style={{ borderColor: "#ef4444", color: "#ef4444" }}
      >
        Delete
      </button>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<
    Project | null | "new"
  >(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getAdminProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = projects.findIndex((p) => p.id === active.id);
    const newIdx = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIdx, newIdx).map((p, i) => ({
      ...p,
      sortOrder: i,
    }));
    setProjects(reordered);
    await reorderProjects(
      reordered.map((p) => ({ id: p.id, sortOrder: p.sortOrder }))
    );
  };

  const handleSave = async (data: AdminProjectInput) => {
    if (editingProject === "new") {
      const created = await createProject(data);
      setProjects((p) => [...p, created]);
    } else if (editingProject) {
      const updated = await updateProject(editingProject.id, data);
      setProjects((p) => p.map((x) => (x.id === updated.id ? updated : x)));
    }
    setEditingProject(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  if (loading) {
    return <p className="text-center py-12">Loading projects...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setEditingProject("new")}
          className="px-4 py-2 rounded-lg text-sm"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-center py-8 opacity-60">
          No projects yet. Create one to get started.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {projects.map((p) => (
              <SortableRow
                key={p.id}
                project={p}
                onEdit={setEditingProject}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {editingProject !== null && (
        <ProjectForm
          project={editingProject === "new" ? null : editingProject}
          onSave={handleSave}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}
