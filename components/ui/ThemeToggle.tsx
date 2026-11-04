"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { SunIcon, MoonIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showLabel?: boolean;
  variant?: "icon" | "pill";
}

export function ThemeToggle({
  showLabel = false,
  variant = "icon",
  className,
  ...props
}: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration layout shift
  const isDark = mounted ? theme === "dark" : true;

  if (variant === "pill" || showLabel) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className={cn(
          "flex items-center justify-between gap-3 w-full px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-sm font-medium select-none",
          "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800",
          "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
              isDark
                ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                : "bg-indigo-50 text-brand-600 border border-brand-200"
            )}
          >
            {isDark ? (
              <SunIcon className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <MoonIcon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
            )}
          </span>
          <span>{isDark ? "Light Theme" : "Dark Theme"}</span>
        </span>

        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full font-semibold",
            isDark
              ? "bg-zinc-800 text-zinc-300"
              : "bg-white text-slate-600 border border-slate-200"
          )}
        >
          {isDark ? "Dark" : "Light"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        "border-slate-200/90 bg-white/80 hover:bg-slate-100 text-slate-700 shadow-sm",
        "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:shadow-none",
        "active:scale-95 group",
        className
      )}
      {...props}
    >
      {/* Sun icon for switching to light theme */}
      <SunIcon
        className={cn(
          "h-[18px] w-[18px] transition-all duration-300 text-amber-400 dark:text-amber-300",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0 absolute"
        )}
      />

      {/* Moon icon for switching to dark theme */}
      <MoonIcon
        className={cn(
          "h-[18px] w-[18px] transition-all duration-300 text-brand-600 dark:text-brand-400",
          isDark
            ? "rotate-90 scale-0 opacity-0 absolute"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
    </button>
  );
}

export default ThemeToggle;
