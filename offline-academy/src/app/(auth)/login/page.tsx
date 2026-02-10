"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/schemas";
import FormInput from "@/components/FormInput";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { toast } from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { signIn } from "next-auth/react";

type LoginMethod = "password" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Check for OAuth errors in URL
  useEffect(() => {
    const error = searchParams?.get("error");
    if (error) {
      if (error === "OAuthAccountNotLinked") {
        setServerError("This email is already registered with a password. Please sign in with your password or try a different Google account.");
        toast.error("Account already exists with password login");
      } else {
        setServerError("Authentication error. Please try again.");
        toast.error("Sign in failed");
      }
    }
  }, [searchParams]);

  // Initialize Form with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Handle Password Login
  const onPasswordSubmit = async (data: LoginInput) => {
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

  // Send OTP via EmailJS
  const sendOTP = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setServerError(null);
    toast.loading("Sending OTP...");

    try {
      console.log("[OTP] Starting OTP send for email:", email);
      
      // Get OTP from backend
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log("[OTP] Backend response:", { success: result.success, hasOTP: !!result.otp });

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send OTP");
      }

      // Verify OTP is generated
      if (!result.otp || result.otp.length !== 6) {
        console.error("[OTP] Invalid OTP generated:", result.otp);
        throw new Error("Invalid OTP generated");
      }

      console.log("[OTP] Generated 6-digit OTP successfully");

      // Verify EmailJS credentials
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      console.log("[EmailJS] Credentials check:", {
        hasServiceId: !!serviceId,
        hasTemplateId: !!templateId,
        hasPublicKey: !!publicKey,
        serviceId: serviceId?.substring(0, 8) + "...",
      });

      if (!serviceId || !templateId || !publicKey) {
        console.error("[EmailJS] Missing credentials");
        throw new Error("EmailJS configuration missing");
      }

      // Send email using EmailJS
      // Using standard template variable names that EmailJS typically expects
      const emailParams = {
        email: result.email,
        name: result.userName || "User",
        otp: result.otp,
      };

      console.log("[EmailJS] Sending email with params:", emailParams);

      const emailResponse = await emailjs.send(
        serviceId,
        templateId,
        emailParams,
        publicKey
      );

      console.log("[EmailJS] Email sent successfully:", emailResponse.status, emailResponse.text);

      toast.dismiss();
      toast.success("OTP sent to your email!");
      setOtpSent(true);
      setOtpEmail(email);
    } catch (error: any) {
      console.error("[OTP] Error sending OTP:", error);
      
      // Detailed EmailJS error logging
      if (error.status === 422 || error.text?.includes("422")) {
        console.error("[EmailJS] 422 Error - Template variable mismatch!");
        console.error("[EmailJS] Expected template variables: {{email}}, {{name}}, {{otp}}");
        console.error("[EmailJS] Check your EmailJS template at https://dashboard.emailjs.com/admin/templates");
        console.error("[EmailJS] Make sure template variables match exactly (case-sensitive)");
      }
      
      toast.dismiss();
      const errorMsg = error.text || error.message || "Failed to send OTP";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Verify OTP and Login
  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    setServerError(null);
    toast.loading("Verifying OTP...");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid OTP");
      }

      toast.dismiss();
      login(result.user);
      toast.success("Login successful!");
      router.push(result.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (error: any) {
      toast.dismiss();
      setServerError(error.message || "Invalid OTP");
      toast.error(error.message || "Invalid OTP");
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      toast.loading("Redirecting to Google...");
      await signIn("google", {
        callbackUrl: "/auth/callback",
        redirect: true,
      });
    } catch (error: any) {
      toast.dismiss();
      toast.error("Failed to sign in with Google");
      setServerError("Failed to sign in with Google");
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
            {/* Login Method Tabs */}
            <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md font-bold transition-all ${
                  loginMethod === "password"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => {
                  setLoginMethod("password");
                  setOtpSent(false);
                  setServerError(null);
                }}
              >
                🔑 Password
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md font-bold transition-all ${
                  loginMethod === "otp"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => {
                  setLoginMethod("otp");
                  setOtpSent(false);
                  setServerError(null);
                }}
              >
                📧 OTP
              </button>
            </div>

            {/* Password Login Form */}
            {loginMethod === "password" && (
              <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
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

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-bold">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold text-gray-700 dark:text-gray-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </form>
            )}

            {/* OTP Login Form */}
            {loginMethod === "otp" && (
              <div className="space-y-6">
                {!otpSent ? (
                  <>
                    <FormInput<LoginInput>
                      label="Email Address"
                      name="email"
                      type="email"
                      register={register}
                      error={errors.email}
                      placeholder="you@example.com"
                    />

                    {serverError && (
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                        <p className="text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                          <span>⚠️</span> {serverError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={sendOTP}
                      className="w-full !py-4 !rounded-xl shadow-lg shadow-indigo-500/25 text-lg font-black"
                    >
                      📧 Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center text-2xl font-bold tracking-widest focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        OTP sent to {otpEmail}
                      </p>
                    </div>

                    {serverError && (
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                        <p className="text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                          <span>⚠️</span> {serverError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={verifyOTP}
                      className="w-full !py-4 !rounded-xl shadow-lg shadow-indigo-500/25 text-lg font-black"
                    >
                      ✅ Verify & Login
                    </Button>

                    <button
                      type="button"
                      onClick={sendOTP}
                      className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold"
                    >
                      Resend OTP
                    </button>
                  </>
                )}
              </div>
            )}
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
