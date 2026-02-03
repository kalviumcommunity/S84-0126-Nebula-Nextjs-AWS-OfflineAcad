"use client";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Role } from "@prisma/client";

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  name?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("offline_user_profile");
      try {
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = (userProfile: UserProfile, token: string) => {
    localStorage.setItem("offline_user_profile", JSON.stringify(userProfile));
    localStorage.setItem("offline_token", JSON.stringify(token));
    setUser(userProfile);
  };

  const logout = () => {
    localStorage.removeItem("offline_user_profile");
    localStorage.removeItem("offline_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Internal Hook for direct context access (Private)
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
}
