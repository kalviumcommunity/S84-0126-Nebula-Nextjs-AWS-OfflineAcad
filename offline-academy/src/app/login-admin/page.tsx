"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/schemas"; // Reusing schema from 2.19
import FormInput from "@/components/FormInput";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  // 1. Initialize Form with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Handle Submission
  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      // Simulate API Call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.warn("✅ Form Valid & Submitted:", data);

      // Simulate Logic (In real app, we fetch from API)
      if (data.email.includes("error")) {
        throw new Error("Simulated Backend Error");
      }

      // Use Auth Hook with full profile
      // In a real app, this data comes from the API response
      login({
        id: "mock-admin-id",
        name: data.email.split("@")[0],
        email: data.email,
        role: "ADMIN"
      });
      alert("Login Successful!");
    } catch {
      setServerError("Invalid credentials or server unavailable.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-950 p-8 rounded-xl shadow-lg border dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center">Student Login</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Reusable Input Components */}
          <FormInput<LoginInput>
            label="Email Address"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            placeholder="student@kalvium.community"
          />

          <FormInput<LoginInput>
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors.password}
            placeholder="••••••••"
          />

          {serverError && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded border border-red-200">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
