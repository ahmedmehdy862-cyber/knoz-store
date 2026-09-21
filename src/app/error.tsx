"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-background)] px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl" role="img" aria-label="error">
            ⚠️
          </span>
        </div>

        <h1 className="text-4xl font-bold text-[var(--brand-primary)] mb-4 font-[family-name:var(--font-heading)]">
          حصل مشكلة
        </h1>

        <p className="text-lg text-[var(--brand-text-secondary)] mb-8 leading-relaxed">
          في حاجة غلط حصلت.
          <br />
          ممكن تجرب تاني أو ترجع الصفحة الرئيسية.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[var(--brand-primary)] text-white font-semibold text-lg hover:bg-[var(--brand-primary-dark)] transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            تاني تاني
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold text-lg hover:bg-[var(--brand-primary)] hover:text-white transition-colors duration-200"
          >
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
