
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "zimvest_auth_status";

type User = {
  email?: string;
  phone?: string;
  name: string;
};

export function useAuthSimulation() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(AUTH_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (credentials: { email?: string; phone?: string }) => {
      const mockUser: User = {
        name: "Simulated User",
        ...credentials,
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      router.push("/dashboard");
    },
    [router]
  );

  const signup = useCallback(
    (credentials: { email?: string; phone?: string, name: string }) => {
      const mockUser: User = {
        name: credentials.name,
        email: credentials.email,
        phone: credentials.phone,
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      router.push("/dashboard"); // Or to an onboarding step
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    router.push("/");
  }, [router]);

  return { user, login, signup, logout, isLoading, isAuthenticated: !!user };
}
