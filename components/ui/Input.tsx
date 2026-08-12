import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", id, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center bg-ink-950/60 border rounded-xl focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all duration-200",
            error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : "border-white/10"
          )}
        >
          {icon && <div className="pl-3.5 pr-2.5 text-slate-400 flex items-center">{icon}</div>}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full bg-transparent py-3 text-white placeholder-slate-500 focus:outline-none text-sm",
              icon ? "pr-4" : "px-4",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
