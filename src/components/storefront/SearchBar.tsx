"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearch } from "@/hooks/useSearch";

interface SearchBarProps {
  className?: string;
  onResultClick?: () => void;
}

export function SearchBar({ className, onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { results, loading, search, reset } = useSearch({ limit: 6 });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      search(debouncedQuery);
    } else {
      reset();
    }
  }, [debouncedQuery, search, reset]);

  const showDropdown = isOpen && debouncedQuery.trim().length > 0;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    reset();
    onResultClick?.();
  }, [reset, onResultClick]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          dir="rtl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (debouncedQuery.trim()) setIsOpen(true);
          }}
          placeholder="ابحث عن منتج..."
          className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-text text-sm placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all"
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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-brand-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-brand-surface rounded-xl border border-brand-border-light shadow-lg overflow-hidden z-50 animate-fade-in">
          {results.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto">
                {results.map((product) => {
                  const img = product.images?.find((i: any) => i.isPrimary) || product.images?.[0];
                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-brand-secondary/30 transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-secondary-light shrink-0">
                        {img ? (
                          <Image
                            src={img.url}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-brand-text-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <circle cx="9" cy="9" r="2" />
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-text truncate">
                          {product.name}
                        </p>
                        <p className="text-sm font-bold text-brand-primary">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link
                href={`/shop?search=${encodeURIComponent(debouncedQuery)}`}
                onClick={handleResultClick}
                className="block text-center px-4 py-3 text-sm font-medium text-brand-accent hover:bg-brand-accent/5 border-t border-brand-border-light transition-colors"
              >
                عرض كل النتائج
              </Link>
            </>
          ) : (
            !loading && (
              <div className="px-4 py-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-brand-text-muted mb-2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                  <path d="m8 11 6 0" />
                </svg>
                <p className="text-sm text-brand-text-secondary">
                  ملقيناش اللي بتدور عليه؟
                </p>
                <p className="text-xs text-brand-text-muted mt-1">
                  جرّب كلمة تانية.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
