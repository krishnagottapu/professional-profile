// Empty base URL — requests go through the Next.js proxy at /api/[...path]/route.ts
// which forwards them to the backend at localhost:8080 and handles cookies correctly.
const BASE_URL = "";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body?.message || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}
