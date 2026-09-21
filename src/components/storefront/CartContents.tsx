"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { CartItem } from "@/types";

export function CartContents() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const router = useRouter();
  const [clearing, setClearing] = useState(false);

  const total = getCartTotal();
  const deliveryFee = total > 0 ? 50 : 0;
  const grandTotal = total + deliveryFee;

  const handleClear = useCallback(() => {
    setClearing(true);
    clearCart();
  }, [clearCart]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-text-muted/30 mb-6"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        <h2 className="text-2xl font-bold text-brand-primary font-heading mb-2">
          السلة له فاضية
        </h2>
        <p className="text-brand-text-muted mb-6">
          مفيش منتجات في السلة حالياً
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-primary-light shadow-sm hover:shadow-md transition-all"
        >
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-brand-primary font-heading">
            سلة التسوق ({items.length} منتج)
          </h2>
          <button
            onClick={handleClear}
            className="text-sm text-brand-error hover:underline cursor-pointer"
          >
            تفريغ السلة
          </button>
        </div>

        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-xl border border-brand-border-light bg-brand-surface p-6 shadow-sm">
          <h3 className="text-lg font-bold text-brand-primary font-heading mb-5">
            ملخص الطلب
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">المجموع الفرعي</span>
              <span className="font-medium text-brand-text">
                {formatPrice(total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">رسوم التوصيل</span>
              <span className="font-medium text-brand-text">
                {formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="border-t border-brand-border-light pt-3 flex justify-between">
              <span className="font-bold text-brand-primary">الإجمالي</span>
              <span className="font-bold text-brand-primary text-lg">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => router.push("/checkout")}
              className="w-full"
              size="lg"
            >
              إتمام الشراء
            </Button>
            <Link
              href="/shop"
              className="block w-full text-center px-6 py-3 rounded-xl border-2 border-brand-primary text-brand-primary font-medium hover:bg-brand-primary hover:text-white transition-all"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const img =
    item.product.images?.find((i: any) => i.isPrimary) ||
    item.product.images?.[0];

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-brand-border-light bg-brand-surface">
      {/* Image */}
      <Link
        href={`/shop/${item.product.slug}`}
        className="relative w-24 h-24 rounded-lg overflow-hidden bg-brand-secondary-light shrink-0"
      >
        {img ? (
          <Image
            src={img.url}
            alt={item.product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-brand-text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="9" cy="9" r="2" />
            </svg>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/shop/${item.product.slug}`}
          className="text-sm font-semibold text-brand-text hover:text-brand-accent transition-colors line-clamp-1"
        >
          {item.product.name}
        </Link>

        {item.customization.name && (
          <p className="text-xs text-brand-accent mt-0.5">
            الاسم: {item.customization.name}
          </p>
        )}
        {item.customization.theme && (
          <p className="text-xs text-brand-text-muted mt-0.5">
            الثيم: {item.customization.theme.name}
          </p>
        )}
        {item.customization.sticker && (
          <p className="text-xs text-brand-text-muted mt-0.5">
            الاستيكر: {item.customization.sticker.name}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-brand-border-light bg-white text-brand-text-secondary hover:bg-brand-secondary/50 transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-medium text-brand-text">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-brand-border-light bg-white text-brand-text-secondary hover:bg-brand-secondary/50 transition-colors cursor-pointer"
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
        onClick={() => onRemove(item.id)}
        className="self-start p-1.5 rounded-lg text-brand-text-muted hover:text-brand-error hover:bg-brand-error/10 transition-colors cursor-pointer"
        aria-label="حذف المنتج"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
