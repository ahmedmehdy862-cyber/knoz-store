"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/categories", label: "التصنيفات" },
] as const;

const ACCOUNT_LINKS = [
  { href: "/account", label: "حسابي" },
  { href: "/account/orders", label: "طلباتي" },
  { href: "/login", label: "تسجيل الدخول" },
  { href: "/register", label: "إنشاء حساب" },
] as const;

export function MobileNav({ open, onClose }: MobileNavProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-primary-dark/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer from right (RTL) */}
      <div
        dir="rtl"
        className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-brand-surface shadow-xl animate-slide-in flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border-light">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo/knoz-logo.jpeg"
              alt="Knoz Store - كنوز ستور"
              className="h-8 w-auto object-contain shrink-0"
            />
            <span className="text-lg font-bold text-brand-primary font-heading">
              Knoz Store
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-brand-text-muted hover:text-brand-primary hover:bg-brand-secondary/50 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-4 border-b border-brand-border-light">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              dir="rtl"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-text text-sm placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-3">
            <p className="px-3 py-2 text-xs font-semibold text-brand-text-muted uppercase tracking-wider">
              القائمة
            </p>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-brand-text hover:bg-brand-secondary/50 hover:text-brand-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mx-5 my-3 border-t border-brand-border-light" />

          <div className="px-3">
            <p className="px-3 py-2 text-xs font-semibold text-brand-text-muted uppercase tracking-wider">
              الحساب
            </p>
            {ACCOUNT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-brand-text hover:bg-brand-secondary/50 hover:text-brand-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
