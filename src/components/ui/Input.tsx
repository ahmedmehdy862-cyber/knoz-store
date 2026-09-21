"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.replace(/\s/g, "-").toLowerCase() : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brand-text mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          dir="rtl"
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border bg-white text-brand-text",
            "placeholder:text-brand-text-muted",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent",
            error
              ? "border-brand-error focus:ring-brand-error/30 focus:border-brand-error"
              : "border-brand-border hover:border-brand-primary-light",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-brand-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
