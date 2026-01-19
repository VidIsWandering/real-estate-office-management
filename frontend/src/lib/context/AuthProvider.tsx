"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/api";
import { post, ApiError } from "@/lib/api/client";

interface User {
  id: number;
  username: string;
  name: string;
  email: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateMyProfile: (data: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    preferences?: Record<string, unknown>;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("auth_token");
  const isAuthenticated = hasToken && !!user;

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setUser(null);
          return;
        }

        const response = await getProfile();
        const profile = response.data;
        setUser({
          id: profile.id,
          username: profile.username,
          name: profile.full_name || profile.username,
          email: profile.email,
          role: profile.position,
        });
      } catch {
        // Token invalid/expired or backend unreachable -> clear local token
        localStorage.removeItem("auth_token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await post<{
        success: boolean;
        data: { tokens: { access_token: string } };
      }>("/auth/login", { username, password });

      localStorage.setItem("auth_token", response.data.tokens.access_token);

      await refreshProfile();
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setUser(null);
      return;
    }

    const profileResponse = await getProfile();
    const profile = profileResponse.data;
    setUser({
      id: profile.id,
      username: profile.username,
      name: profile.full_name || profile.username,
      email: profile.email,
      role: profile.position,
    });
  };

  const updateMyProfile: AuthContextType["updateMyProfile"] = async (data) => {
    await updateProfile(data);
    await refreshProfile();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        refreshProfile,
        updateMyProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
