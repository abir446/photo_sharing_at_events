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
          "bg-brand-500 hover:bg-brand-600 active:bg-brand-600/90 text-white disabled:bg-zinc-850 disabled:text-zinc-500 shadow-sm",
        secondary:
          "bg-brand-400/20 hover:bg-brand-400/35 active:bg-brand-400/50 text-brand-400 disabled:bg-zinc-850",
        outline:
          "border border-brand-400 bg-transparent hover:bg-brand-400/10 active:bg-brand-400/20 text-brand-400",
        ghost:
          "bg-transparent hover:bg-brand-400/10 active:bg-brand-400/20 text-zinc-400 hover:text-zinc-200",
        danger:
          "bg-rose-950/40 hover:bg-rose-900/50 active:bg-rose-900 text-rose-400 border border-rose-900/50",
        light:
          "bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-900",
        // Fallback standard shadcn variants
        default:
          "bg-brand-500 hover:bg-brand-600 text-white shadow-sm",
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
