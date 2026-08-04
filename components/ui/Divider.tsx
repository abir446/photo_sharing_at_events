import React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function Divider({ children, className = "", ...props }: DividerProps) {
  if (!children) {
    return <hr className={`border-t border-slate-100 my-4 ${className}`} {...props} />;
  }

  return (
    <div className={`relative flex py-3 items-center ${className}`} {...props}>
      <div className="flex-grow border-t border-slate-100"></div>
      <span className="flex-shrink mx-3 text-slate-400 text-xs">{children}</span>
      <div className="flex-grow border-t border-slate-100"></div>
    </div>
  );
}
