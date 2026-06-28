"use client";

// 客户端认证 Hook
import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data);
    } catch (e) {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) setSession(data);
    return { ok: res.ok, error: data.error };
  };

  const logout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    setSession(null);
  };

  return { session, loading, login, logout, refresh: fetchSession };
}
