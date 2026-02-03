"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/schemas";
import FormInput from "@/components/FormInput";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
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
    const loadingToast = toast.loading("Verifying credentials...", {
      style: { background: "#0f1117", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }
    });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid credentials");
      }

      toast.dismiss(loadingToast);
      login(result.user, result.accessToken);
      toast.success("Login successful. Welcome back!", { icon: "🎓" });
      router.push("/dashboard");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      setServerError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center px-6 selection:bg-indigo-500/30">
      <div className="mesh-bg" />
      
      <div className="w-full max-w-[440px] z-10 space-y-10 animate-fade-in-up">
        {/* Branding */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-indigo-500/20 text-2xl">
              OA
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tighter text-white block">Offline Academy</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block -mt-1">Learn Everywhere</span>
            </div>
          </Link>
        </div>

        <Card variant="glass" className="border-white/10 bg-black/40 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-50" />
          
          <CardContent className="p-10 space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase font-black tracking-tighter">Sign In</h1>
              <p className="text-slate-400 text-sm font-medium">Enter your credentials to access your courses.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormInput<LoginInput>
                  label="Email Address"
                  name="email"
                  type="email"
                  register={register}
                  error={errors.email}
                  placeholder="your@email.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 rounded-2xl p-4"
                />

                <FormInput<LoginInput>
                  label="Password"
                  name="password"
                  type="password"
                  register={register}
                  error={errors.password}
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 rounded-2xl p-4"
                />
              </div>

              {serverError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-rose-400 text-xs font-bold flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> {serverError}
                  </p>
                </div>
              )}

              <Button type="submit" isLoading={isSubmitting} variant="primary" className="w-full h-14 text-[10px] font-black uppercase tracking-widest">
                Start Learning Now
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                <span className="px-5 bg-[#0a0b10] text-slate-500">New Student?</span>
              </div>
            </div>

            <p className="text-center text-slate-400 text-sm font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-indigo-400 hover:text-white transition-colors font-black ml-1 uppercase text-xs tracking-widest">
                Sign Up Here
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Support Link */}
        <div className="text-center">
          <Link href="/" className="text-[10px] text-slate-600 uppercase font-black tracking-widest hover:text-slate-400 transition-colors">
            Forgot Password?
          </Link>
        </div>
      </div>
    </main>
  );
}
