import { Suspense } from "react";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ShopFilters } from "@/components/storefront/ShopFilters";
import { ShopPagination } from "@/components/storefront/ShopPagination";
import { getServerCategories } from "@/services/server-categories";
import { getServerProducts } from "@/services/server-products";
import type { Category, Product } from "@/types";

async function ShopContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = typeof params.search === "string" ? params.search : "";
  const categorySlug = typeof params.category === "string" ? params.category : "";
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const priceRange = typeof params.price === "string" ? params.price : "";
  const customizable = params.customizable === "true";

  let categories: any[] = [];
  let result = {
    data: [] as any[],
    total: 0,
    page: 1,
    totalPages: 0,
  };

  try {
    categories = await getServerCategories();
  } catch {
    // ignore
  }

  try {
    result = await getServerProducts({
      page,
      limit: 12,
      search: search || undefined,
      categorySlug: categorySlug || undefined,
      sort,
    });
  } catch {
    // ignore
  }

  let filteredProducts = result.data;
  if (priceRange) {
    const [min, max] = priceRange.split("-").map(Number);
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= min && p.price <= max
    );
  }
  if (customizable) {
    filteredProducts = filteredProducts.filter((p) => p.customizationEnabled);
  }

  const categoryName = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.name || "المنتجات"
    : "كل المنتجات";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "المتجر" },
          ...(categorySlug
            ? [{ label: categoryName }]
            : []),
        ]}
      />

      <div className="mt-6 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 rounded-xl border border-brand-border-light bg-brand-surface p-5 shadow-sm">
            <ShopFilters categories={categories} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-brand-primary font-heading">
              {categoryName}
            </h1>
            <span className="text-sm text-brand-text-muted">
              {result.total} منتج
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <p className="text-lg font-bold text-brand-text font-heading">
                مفيش منتجات حالياً
              </p>
              <p className="text-sm text-brand-text-muted mt-1">
                جرّب فلاتر تانية أو ابحث بكلمة مختلفة
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {result.totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <Suspense>
                    <ShopPagination totalPages={result.totalPages} />
                  </Suspense>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-48 bg-brand-secondary-light rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-brand-border-light bg-brand-surface overflow-hidden"
                >
                  <div className="aspect-square bg-brand-secondary-light" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-brand-secondary-light rounded w-3/4" />
                    <div className="h-3 bg-brand-secondary-light rounded w-1/2" />
                    <div className="h-5 bg-brand-secondary-light rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ShopContent searchParams={searchParams} />
    </Suspense>
  );
}
