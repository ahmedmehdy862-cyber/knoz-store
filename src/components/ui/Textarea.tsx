"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || (label ? label.replace(/\s/g, "-").toLowerCase() : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-brand-text mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          dir="rtl"
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border bg-white text-brand-text",
            "placeholder:text-brand-text-muted resize-y min-h-[100px]",
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

Textarea.displayName = "Textarea";

export { Textarea };
