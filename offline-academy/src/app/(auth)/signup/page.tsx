"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock login for frontend demo (In real app, API returns this)
      login({
        id: "mock-user-id",
        name: name,
        email: email,
        role: "STUDENT" // Default role
      });
      router.push("/dashboard");
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl font-bold shadow-xl group-hover:scale-110 transition-transform">
              O
            </div>
            <span className="text-3xl font-black tracking-tight text-gradient">
              OfflineAcad
            </span>
          </Link>
        </div>

        {/* Signup Card */}
        <Card className="card-premium !p-0 overflow-hidden border-none shadow-2xl">
          <div className="h-2 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          <CardHeader className="p-8 pb-0 border-none">
            <CardTitle className="text-3xl font-black text-center">Create Account</CardTitle>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Join 50,000+ students learning offline
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="!bg-gray-50 dark:!bg-gray-900/50 border-none focus:ring-2 focus:ring-indigo-500"
              />

              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="!bg-gray-50 dark:!bg-gray-900/50 border-none focus:ring-2 focus:ring-indigo-500"
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="!bg-gray-50 dark:!bg-gray-900/50 border-none focus:ring-2 focus:ring-indigo-500"
              />

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 animate-pulse">
                  <p className="text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </p>
                </div>
              )}

              <Button type="submit" isLoading={isLoading} className="w-full !py-4 !rounded-xl shadow-lg shadow-indigo-500/25 text-lg font-black">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-400">
                  Or
                </span>
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 px-4 leading-relaxed">
              By creating an account, you agree to our <Link href="/" className="text-indigo-600 font-bold">Terms of Service</Link> and <Link href="/" className="text-indigo-600 font-bold">Privacy Policy</Link>.
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-10 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-black text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
