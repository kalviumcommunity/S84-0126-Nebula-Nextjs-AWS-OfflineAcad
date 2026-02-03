"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/schemas";
import FormInput from "@/components/FormInput";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      if (data.email.includes("error")) {
        throw new Error("Invalid Administrator Credentials");
      }

      toast.dismiss(loadingToast);
      toast.success("Login Successful", { icon: "✅" });

      login({
        id: "admin-root-01",
        name: "Head Administrator",
        email: data.email,
        role: "ADMIN"
      }, "mock-admin-access-token");
    } catch (err: any) {
      toast.dismiss(loadingToast);
      setServerError(err.message || "Invalid credentials or server unavailable.");
      toast.error("Authentication Failed", { icon: "❌" });
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0a0b10] overflow-hidden p-6">
      {/* Elevated Admin Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-12 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400">Restricted Admin Access</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Management Console</h1>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">Administrative Portal v2.1</p>
        </div>

        <Card variant="premium" className="backdrop-blur-3xl border-white/5 animate-fade-in-up shadow-2xl" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <FormInput<LoginInput>
                  label="Administrator Email"
                  name="email"
                  type="email"
                  register={register}
                  error={errors.email}
                  placeholder="admin@offline-academy.com"
                />

                <FormInput<LoginInput>
                  label="Password"
                  name="password"
                  type="password"
                  register={register}
                  error={errors.password}
                  placeholder="••••••••"
                />
              </div>

              {serverError && (
                <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl animate-shake">
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-widest text-center">
                    {serverError}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full h-14 text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/20"
                isLoading={isSubmitting}
              >
                Secure Login
              </Button>

              <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-4 leading-relaxed">
                All administrative activities are recorded for security and auditing purposes.
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <button onClick={() => window.history.back()} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
            ← Return to Main Website
          </button>
        </div>
      </div>
    </main>
  );
}
