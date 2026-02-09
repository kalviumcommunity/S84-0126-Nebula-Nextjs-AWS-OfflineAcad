"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import LogoutModal from "@/components/LogoutModal";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useUI();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    toast.loading("Logging out...");

    setTimeout(() => {
      toast.dismiss();
      toast.success("Logged out successfully");
      logout();
      router.push("/login");
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group transition-all hover-lift">
            <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg font-bold text-sm shadow-md group-hover:scale-110 transition-transform duration-300">
              O
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">OfflineAcad</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-purple-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  href={user?.role === "ADMIN" ? "/admin" : "/dashboard"} 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-purple-700 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href={user?.role === "ADMIN" ? "/admin/courses" : "/courses"} 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 relative group"
                >
                  Courses
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-purple-700 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle - Lamp Icon */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group animate-bounce-gentle"
              title="Toggle theme (Lamp)"
              suppressHydrationWarning
            >
              <div className="text-lg group-hover:rotate-12 transition-transform duration-300">
                {mounted && (theme === "light" ? "💡" : "🔦")}
                {!mounted && "💡"} {/* Default to light icon on server to prevent empty flash, or just match server default */}
              </div>
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Welcome back,</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || "User"}</span>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-300 font-medium text-sm button-interactive hover-lift"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 button-interactive hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </header>
  );
}