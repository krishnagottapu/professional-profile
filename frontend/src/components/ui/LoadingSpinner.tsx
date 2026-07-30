export function LoadingSpinner() {
  return (
    <div
      className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
      style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }}
      aria-label="Loading"
      role="status"
    />
  );
}
