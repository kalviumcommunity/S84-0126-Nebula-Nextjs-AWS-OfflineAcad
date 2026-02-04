"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/schemas";
import FormInput from "@/components/FormInput";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  // Initialize Form with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Handle Submission
  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    toast.loading("Signing in...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }

      toast.dismiss();
      console.warn("Login Successful:", result.user);

      // result.user contains { id, email, role }
      login(result.user);

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.dismiss();
      setServerError(error.message || "Invalid credentials or server unavailable.");
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-float"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl font-bold shadow-xl group-hover:scale-110 transition-transform">
              O
            </div>
            <span className="text-3xl font-black tracking-tight text-gradient">OfflineAcad</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="card-premium !p-0 overflow-hidden border-none shadow-2xl">
          <div className="h-2 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          <CardHeader className="p-8 pb-0 border-none">
            <CardTitle className="text-3xl font-black text-center">Welcome Back</CardTitle>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Sign in to your account to continue learning
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* React Hook Form + Zod Validation */}
              <FormInput<LoginInput>
                label="Email Address"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                placeholder="you@example.com"
              />

              <FormInput<LoginInput>
                label="Password"
                name="password"
                type="password"
                register={register}
                error={errors.password}
                placeholder="••••••••"
              />

              <div className="flex justify-end">
                <Link
                  href="/"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Forgot password?
                </Link>
              </div>

              {serverError && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                    <span>⚠️</span> {serverError}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full !py-4 !rounded-xl shadow-lg shadow-indigo-500/25 text-lg font-black"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-400">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full !py-4 !rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 font-bold"
              onClick={() => {
                // Quick fill for demo
                toast("Please sign up or use real credentials for RBAC demo", { icon: "ℹ️" });
              }}
            >
              Try Demo Account
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-10 font-medium">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-black text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
