import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { getServerOrderById } from "@/services/server-orders";
import {
  formatPrice,
  formatDate,
  getOrderStatusInfo,
  ORDER_STATUSES,
} from "@/lib/utils";

const STATUS_TIMELINE = [
  "new",
  "reviewing",
  "preparing",
  "ready_to_ship",
  "shipped",
  "delivered",
] as const;

export default async function OrderDetailsPage({
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
  const currentIndex = STATUS_TIMELINE.indexOf(
    order.status as (typeof STATUS_TIMELINE)[number]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "حسابي", href: "/account" },
          { label: "طلباتي", href: "/account/orders" },
          { label: order.orderNumber },
        ]}
      />

      <div className="mt-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary font-heading">
            طلب {order.orderNumber}
          </h1>
          <p className="text-sm text-brand-text-muted mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* Status Timeline */}
      {order.status !== "cancelled" && (
        <div className="mt-8 rounded-xl border border-brand-border-light bg-brand-surface p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-primary font-heading mb-5">
            حالة الطلب
          </h2>
          <div className="flex items-center justify-between">
            {STATUS_TIMELINE.map((status, index) => {
              const info = getOrderStatusInfo(status);
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div
                  key={status}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors ${
                      isActive
                        ? "bg-brand-primary text-white"
                        : "bg-brand-secondary-light text-brand-text-muted"
                    } ${isCurrent ? "ring-2 ring-brand-primary ring-offset-2" : ""}`}
                  >
                    {isActive ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-[10px] text-center leading-tight ${
                      isActive ? "text-brand-primary font-medium" : "text-brand-text-muted"
                    }`}
                  >
                    {info.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {order.status === "cancelled" && (
        <div className="mt-8 rounded-xl border border-brand-error/20 bg-brand-error/5 p-6">
          <p className="text-brand-error font-medium">تم إلغاء هذا الطلب</p>
        </div>
      )}

      {/* Order Items */}
      <div className="mt-8 rounded-xl border border-brand-border-light bg-brand-surface p-6 shadow-sm">
        <h2 className="text-lg font-bold text-brand-primary font-heading mb-5">
          المنتجات
        </h2>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 border-b border-brand-border-light last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-brand-text">
                  {item.productName}
                </p>
                <p className="text-xs text-brand-text-muted">
                  الكمية: {item.quantity} × {formatPrice(item.productPrice)}
                </p>
                {item.customizationName && (
                  <p className="text-xs text-brand-accent mt-0.5">
                    الاسم: {item.customizationName}
                  </p>
                )}
                {item.customizationTheme && (
                  <p className="text-xs text-brand-text-muted mt-0.5">
                    الثيم: {item.customizationTheme}
                  </p>
                )}
                {item.customizationSticker && (
                  <p className="text-xs text-brand-text-muted mt-0.5">
                    الاستيكر: {item.customizationSticker}
                  </p>
                )}
                {item.customizationNotes && (
                  <p className="text-xs text-brand-text-muted mt-0.5">
                    ملاحظات: {item.customizationNotes}
                  </p>
                )}
              </div>
              <span className="text-sm font-bold text-brand-primary shrink-0">
                {formatPrice(item.productPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Totals */}
        <div className="rounded-xl border border-brand-border-light bg-brand-surface p-6 shadow-sm">
          <h3 className="text-sm font-bold text-brand-primary mb-3 font-heading">
            ملخص الدفع
          </h3>
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
        </div>

        {/* Shipping Info */}
        <div className="rounded-xl border border-brand-border-light bg-brand-surface p-6 shadow-sm">
          <h3 className="text-sm font-bold text-brand-primary mb-3 font-heading">
            بيانات التوصيل
          </h3>
          <div className="text-sm text-brand-text-secondary space-y-1.5">
            <p>
              {order.governorate}، {order.area}
            </p>
            <p>{order.address}</p>
            <p className="font-medium text-brand-text">الهاتف: {order.phone}</p>
            {order.email && <p>البريد: {order.email}</p>}
            {order.notes && (
              <p className="mt-2 text-brand-text-muted italic">
                ملاحظات: {order.notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="mt-8">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm text-brand-accent hover:text-brand-accent-dark transition-colors"
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
            className="rotate-180"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          العودة لطلباتي
        </Link>
      </div>
    </div>
  );
}
