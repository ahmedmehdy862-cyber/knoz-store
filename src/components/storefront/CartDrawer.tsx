"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const total = getCartTotal();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-primary-dark/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer from left (RTL = right visually, left in code because RTL flips it) */}
      <div
        dir="rtl"
        className="absolute top-0 left-0 h-full w-96 max-w-[90vw] bg-brand-surface shadow-xl animate-slide-in flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border-light">
          <h2 className="text-lg font-bold text-brand-primary font-heading flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            سلة التسوق
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-brand-text-muted hover:text-brand-primary hover:bg-brand-secondary/50 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-brand-text-muted/40 mb-4">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <p className="text-lg font-bold text-brand-text font-heading">
              السلة لسه فاضية
            </p>
            <p className="text-sm text-brand-text-muted mt-1">
             加点 منتجات حلوة وتعالى!
            </p>
            <Link
              href="/shop"
              onClick={onClose}
              className="mt-5 inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-primary-light transition-colors"
            >
              تسوق الآن
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => {
                const img =
                  item.product.images?.find((i: any) => i.isPrimary) ||
                  item.product.images?.[0];

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-lg bg-brand-surface border border-brand-border-light"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={onClose}
                      className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-secondary-light shrink-0"
                    >
                      {img ? (
                        <Image
                          src={img.url}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-brand-text-muted">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <circle cx="9" cy="9" r="2" />
                          </svg>
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={onClose}
                        className="text-sm font-medium text-brand-text hover:text-brand-accent transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>

                      {/* Customization info */}
                      {item.customization.name && (
                        <p className="text-xs text-brand-text-muted mt-0.5">
                          الاسم: {item.customization.name}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex items-center justify-center w-7 h-7 rounded-md border border-brand-border-light bg-white text-brand-text-secondary hover:bg-brand-secondary/50 transition-colors cursor-pointer text-sm"
                            aria-label="تناقص"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-brand-text">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex items-center justify-center w-7 h-7 rounded-md border border-brand-border-light bg-white text-brand-text-secondary hover:bg-brand-secondary/50 transition-colors cursor-pointer text-sm"
                            aria-label="زود"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-bold text-brand-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="self-start p-1 rounded text-brand-text-muted hover:text-brand-error transition-colors cursor-pointer"
                      aria-label="حذف"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-brand-border-light px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-text-secondary">المجموع</span>
                <span className="text-lg font-bold text-brand-primary">
                  {formatPrice(total)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full text-center px-6 py-3 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-primary-light shadow-sm hover:shadow-md transition-all"
              >
                إتمام الشراء
              </Link>
              <button
                onClick={onClose}
                className="block w-full text-center px-6 py-2.5 rounded-xl border-2 border-brand-primary text-brand-primary font-medium hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
              >
                متابعة التسوق
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
