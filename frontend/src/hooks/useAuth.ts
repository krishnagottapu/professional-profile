"use client";

import { useState, useEffect } from "react";
import { getMe, logout as apiLogout } from "@/lib/api/auth";

interface AuthState {
  user: { username: string } | null;
  loading: boolean;
}

export function useAuth(): AuthState & { logout: () => Promise<void> } {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async (retries = 2, delay = 300): Promise<void> => {
      try {
        const user = await getMe();
        if (!cancelled) setState({ user, loading: false });
      } catch {
        if (retries > 0 && !cancelled) {
          await new Promise((r) => setTimeout(r, delay));
          return checkAuth(retries - 1, delay * 2);
        }
        if (!cancelled) setState({ user: null, loading: false });
      }
    };

    checkAuth();
    return () => { cancelled = true; };
  }, []);

  const logout = async () => {
    await apiLogout().catch(() => {});
    setState({ user: null, loading: false });
  };

  return { ...state, logout };
}
