"use client";

import Link from "next/link";
import { formatPrice, formatDate, getOrderStatusInfo } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrderHistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-primary font-heading">
          طلباتي
        </h1>
        <Link
          href="/account"
          className="text-sm text-brand-accent hover:text-brand-accent-dark transition-colors"
        >
          العودة للحساب
        </Link>
      </div>

      {/* Empty state - will be populated when auth is implemented */}
      <div className="text-center py-16 rounded-xl border border-brand-border-light bg-brand-surface">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto text-brand-text-muted/30 mb-4"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
        <p className="text-lg font-bold text-brand-text font-heading mb-2">
          مفيش طلبات حالياً
        </p>
        <p className="text-sm text-brand-text-muted mb-6">
          سجل دخولك عشان تشوف طلباتك
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-primary-light transition-colors"
        >
          ابدأ التسوق
        </Link>
      </div>
    </div>
  );
}
