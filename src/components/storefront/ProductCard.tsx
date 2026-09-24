"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { getDiscountPercent } from "@/lib/discount";
import { ProductBadge } from "@/components/ui/Badge";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const primaryImage = product.images?.find((img: any) => img.isPrimary);
  const imageUrl = primaryImage?.url || product.images?.[0]?.url;

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-brand-surface rounded-xl border border-brand-border-light overflow-hidden",
        "shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-brand-secondary-light">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-brand-text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3">
            <ProductBadge badge={product.badge} />
          </div>
        )}

        {/* Discount */}
        {getDiscountPercent(product.price, product.oldPrice) > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-error text-white shadow-sm">
            خصم {getDiscountPercent(product.price, product.oldPrice)}%
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-brand-text line-clamp-2 hover:text-brand-accent transition-colors leading-relaxed">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        {product.category && (
          <p className="mt-1 text-xs text-brand-text-muted">
            {product.category.name}
          </p>
        )}

        {/* Customizable indicator */}
        {product.customizationEnabled && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-brand-accent font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
              قابل للتخصيص
            </span>
          </div>
        )}

        {/* Price + Add to cart */}
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="block text-xs text-brand-text-muted line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-brand-primary">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-brand-accent text-white hover:bg-brand-accent-light active:bg-brand-accent-dark transition-colors shadow-sm cursor-pointer"
            aria-label="أضف للسلة"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
