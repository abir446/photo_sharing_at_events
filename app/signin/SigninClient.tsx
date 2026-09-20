"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import { SparklesIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SigninClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast.success("Welcome back!", {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
        });
        router.push("/dashboard");
        router.refresh();
      } else {
        throw new Error(data.error || "Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to sign in. Please verify your credentials.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-transparent text-slate-800 dark:text-slate-200 px-4 py-12 sm:px-6 relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-brand-500/10 text-indigo-950 dark:text-brand-400 border border-indigo-200 dark:border-brand-500/20 mb-2 shadow-xs font-bold">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Welcome back
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Sign in to manage events or listings.
          </p>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-white/[0.02] border border-indigo-150/80 dark:border-white/5 rounded-3xl p-6 shadow-sm dark:shadow-none backdrop-blur-xl">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full mt-2 !text-white text-white font-bold"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-slate-600 dark:text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-indigo-950 dark:text-brand-400 font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
