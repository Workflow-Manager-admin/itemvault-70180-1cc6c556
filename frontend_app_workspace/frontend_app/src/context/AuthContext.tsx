"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { login as apiLogin, logout as apiLogout, getAuthToken, setAuthToken } from "../utils/api";
import { toast } from "react-toastify";

interface User {
  username: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate token/session on load
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Optionally, fetch user info here
      setUser({ username: "user" });
    }
    setLoading(false);
  }, []);

  // PUBLIC_INTERFACE
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiLogin(username, password);
      setAuthToken(res.data.token);
      setUser({ username });
      toast.success("Login successful.");
    } catch (err) {
      setAuthToken(null);
      setUser(null);
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(
        error?.response?.data?.detail || "Login failed. Check your credentials."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    setAuthToken(null);
    setUser(null);
    toast.info("Logged out.");
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
