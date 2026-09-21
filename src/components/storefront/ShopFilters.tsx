"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import type { Category } from "@/types";

interface ShopFiltersProps {
  categories: Category[];
}

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل للأعلى" },
  { value: "price_desc", label: "السعر: من الأعلى للأقل" },
  { value: "popular", label: "الأكثر مبيعًا" },
] as const;

const PRICE_RANGES = [
  { value: "", label: "الكل" },
  { value: "0-100", label: "أقل من 100 جنيه" },
  { value: "100-300", label: "100 - 300 جنيه" },
  { value: "300-500", label: "300 - 500 جنيه" },
  { value: "500-999999", label: "أكثر من 500 جنيه" },
] as const;

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPriceRange = searchParams.get("price") || "";
  const currentCustomizable = searchParams.get("customizable") || "";
  const currentSearch = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateParams("search", searchInput.trim());
    },
    [searchInput, updateParams]
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <Input
          placeholder="ابحث عن منتج..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-brand-primary mb-3 font-heading">
          التصنيفات
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateParams("category", "")}
            className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
              !currentCategory
                ? "bg-brand-primary text-white font-medium"
                : "text-brand-text-secondary hover:bg-brand-secondary/50"
            }`}
          >
            كل المنتجات
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParams("category", cat.slug)}
              className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                currentCategory === cat.slug
                  ? "bg-brand-primary text-white font-medium"
                  : "text-brand-text-secondary hover:bg-brand-secondary/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-brand-primary mb-3 font-heading">
          نطاق السعر
        </h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => updateParams("price", range.value)}
              className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                currentPriceRange === range.value
                  ? "bg-brand-primary text-white font-medium"
                  : "text-brand-text-secondary hover:bg-brand-secondary/50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-bold text-brand-primary mb-3 font-heading">
          ترتيب حسب
        </h3>
        <select
          dir="rtl"
          value={currentSort}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Customizable filter */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentCustomizable === "true"}
            onChange={(e) =>
              updateParams("customizable", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30"
          />
          <span className="text-sm text-brand-text-secondary">
            قابل للتخصيص فقط
          </span>
        </label>
      </div>
    </div>
  );
}
