import React, { forwardRef } from "react";

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
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            {label}
          </label>
        )}
        <div
          className={`relative flex items-center bg-indigo-50/20 border rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200 ${
            error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : "border-slate-200"
          }`}
        >
          {icon && <div className="pl-3.5 pr-2.5 text-slate-400 flex items-center">{icon}</div>}
          <input
            ref={ref}
            id={id}
            className={`w-full bg-transparent py-3 text-slate-800 placeholder-slate-400 focus:outline-none text-sm ${
              icon ? "pr-4" : "px-4"
            } ${className}`}
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
