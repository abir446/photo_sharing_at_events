"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import {
  SparklesIcon,
  CameraIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Loader2Icon,
  ArrowRightIcon
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignupClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"creator" | "user" | null>(null);
  const [adminSecretKey, setAdminSecretKey] = useState("");
  const [showAdminField, setShowAdminField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all standard fields.");
      return;
    }

    if (!role && !adminSecretKey.trim()) {
      setError("Please choose whether you want to sign up as a Creator or Event Host.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: role || "user",
          adminSecretKey: adminSecretKey.trim() || undefined
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast.success("Account created successfully!", {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
        });
        if (adminSecretKey.trim()) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        throw new Error(data.error || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to sign up. Please check your credentials.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-ink-900 text-slate-200 px-4 py-12 sm:px-6 relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-2">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
            Create your account
          </h1>
          <p className="text-xs text-slate-400">
            Sign up below to access DropCast platforms.
          </p>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
          <Input
            label="Full Name"
            id="name"
            type="text"
            required
            placeholder="e.g. Abir Chowdhury"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email Address"
            id="email"
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            id="password"
            type="password"
            required
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="space-y-2.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              I want to sign up as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Creator Card */}
              <div
                onClick={() => setRole("creator")}
                className={`relative rounded-xl border p-4 cursor-pointer flex flex-col justify-between transition-all duration-300 bg-white/[0.01] min-h-[110px] ${
                  role === "creator"
                    ? "border-brand-500 bg-brand-500/5 shadow-glow"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {role === "creator" && (
                  <span className="absolute top-2.5 right-2.5 text-brand-400">
                    <CheckCircle2Icon className="h-4 w-4 fill-brand-500/10" />
                  </span>
                )}
                <CameraIcon className="h-5 w-5 text-indigo-400 mb-2" />
                <div className="text-left">
                  <h3 className="text-xs font-bold text-white">Creator</h3>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Photo/Videographer</p>
                </div>
              </div>

              {/* User Card */}
              <div
                onClick={() => setRole("user")}
                className={`relative rounded-xl border p-4 cursor-pointer flex flex-col justify-between transition-all duration-300 bg-white/[0.01] min-h-[110px] ${
                  role === "user"
                    ? "border-brand-500 bg-brand-500/5 shadow-glow"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {role === "user" && (
                  <span className="absolute top-2.5 right-2.5 text-brand-400">
                    <CheckCircle2Icon className="h-4 w-4 fill-brand-500/10" />
                  </span>
                )}
                <CalendarDaysIcon className="h-5 w-5 text-brand-400 mb-2" />
                <div className="text-left">
                  <h3 className="text-xs font-bold text-white">Event Host</h3>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Host event spaces</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdminField(!showAdminField)}
              className="text-[11px] text-slate-400 hover:text-slate-300 font-medium transition-colors cursor-pointer"
            >
              {showAdminField ? "- Hide operator passkey" : "+ Have an admin passkey?"}
            </button>

            {showAdminField && (
              <div className="mt-2 animate-in fade-in duration-200">
                <Input
                  label="Admin Secret Passkey"
                  id="adminSecretKey"
                  type="password"
                  placeholder="Enter operator key"
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Grants platform administrator credentials if verified.
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full flex items-center justify-center gap-2 mt-2"
          >
            Create Account
            <ArrowRightIcon className="h-4 w-4" />
          </Button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{" "}
            <Link href="/signin" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
