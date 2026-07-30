import { apiFetch, ApiError } from "@/lib/api/client";

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean }> {
  try {
    await apiFetch<{ username: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { success: false };
    }
    return { success: false };
  }
}

export async function logout(): Promise<void> {
  await apiFetch<{ message: string }>("/api/auth/logout", {
    method: "POST",
  });
}

export async function checkAuth(): Promise<{
  loggedIn: boolean;
  username?: string;
}> {
  try {
    const data = await apiFetch<{ username: string }>("/api/auth/me");
    return { loggedIn: true, username: data.username };
  } catch {
    return { loggedIn: false };
  }
}
