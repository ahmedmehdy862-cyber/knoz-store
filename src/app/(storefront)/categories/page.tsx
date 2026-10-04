import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { Reveal } from "@/components/shared/Reveal";
import { getServerCategories } from "@/services/server-categories";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";
import type { Category } from "@/types";

export const metadata: Metadata = {
  title: "التصنيفات",
  description:
    "تصفح منتجات كنوز ستور حسب التصنيف: مجات مخصصة، استيكرز، ثيمات وهدايا بطابع شخصي.",
  alternates: { canonical: absoluteUrl("/categories") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/categories"),
    title: `التصنيفات | ${SITE_NAME}`,
    description: "تصفح منتجات كنوز ستور حسب التصنيف.",
  },
};

export default async function CategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await getServerCategories();
  } catch {
    // ignore, render empty state
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: "التصنيفات" }]} />

      <Reveal className="text-center mt-6 mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary font-heading">
          تصفح التصنيفات
        </h1>
        <p className="mt-2 text-brand-text-secondary">
          اكتشف منتجاتنا حسب التصنيف
        </p>
      </Reveal>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={Math.min(i, 5) * 70}>
              <CategoryCard category={category} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-center text-brand-text-muted py-16">
          لا توجد تصنيفات حالياً
        </p>
      )}
    </div>
  );
}