"use client";

import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const delta = 2;

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) pages.push("...");

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <nav
      className={cn("flex items-center gap-1.5", className)}
      aria-label="التنقل بين الصفحات"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          "inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          currentPage <= 1
            ? "text-brand-text-muted cursor-not-allowed opacity-50"
            : "text-brand-primary hover:bg-brand-secondary cursor-pointer"
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
          <path d="m9 18 6-6-6-6" />
        </svg>
        السابق
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-2 text-brand-text-muted"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                page === currentPage
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-brand-primary hover:bg-brand-secondary"
              )}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          "inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          currentPage >= totalPages
            ? "text-brand-text-muted cursor-not-allowed opacity-50"
            : "text-brand-primary hover:bg-brand-secondary cursor-pointer"
        )}
      >
        التالي
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
}

export { Pagination };
