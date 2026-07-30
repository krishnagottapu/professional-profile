import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <h1
        className="text-7xl font-bold mb-4"
        style={{ color: "var(--primary)" }}
      >
        404
      </h1>
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: "var(--foreground)" }}
      >
        Page Not Found
      </h2>
      <p
        className="text-center mb-8 max-w-md"
        style={{ color: "var(--secondary)" }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--primary)", color: "#fff" }}
      >
        Go Home
      </Link>
    </div>
  );
}
