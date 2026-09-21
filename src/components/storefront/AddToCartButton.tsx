"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product, ProductCustomization } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({
  product,
  className,
}: AddToCartButtonProps) {
  const { addToCart, getCartCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [customization, setCustomization] = useState<ProductCustomization>({});

  const handleAdd = useCallback(() => {
    addToCart(product, quantity, customization);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [addToCart, product, quantity, customization]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-brand-text">الكمية:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-brand-border-light bg-white text-brand-text-secondary hover:bg-brand-secondary/50 transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="w-12 text-center text-base font-bold text-brand-text">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-brand-border-light bg-white text-brand-text-secondary hover:bg-brand-secondary/50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-base transition-all shadow-sm hover:shadow-md cursor-pointer",
          added
            ? "bg-brand-success text-white"
            : "bg-brand-primary text-white hover:bg-brand-primary-light active:bg-brand-primary-dark",
          product.stock === 0 && "opacity-50 cursor-not-allowed"
        )}
      >
        {added ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            تمت الإضافة للسلة
          </>
        ) : product.stock === 0 ? (
          "نفدت الكمية"
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            أضف للسلة
          </>
        )}
      </button>

      {/* Stock info */}
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-xs text-brand-warning text-center">
          متبقي {product.stock} قطع فقط
        </p>
      )}
    </div>
  );
}
