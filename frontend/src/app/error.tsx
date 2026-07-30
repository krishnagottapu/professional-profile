"use client";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-center mb-6 max-w-md" style={{ color: "var(--secondary)" }}>
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-lg font-semibold"
        style={{ backgroundColor: "var(--primary)", color: "#fff" }}
      >
        Try again
      </button>
    </div>
  );
}
