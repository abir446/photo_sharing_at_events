import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, icon, children, className = "", id, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center bg-white dark:bg-ink-950/60 border rounded-xl focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all duration-200 shadow-xs dark:shadow-none",
            error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : "border-indigo-150/80 dark:border-white/10"
          )}
        >
          {icon && <div className="pl-3.5 pr-2.5 text-slate-500 dark:text-slate-400 flex items-center">{icon}</div>}
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full bg-transparent py-3 text-slate-900 dark:text-slate-200 focus:outline-none text-sm appearance-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-ink-900 dark:[&>option]:text-white",
              icon ? "pr-10" : "pl-4 pr-10",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-slate-500 dark:text-slate-400 flex items-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
