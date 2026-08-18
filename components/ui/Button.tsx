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
          "bg-[#CF6DFC] hover:bg-[#B250DF] active:bg-[#9732C5] text-white disabled:bg-zinc-100 disabled:text-zinc-400 shadow-sm",
        secondary:
          "bg-[#C1BFFF]/20 hover:bg-[#C1BFFF]/35 active:bg-[#C1BFFF]/50 text-[#B250DF] disabled:bg-zinc-50",
        outline:
          "border border-[#C1BFFF] bg-white hover:bg-[#C1BFFF]/10 active:bg-[#C1BFFF]/20 text-[#B250DF]",
        ghost:
          "bg-transparent hover:bg-[#C1BFFF]/10 active:bg-[#C1BFFF]/20 text-zinc-600 hover:text-zinc-900",
        danger:
          "bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 border border-rose-200",
        light:
          "bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-900",
        // Fallback standard shadcn variants
        default:
          "bg-[#CF6DFC] hover:bg-[#B250DF] text-white shadow-sm",
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
