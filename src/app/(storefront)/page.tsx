import Link from "next/link";
import { Hero } from "@/components/storefront/Hero";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getServerCategories } from "@/services/server-categories";
import {
  getServerProducts,
  getServerFeaturedProducts,
} from "@/services/server-products";
import { CONTENT_DEFAULTS } from "@/lib/site-content";
import { getSiteContent } from "@/services/site-content";
import { getActivePromotions } from "@/services/promotions";
import type { Category, Product } from "@/types";

export default async function HomePage() {
  let categories: Category[] = [];
  let featuredProducts: Product[] = [];
  let latestProductsData: Product[] = [];
  let latestTotal = 0;
  let promotions: Awaited<ReturnType<typeof getActivePromotions>> = [];
  const content: Record<string, Record<string, unknown>> = {};

  try {
    [categories, featuredProducts] = await Promise.all([
      getServerCategories(),
      getServerFeaturedProducts(),
    ]);
  } catch {
    // Services may fail if Supabase is not configured
  }

  try {
    const latest = await getServerProducts({
      limit: 8,
      sort: "newest",
    });
    latestProductsData = latest.data;
    latestTotal = latest.total;
  } catch {
    // ignore
  }

  try {
    Object.assign(content, await getSiteContent());
  } catch {
    // fallback to defaults
  }

  try {
    promotions = await getActivePromotions();
  } catch {
    // no promotions
  }

  const section = (key: string): Record<string, string> =>
    ({ ...CONTENT_DEFAULTS[key], ...(content[key] || {}) }) as Record<
      string,
      string
    >;

  const categoriesHome = section("categories_home");
  const featured = section("featured_products");
  const promo = section("promo_section");
  const latest = section("latest_products");
  const why = section("why_us");

  return (
    <div>
      {/* Hero */}
      <Hero />

      {/* Offers */}
      {promotions.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-primary font-heading">
              عروضنا
            </h2>
            <p className="mt-2 text-brand-text-secondary">
              أقوى الخصومات والعروض لفترة محدودة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary via-brand-primary-light to-brand-accent text-white shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-stretch">
                  <div className="flex-1 p-6 sm:p-8">
                    {promo.badge && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-3">
                        {promo.badge}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold font-heading leading-snug">
                      {promo.title}
                    </h3>
                    {promo.subtitle && (
                      <p className="mt-1 text-white/80">{promo.subtitle}</p>
                    )}
                    {promo.description && (
                      <p className="mt-2 text-sm text-white/70 leading-relaxed">
                        {promo.description}
                      </p>
                    )}
                    {promo.linkUrl && (
                      <Link
                        href={promo.linkUrl}
                        className="mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-white text-brand-primary text-sm font-medium hover:bg-brand-secondary-light transition-colors"
                      >
                        {promo.linkText || "تسوق الآن"}
                      </Link>
                    )}
                  </div>
                  {promo.imageUrl && (
                    <div className="relative sm:w-48 shrink-0 min-h-40">
                      <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brand-primary font-heading">
              {categoriesHome.section_title}
            </h2>
            <p className="mt-2 text-brand-text-secondary">
              {categoriesHome.section_subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-brand-secondary/20 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-brand-primary font-heading">
                {featured.section_title}
              </h2>
              <p className="mt-2 text-brand-text-secondary">
                {featured.section_subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customization Promo */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary via-brand-primary-light to-brand-accent p-8 sm:p-12 text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-brand-accent/20 blur-3xl" />
          </div>
          <div className="relative flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-right">
              <h2 className="text-3xl sm:text-4xl font-bold font-heading leading-tight">
                {promo.title}
              </h2>
              <p className="mt-4 text-white/80 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                {promo.description}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Link
                  href={promo.cta_link}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-brand-primary font-medium hover:bg-brand-secondary-light transition-colors"
                >
                  {promo.cta_text}
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                <div className="absolute inset-0 rounded-2xl bg-white/10 rotate-6 blur-sm" />
                <div className="relative flex items-center justify-center w-full h-full rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/90"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      {latestProductsData.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-brand-primary font-heading">
                {latest.section_title}
              </h2>
              <p className="mt-2 text-brand-text-secondary">
                {latest.section_subtitle}
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium text-brand-accent hover:text-brand-accent-dark transition-colors"
            >
              {latest.view_all_text}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProductsData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Why Knoz Store */}
      <section className="bg-brand-primary text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading">
              {why.section_title}
            </h2>
            <p className="mt-2 text-white/70">
              {why.section_subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              }
              title={why.benefit_1_title}
              description={why.benefit_1_desc}
            />
            <BenefitCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              }
              title={why.benefit_2_title}
              description={why.benefit_2_desc}
            />
            <BenefitCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              }
              title={why.benefit_3_title}
              description={why.benefit_3_desc}
            />
            <BenefitCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              }
              title={why.benefit_4_title}
              description={why.benefit_4_desc}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold font-heading mb-2">{title}</h3>
      <p className="text-sm text-white/70 leading-relaxed">{description}</p>
    </div>
  );
}
