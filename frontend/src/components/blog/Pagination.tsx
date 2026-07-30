"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 rounded-lg border text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
        aria-label="Previous page"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="w-9 h-9 rounded-lg border text-sm font-medium transition-colors"
          style={{
            borderColor: page === currentPage ? "var(--primary)" : "var(--border)",
            backgroundColor: page === currentPage ? "var(--primary)" : "transparent",
            color: page === currentPage ? "#ffffff" : "var(--foreground)",
          }}
          aria-label={`Page ${page + 1}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-2 rounded-lg border text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
