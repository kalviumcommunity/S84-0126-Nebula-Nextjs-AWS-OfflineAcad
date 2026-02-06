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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

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
      login(result.user);
      toast.success("Login successful!");

      router.push(result.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (error: any) {
      toast.dismiss();
      setServerError(error.message || "Invalid credentials or server unavailable.");
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <>
      {/* Global Royal Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Raleway:wght@400;500&display=swap');

        body {
          background: radial-gradient(circle at top left, #1a0f0f, #000);
          color: #f5f5f5;
          font-family: 'Raleway', sans-serif;
          margin: 0;
          height: 100vh;
          overflow: hidden; /* Prevent scrolling */
        }

        .luxury-serif {
          font-family: 'Cormorant Garamond', serif;
        }
      `}</style>

      <div className="h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background royal glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[160px]" />
          <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 w-[400px] h-[400px] bg-amber-400/10 blur-[140px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
            
            
            </Link>
          </div>

          {/* Login Card */}
          <Card className="bg-white/[0.05] border border-amber-400/20 backdrop-blur-xl shadow-2xl rounded-2xl">
            <CardHeader className="p-6 pb-0 border-none text-center">
              <CardTitle className="luxury-serif text-3xl font-light text-amber-200">
                Welcome Back
              </CardTitle>
              <p className="text-neutral-400 text-sm mt-2">
                Sign in to your account to continue learning
              </p>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormInput<LoginInput>
                  label="Email Address"
                  name="email"
                  type="email"
                  register={register}
                  error={errors.email}
                  placeholder="you@example.com"
                  className="bg-black/30 border-amber-400/30 text-amber-50 focus:ring-amber-400"
                />

                <FormInput<LoginInput>
                  label="Password"
                  name="password"
                  type="password"
                  register={register}
                  error={errors.password}
                  placeholder="••••••••"
                  className="bg-black/30 border-amber-400/30 text-amber-50 focus:ring-amber-400"
                />

                <div className="flex justify-end">
                  <Link
                    href="/"
                    className="text-xs font-semibold text-amber-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {serverError && (
                  <div className="border border-red-500/30 bg-red-500/10 rounded-lg p-3 text-sm text-red-300">
                    ⚠️ {serverError}
                  </div>
                )}

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full py-3 text-sm tracking-[0.2em] uppercase bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 rounded-lg shadow-xl"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
                  <span className="px-4  text-neutral-500">OR</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full py-3 rounded-lg border border-amber-400/30 hover:bg-amber-400/10 text-amber-100 font-semibold"
                onClick={() => {
                  toast("Please sign up or use real credentials for RBAC demo", { icon: "ℹ️" });
                }}
              >
                Try Demo Account
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-neutral-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-amber-400 hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}