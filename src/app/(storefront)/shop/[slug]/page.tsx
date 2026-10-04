import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { AddToCartButton } from "@/components/storefront/AddToCartButton";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { ProductInfoSection } from "@/components/storefront/ProductInfoSection";
import {
  getServerProductBySlug,
  getServerRelatedProducts,
} from "@/services/server-products";
import { formatPrice } from "@/lib/utils";
import { getDiscountPercent } from "@/lib/discount";
import { ProductBadge } from "@/components/ui/Badge";
import {
  SITE_NAME,
  CURRENCY,
  OG_IMAGE,
  absoluteUrl,
  truncate,
} from "@/lib/seo";
import type { Product } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let product: Product | null = null;
  try {
    product = await getServerProductBySlug(slug);
  } catch {
    // fall through to default
  }
  if (!product) {
    return { title: "منتج" };
  }

  const title = product.name;
  const fullTitle = `${product.name} | ${SITE_NAME}`;
  const description = truncate(
    product.description || `${product.name} من ${SITE_NAME} - منتجات مخصصة بطابع شخصي.`
  );
  const httpImage = product.images?.find(
    (img: any) => typeof img.url === "string" && img.url.startsWith("http")
  )?.url;
  const canonical = absoluteUrl(`/shop/${product.slug}`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: fullTitle,
      description,
      images: httpImage ? [{ url: httpImage, alt: product.name }] : [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: httpImage ? [httpImage] : [OG_IMAGE],
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product | null = null;
  try {
    product = await getServerProductBySlug(slug);
  } catch {
    notFound();
  }

  if (!product) notFound();

  const productUrl = absoluteUrl(`/shop/${product.slug}`);
  const httpImages = (product.images || [])
    .map((img: any) => img.url)
    .filter(
      (url: unknown) => typeof url === "string" && (url as string).startsWith("http")
    );
  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: product.description || product.name,
        url: productUrl,
        image: httpImages.length > 0 ? httpImages : undefined,
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: CURRENCY,
          price: product.price,
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "الرئيسية",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "المتجر",
            item: absoluteUrl("/shop"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: productUrl,
          },
        ],
      },
    ],
  };

  let relatedProducts: Product[] = [];
  try {
    if (product.categoryId) {
      relatedProducts = await getServerRelatedProducts(
        product.id,
        product.categoryId
      );
    }
  } catch {
    // ignore
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "المتجر", href: "/shop" },
          ...(product.category
            ? [
                {
                  label: product.category.name,
                  href: `/shop?category=${product.category.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images || []} />

        <div className="flex flex-col">
          {product.badge && (
            <div className="mb-3">
              <ProductBadge badge={product.badge} />
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary font-heading">
            {product.name}
          </h1>

          {product.category && (
            <p className="mt-2 text-sm text-brand-text-muted">
              {product.category.name}
            </p>
          )}

          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold text-brand-primary">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-lg text-brand-text-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-sm font-bold bg-brand-error text-white">
                  خصم {getDiscountPercent(product.price, product.oldPrice)}%
                </span>
              </>
            )}
          </div>
          {product.oldPrice && product.oldPrice > product.price && (
            <p className="mt-1.5 text-sm font-medium text-brand-success">
              وفّر {formatPrice(product.oldPrice - product.price)}
            </p>
          )}

          <div className="mt-4">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-brand-success">
                <span className="w-2 h-2 rounded-full bg-brand-success" />
                متوفر ({product.stock} قطعة)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-brand-error">
                <span className="w-2 h-2 rounded-full bg-brand-error" />
                نفدت الكمية
              </span>
            )}
          </div>

          {product.description && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-brand-primary mb-2 font-heading">
                وصف المنتج
              </h3>
              <p className="text-sm text-brand-text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <ProductInfoSection product={product} />

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-brand-primary font-heading mb-6">
            منتجات ذات صلة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
