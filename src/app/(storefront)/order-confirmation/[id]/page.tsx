import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { getServerOrderById } from "@/services/server-orders";
import { formatPrice, formatDate, getOrderStatusInfo } from "@/lib/utils";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let order = null;
  try {
    order = await getServerOrderById(id);
  } catch {
    notFound();
  }

  if (!order) notFound();

  const statusInfo = getOrderStatusInfo(
    order.status as "new" | "reviewing" | "preparing" | "ready_to_ship" | "shipped" | "delivered" | "cancelled"
  );

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "المتجر", href: "/shop" },
          { label: "تأكيد الطلب" },
        ]}
      />

      {/* Success Message */}
      <div className="text-center mt-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-success/10 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-success"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-brand-primary font-heading mb-3">
          شكراً لك! تم استلام طلبك.
        </h1>
        <p className="text-brand-text-secondary text-lg">
          رقم الطلب:{" "}
          <span className="font-bold text-brand-primary">
            {order.orderNumber}
          </span>
        </p>
        <p className="text-sm text-brand-text-muted mt-2">
          {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Order Summary */}
      <div className="mt-10 rounded-xl border border-brand-border-light bg-brand-surface p-6 shadow-sm">
        <h2 className="text-lg font-bold text-brand-primary font-heading mb-5">
          ملخص الطلب
        </h2>

        {/* Status */}
        <div className="mb-5">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-5">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-brand-border-light last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-brand-text">
                  {item.productName}
                </p>
                <p className="text-xs text-brand-text-muted">
                  الكمية: {item.quantity}
                </p>
                {item.customizationName && (
                  <p className="text-xs text-brand-accent">
                    الاسم: {item.customizationName}
                  </p>
                )}
                {item.customizationTheme && (
                  <p className="text-xs text-brand-text-muted">
                    الثيم: {item.customizationTheme}
                  </p>
                )}
                {item.customizationSticker && (
                  <p className="text-xs text-brand-text-muted">
                    الاستيكر: {item.customizationSticker}
                  </p>
                )}
              </div>
              <span className="text-sm font-bold text-brand-primary shrink-0">
                {formatPrice(item.productPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-text-secondary">المجموع الفرعي</span>
            <span className="font-medium">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-text-secondary">رسوم التوصيل</span>
            <span className="font-medium">
              {formatPrice(order.deliveryFee)}
            </span>
          </div>
          <div className="border-t border-brand-border-light pt-2 flex justify-between">
            <span className="font-bold text-brand-primary">الإجمالي</span>
            <span className="font-bold text-brand-primary text-lg">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="mt-5 pt-5 border-t border-brand-border-light">
          <h3 className="text-sm font-bold text-brand-primary mb-2 font-heading">
            بيانات التوصيل
          </h3>
          <div className="text-sm text-brand-text-secondary space-y-1">
            <p>
              {order.governorate}، {order.area}
            </p>
            <p>{order.address}</p>
            <p>الهاتف: {order.phone}</p>
            {order.email && <p>البريد: {order.email}</p>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-primary-light transition-colors"
        >
          متابعة التسوق
        </Link>
        <Link
          href="/account/orders"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-brand-primary text-brand-primary font-medium hover:bg-brand-primary hover:text-white transition-all"
        >
          طلباتي
        </Link>
      </div>
    </div>
  );
}
