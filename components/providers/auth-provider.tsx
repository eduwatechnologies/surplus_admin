"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  user: AdminUser | null;
  token: string | null;
  setAuth: (payload: { user: AdminUser; token: string }) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const t = localStorage.getItem("admin_token");
      const u = localStorage.getItem("admin_user");
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

  const setAuth = (payload: { user: AdminUser; token: string }) => {
    setUser(payload.user);
    setToken(payload.token);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", payload.token);
      localStorage.setItem("admin_user", JSON.stringify(payload.user));
      try {
        document.cookie = `admin_token=${payload.token}; path=/; SameSite=Lax`;
      } catch {}
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      try {
        document.cookie = "admin_token=; Max-Age=0; path=/; SameSite=Lax";
      } catch {}
      window.location.href = "/login";
    }
  };

  const value = useMemo(() => ({ user, token, setAuth, signOut }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
