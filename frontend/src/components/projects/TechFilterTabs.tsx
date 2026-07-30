"use client";

interface Props {
  tags: string[];
  selected: string;
  onSelect: (tag: string) => void;
}

export function TechFilterTabs({ tags, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {["All", ...tags].map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          style={{
            backgroundColor: selected === tag ? "var(--primary)" : "var(--muted)",
            color: selected === tag ? "#fff" : "var(--secondary)",
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
