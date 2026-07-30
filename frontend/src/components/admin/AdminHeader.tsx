"use client";

interface Props {
  username: string;
  onOpenSidebar: () => void;
}

export function AdminHeader({ username, onOpenSidebar }: Props) {
  return (
    <header
      className="flex items-center justify-between p-4 border-b"
      style={{
        backgroundColor: "var(--nav)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg lg:hidden"
          style={{ color: "var(--foreground)" }}
          aria-label="Open sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span
          className="font-bold text-sm lg:hidden"
          style={{ color: "var(--foreground)" }}
        >
          Admin Panel
        </span>
      </div>
      <p className="text-sm" style={{ color: "var(--secondary)" }}>
        {username}
      </p>
    </header>
  );
}
