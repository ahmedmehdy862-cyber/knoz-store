"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-brand-primary text-white hover:bg-brand-primary-light active:bg-brand-primary-dark shadow-sm hover:shadow-md",
  secondary:
    "bg-brand-secondary text-brand-primary hover:bg-brand-secondary-dark active:bg-brand-secondary-dark shadow-sm",
  accent:
    "bg-brand-accent text-white hover:bg-brand-accent-light active:bg-brand-accent-dark shadow-sm hover:shadow-md",
  outline:
    "border-2 border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary hover:text-white active:bg-brand-primary-dark",
  ghost:
    "text-brand-primary bg-transparent hover:bg-brand-secondary active:bg-brand-secondary-dark",
  danger:
    "bg-brand-error text-white hover:opacity-90 active:opacity-80 shadow-sm",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-lg",
  md: "px-5 py-2.5 text-base gap-2 rounded-lg",
  lg: "px-7 py-3.5 text-lg gap-2.5 rounded-xl",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  loading?: boolean;
  asChild?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
