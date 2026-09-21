"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";

export default function CheckoutPage() {
  const { items, getCartTotal } = useCart();
  const total = getCartTotal();
  const deliveryFee = total > 0 ? 50 : 0;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
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
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <p className="text-lg font-bold text-brand-text font-heading mb-2">
            السلة فاضية
          </p>
          <p className="text-sm text-brand-text-muted mb-6">
            لازم تضيف منتجات الأول عشان تكمل الطلب
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-primary-light transition-colors"
          >
            تسوق الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: "المتجر", href: "/shop" }, { label: "إتمام الشراء" }]} />

      <h1 className="text-2xl font-bold text-brand-primary font-heading mt-6 mb-8">
        إتمام الشراء
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-brand-border-light bg-brand-surface p-6 shadow-sm">
            <h2 className="text-lg font-bold text-brand-primary font-heading mb-5">
              بيانات التوصيل
            </h2>
            <CheckoutForm />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-brand-border-light bg-brand-surface p-6 shadow-sm">
            <h3 className="text-lg font-bold text-brand-primary font-heading mb-5">
              ملخص الطلب
            </h3>

            {/* Items */}
            <div className="space-y-3 mb-5">
              {items.map((item) => {
                const img =
                  item.product.images?.find((i: any) => i.isPrimary) ||
                  item.product.images?.[0];

                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-brand-secondary-light shrink-0">
                      {img ? (
                        <Image
                          src={img.url}
                          alt={item.product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-brand-text-muted">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-brand-text line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-brand-text-muted">
                        الكمية: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-primary shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-brand-border-light pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">المجموع الفرعي</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">رسوم التوصيل</span>
                <span className="font-medium">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t border-brand-border-light pt-2 flex justify-between">
                <span className="font-bold text-brand-primary">الإجمالي</span>
                <span className="font-bold text-brand-primary text-lg">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
