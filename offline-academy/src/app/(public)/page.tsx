"use client";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function Home() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useUI();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">OfflineEdu Engine</h1>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded border border-gray-500 p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Current Theme: {theme.toUpperCase()}
        </button>
      </div>

      {/* Auth State Demo */}
      <div className="w-full max-w-md rounded-lg border p-8 text-center shadow-lg">
        {isAuthenticated ? (
          <div className="space-y-4">
            <h2 className="text-2xl text-green-500">Welcome back, {user}!</h2>
            <p>Your session is active.</p>
            <button
              onClick={logout}
              className="rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl text-yellow-500">Guest Access</h2>
            <p>Please simulate a login.</p>
            <button
              onClick={() => login("Student_01")}
              className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
            >
              Simulate Login
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
