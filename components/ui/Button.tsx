import React, { forwardRef } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Minimalist, consistent buttons with Shadcn's style
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed select-none tracking-wide focus-visible:ring-2 focus-visible:ring-brand-400 focus:outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-glow disabled:bg-white/10 disabled:text-slate-500",
        secondary:
          "bg-white/5 hover:bg-white/10 active:bg-white/15 text-white border border-white/10 disabled:bg-white/5 disabled:text-slate-500",
        outline:
          "border border-white/15 bg-white/[0.02] hover:bg-white/10 active:bg-white/15 text-slate-200 hover:text-white disabled:bg-transparent disabled:text-slate-600",
        ghost:
          "bg-transparent hover:bg-white/10 active:bg-white/15 text-slate-400 hover:text-white disabled:bg-transparent disabled:text-slate-600",
        danger:
          "bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 text-rose-300 border border-rose-500/30 disabled:bg-rose-500/5 disabled:text-rose-500/40",
        light:
          "bg-white text-ink-950 hover:bg-slate-100 active:bg-slate-200 font-semibold disabled:bg-slate-300",
        // Fallback standard shadcn variants
        default:
          "bg-brand-500 hover:bg-brand-600 text-white shadow-glow disabled:bg-white/10",
      },
      size: {
        sm: "px-3 py-1.5 text-xs gap-1.5 h-8",
        md: "px-4 py-2.5 text-sm gap-2 h-10",
        lg: "px-6 py-3.5 text-base gap-2.5 h-12",
        // Fallback shadcn sizes
        default: "px-4 py-2.5 text-sm gap-2 h-10",
        xs: "px-2.5 py-1 text-xs gap-1 h-7",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ComponentPropsWithRef<typeof ButtonPrimitive>, "size" | "style">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isBtnDisabled = disabled || isLoading;

    return (
      <ButtonPrimitive
        ref={ref}
        type={type}
        disabled={isBtnDisabled}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </ButtonPrimitive>
    );
  }
);

Button.displayName = "Button";

export default Button;
export { buttonVariants };
