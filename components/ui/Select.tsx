import React, { forwardRef } from "react";

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
          <select
            ref={ref}
            id={id}
            className={`w-full bg-transparent py-3 text-slate-700 focus:outline-none text-sm appearance-none cursor-pointer ${
              icon ? "pr-10" : "pl-4 pr-10"
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-slate-400 flex items-center">
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
