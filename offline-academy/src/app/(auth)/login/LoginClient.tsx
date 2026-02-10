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

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const error = searchParams?.get("error");
    if (error) {
      if (error === "OAuthAccountNotLinked") {
        setServerError("This email is already registered with a password.");
        toast.error("Account already exists with password login");
      } else {
        setServerError("Authentication error. Please try again.");
        toast.error("Sign in failed");
      }
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

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
      if (!response.ok || !result.success) throw new Error(result.message);
      toast.dismiss();
      login(result.user);
      toast.success("Login successful");
      router.push(result.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err: any) {
      toast.dismiss();
      setServerError(err.message);
      toast.error(err.message);
    }
  };

  const sendOTP = async () => {
    const email = getValues("email");
    if (!email) return toast.error("Enter email first");

    toast.loading("Sending OTP...");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          email: result.email,
          otp: result.otp,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      toast.dismiss();
      toast.success("OTP sent");
      setOtpSent(true);
      setOtpEmail(email);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) return toast.error("Enter valid OTP");
    toast.loading("Verifying OTP...");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);
      toast.dismiss();
      login(result.user);
      toast.success("Login successful");
      router.push(result.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    toast.loading("Redirecting...");
    await signIn("google", { callbackUrl: "/auth/callback" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <button onClick={() => setLoginMethod("password")} className="flex-1">Password</button>
            <button onClick={() => setLoginMethod("otp")} className="flex-1">OTP</button>
          </div>

          {loginMethod === "password" && (
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormInput label="Email" name="email" register={register} error={errors.email} />
              <FormInput label="Password" name="password" type="password" register={register} error={errors.password} />
              <Button type="submit" isLoading={isSubmitting} className="w-full">Sign In</Button>
            </form>
          )}

          {loginMethod === "otp" && (
            <>
              {!otpSent ? (
                <>
                  <FormInput label="Email" name="email" register={register} error={errors.email} />
                  <Button onClick={sendOTP} className="w-full">Send OTP</Button>
                </>
              ) : (
                <>
                  <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="w-full border p-2 text-center" />
                  <Button onClick={verifyOTP} className="w-full">Verify OTP</Button>
                </>
              )}
            </>
          )}

          <button onClick={handleGoogleSignIn} className="w-full border p-2">Sign in with Google</button>

          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          <p className="text-center text-sm">
            Don’t have an account? <Link href="/signup">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
