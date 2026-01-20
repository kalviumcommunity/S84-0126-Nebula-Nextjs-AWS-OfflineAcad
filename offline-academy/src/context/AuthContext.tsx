
"use client";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initialization to avoid setState-in-effect
  const [user, setUser] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("offline_user");
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mark as loaded after hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, []);

  const login = (username: string) => {
    localStorage.setItem("offline_user", username);
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem("offline_user");
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

