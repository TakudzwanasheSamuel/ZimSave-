
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "zimsave_plus_auth_status"; // Updated key for the new app name

type User = {
  email?: string;
  phone?: string;
  name: string;
};

export function useAuth() {
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
    (loginCredentials: { email?: string; phone?: string }) => {
      const storedUserJson = localStorage.getItem(AUTH_KEY);
      let userToLogin: User | null = null;

      if (storedUserJson) {
        try {
          const storedUserDetails = JSON.parse(storedUserJson) as User;
          if (
            (loginCredentials.email && storedUserDetails.email === loginCredentials.email) ||
            (loginCredentials.phone && storedUserDetails.phone === loginCredentials.phone)
          ) {
            userToLogin = storedUserDetails;
          }
        } catch (error) {
            console.error("Failed to parse stored user for login", error);
        }
      }

      if (!userToLogin) {
        const name = loginCredentials.email 
          ? loginCredentials.email.split('@')[0] 
          : (loginCredentials.phone || "User");
        userToLogin = {
          name: name,
          email: loginCredentials.email,
          phone: loginCredentials.phone,
        };
      }
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(userToLogin));
      setUser(userToLogin);
      router.push("/dashboard");
    },
    [router]
  );

  const signup = useCallback(
    (credentials: { email?: string; phone?: string, name: string }) => {
      const newUser: User = {
        name: credentials.name,
        email: credentials.email,
        phone: credentials.phone,
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      setUser(newUser);
      router.push("/dashboard");
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
