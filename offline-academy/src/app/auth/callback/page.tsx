"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

/**
 * OAuth Callback Handler
 * Syncs NextAuth session with existing AuthContext
 */
export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const { login } = useAuth();
  const router = useRouter();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    if (status === "loading") return;

    if (status === "authenticated" && session?.user) {
      hasProcessed.current = true;

      // Sync NextAuth session with existing AuthContext
      login({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name || undefined,
        role: session.user.role,
      });

      toast.success("Successfully signed in with Google!");
      
      // Redirect based on role
      const redirectUrl = session.user.role === "ADMIN" ? "/admin" : "/dashboard";
      router.push(redirectUrl);
    } else if (status === "unauthenticated") {
      hasProcessed.current = true;
      toast.error("Authentication failed");
      router.push("/login");
    }
  }, [session, status, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}
