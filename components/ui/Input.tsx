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
            "relative flex items-center bg-white border rounded-xl focus-within:border-[#CF6DFC] focus-within:ring-1 focus-within:ring-[#CF6DFC] transition-all duration-200",
            error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : "border-[#E5E2C4]"
          )}
        >
          {icon && <div className="pl-3.5 pr-2.5 text-zinc-400 flex items-center">{icon}</div>}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full bg-transparent py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none text-sm",
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
