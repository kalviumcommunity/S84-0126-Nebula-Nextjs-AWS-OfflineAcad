"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    toast.loading("Creating your account...");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Signup failed");
      }

      toast.dismiss();
      toast.success("Welcome to Offline Academy ✨");

      login({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      });

      router.push(result.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err: any) {
      toast.dismiss();
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
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

      <div className="h-screen flex flex-col items-center justify-center px-3 relative overflow-hidden">
        {/* Background royal glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[160px]" />
          <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 w-[400px] h-[400px] bg-amber-400/10 blur-[140px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-3">
            
        
            </Link>
          </div>

          {/* Card */}
          <Card className= " bg-white/[0.04] border border-amber-400/20 backdrop-blur-xl shadow-2xl rounded-2xl">
            <CardContent className="p-5">
              <h1 className="luxury-serif text-3xl font-light text-center  text-amber-400">
                Create your account
              </h1>
              <p className="text-center text-neutral-400 text-sm mb-6">
                Begin your journey toward refined learning
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  className="bg-black/30 border-amber-400/30 text-amber-50 focus:ring-amber-400"
                />

                <Input
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="bg-black/30 border-amber-400/30 text-amber-50 focus:ring-amber-400"
                />

                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className="bg-black/30 border-amber-400/30 text-amber-50 focus:ring-amber-400"
                />

                {/* Role selection */}
                <div>
                  <p className="text-xs tracking-widest uppercase text-neutral-400 mb-2">
                    Choose your path
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {["STUDENT", "ADMIN"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r as any)}
                        className={`p-4 rounded-lg border transition-all text-left ${
                          role === r
                            ? "border-amber-400 bg-amber-400/10 shadow-lg"
                            : "border-white/10 hover:border-amber-200/30"
                        }`}
                      >
                        <div className="luxury-serif text-lg mb-1 text-amber-400">
                          {r === "STUDENT" ? "Student" : "Administrator"}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {r === "STUDENT"
                            ? "Access curated courses"
                            : "Manage and curate content"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="border border-red-500/30 bg-red-500/10 rounded-lg p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full py-3 text-sm tracking-[0.2em] uppercase bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 rounded-lg shadow-xl"
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </form>

              <p className="text-xs text-neutral-400 text-center mt-4">
                By continuing, you agree to our{" "}
                <Link href="/" className="text-amber-400 hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/" className="text-amber-400 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-neutral-400 mt-6 mb-10">
            Already a member?{" "}
            <Link
              href="/login"
              className="text-amber-400 hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}