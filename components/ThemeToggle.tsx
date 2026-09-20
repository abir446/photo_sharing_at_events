"use client";

import React from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "pill" | "row";
}

export function ThemeToggle({ className = "", variant = "icon" }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    // Render an inert skeleton button of matching geometry during SSR/hydration to avoid layout shift
    return (
      <div
        className={`h-9 w-9 rounded-xl border border-zinc-200/50 bg-white/40 dark:border-zinc-800 dark:bg-zinc-900/50 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex w-full items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
          isDark
            ? "border-zinc-800 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-850 hover:border-brand-500/40"
            : "border-indigo-100 bg-white/80 text-slate-800 hover:bg-white hover:border-brand-300 shadow-xs"
        } ${className}`}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span className="flex items-center gap-2.5 text-sm font-medium">
          {isDark ? (
            <MoonIcon className="h-4 w-4 text-brand-400" />
          ) : (
            <SunIcon className="h-4 w-4 text-amber-500" />
          )}
          <span>Appearance</span>
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
          {isDark ? "Dark" : "Light"}
        </span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`group relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer shadow-xs ${
          isDark
            ? "border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:text-white"
            : "border-indigo-100 bg-white/90 text-slate-700 hover:border-indigo-200 hover:text-slate-900 shadow-sm"
        } ${className}`}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <div className="relative h-4 w-4 overflow-hidden">
          <SunIcon
            className={`absolute inset-0 h-4 w-4 text-amber-500 transition-all duration-300 transform ${
              isDark ? "translate-y-6 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"
            }`}
          />
          <MoonIcon
            className={`absolute inset-0 h-4 w-4 text-brand-400 transition-all duration-300 transform ${
              isDark ? "translate-y-0 rotate-0 opacity-100" : "-translate-y-6 -rotate-90 opacity-0"
            }`}
          />
        </div>
        <span>{isDark ? "Dark mode" : "Light mode"}</span>
      </button>
    );
  }

  // Default: Icon toggle button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 active:scale-95 cursor-pointer ${
        isDark
          ? "border-zinc-800/80 bg-zinc-900/60 text-zinc-300 hover:border-brand-500/50 hover:bg-zinc-850 hover:text-brand-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)]"
          : "border-indigo-150/80 bg-white/90 text-slate-700 hover:border-brand-400/60 hover:bg-white hover:text-amber-500 shadow-xs hover:shadow-[0_4px_16px_rgba(129,140,248,0.2)]"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative flex items-center justify-center h-5 w-5">
        <SunIcon
          className={`absolute h-4.5 w-4.5 text-amber-500 transition-all duration-500 ease-out transform ${
            isDark
              ? "scale-0 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100 group-hover:rotate-45"
          }`}
          aria-hidden="true"
        />
        <MoonIcon
          className={`absolute h-4.5 w-4.5 text-brand-400 transition-all duration-500 ease-out transform ${
            isDark
              ? "scale-100 rotate-0 opacity-100 group-hover:-rotate-12"
              : "scale-0 -rotate-90 opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;
