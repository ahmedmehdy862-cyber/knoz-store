import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BadgeStatus } from "@/components/ui/BadgeStatus";
import { formatPrice, formatDateTime, ORDER_STATUSES, type OrderStatus } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Printer } from "lucide-react";
import { UpdateOrderStatus } from "./UpdateOrderStatus";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "*, customer:customers(*, user:users(*)), items:order_items(*, product:products(*))"
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-lg hover:bg-brand-secondary text-brand-text-secondary transition-colors"
          >
            <ArrowRight size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-brand-primary font-heading">
              طلب {order.orderNumber}
            </h1>
            <p className="text-sm text-brand-text-secondary mt-0.5">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-brand-secondary text-brand-primary hover:bg-brand-secondary-dark transition-colors cursor-pointer print:hidden"
          >
            <Printer size={16} />
            طباعة
          </button>
          <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-5">
            <h2 className="font-bold text-brand-primary font-heading mb-4">
              المنتجات
            </h2>
            <div className="space-y-4">
              {order.items?.map((item: Record<string, unknown>) => {
                const orderItem = item as {
                  id: string;
                  productName: string;
                  productPrice: number;
                  quantity: number;
                  customizationName: string | null;
                  customizationTheme: string | null;
                  customizationSticker: string | null;
                  customizationNotes: string | null;
                  customization_imageUrl: string | null;
                };
                return (
                  <div
                    key={orderItem.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-brand-background border border-brand-border-light/50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-brand-text">
                        {orderItem.productName}
                      </h3>
                      <p className="text-sm text-brand-text-secondary mt-0.5">
                        الكمية: {orderItem.quantity} × {formatPrice(Number(orderItem.productPrice))}
                      </p>

                      {(orderItem.customizationName ||
                        orderItem.customizationTheme ||
                        orderItem.customizationSticker ||
                        orderItem.customizationNotes ||
                        orderItem.customization_imageUrl) && (
                        <div className="mt-3 p-3 rounded-lg bg-brand-accent/5 border border-brand-accent/20">
                          <p className="text-xs font-bold text-brand-accent mb-2">
                            التخصيص
                          </p>
                          <div className="space-y-1 text-sm">
                            {orderItem.customizationName && (
                              <p>
                                <span className="text-brand-text-secondary">الاسم: </span>
                                <span className="font-medium text-brand-text">
                                  {orderItem.customizationName}
                                </span>
                              </p>
                            )}
                            {orderItem.customizationTheme && (
                              <p>
                                <span className="text-brand-text-secondary">الثيم: </span>
                                <span className="font-medium text-brand-text">
                                  {orderItem.customizationTheme}
                                </span>
                              </p>
                            )}
                            {orderItem.customizationSticker && (
                              <p>
                                <span className="text-brand-text-secondary">الاستيكر: </span>
                                <span className="font-medium text-brand-text">
                                  {orderItem.customizationSticker}
                                </span>
                              </p>
                            )}
                            {orderItem.customizationNotes && (
                              <p>
                                <span className="text-brand-text-secondary">ملاحظات: </span>
                                <span className="font-medium text-brand-text">
                                  {orderItem.customizationNotes}
                                </span>
                              </p>
                            )}
                            {orderItem.customization_imageUrl && (
                              <div className="mt-2">
                                <img
                                  src={orderItem.customization_imageUrl}
                                  alt="صورة التخصيص"
                                  className="w-20 h-20 object-cover rounded-lg border border-brand-border-light"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-brand-primary">
                        {formatPrice(Number(orderItem.productPrice) * orderItem.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-brand-border-light space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary">المجموع الفرعي</span>
                <span className="text-brand-text">{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary">رسوم التوصيل</span>
                <span className="text-brand-text">{formatPrice(Number(order.deliveryFee))}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span className="text-brand-primary">الإجمالي</span>
                <span className="text-brand-primary">{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-5">
            <h2 className="font-bold text-brand-primary font-heading mb-4">
              حالة الطلب
            </h2>
            <BadgeStatus status={order.status as OrderStatus} />
          </div>

          <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-5">
            <h2 className="font-bold text-brand-primary font-heading mb-4">
              بيانات العميل
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-brand-text-secondary">الاسم</p>
                <p className="font-medium text-brand-text">{order.customer?.name || "—"}</p>
              </div>
              <div>
                <p className="text-brand-text-secondary">الهاتف</p>
                <p className="font-medium text-brand-text" dir="ltr">{order.phone}</p>
              </div>
              {order.email && (
                <div>
                  <p className="text-brand-text-secondary">البريد الإلكتروني</p>
                  <p className="font-medium text-brand-text">{order.email}</p>
                </div>
              )}
              <div>
                <p className="text-brand-text-secondary">المحافظة</p>
                <p className="font-medium text-brand-text">{order.governorate || "—"}</p>
              </div>
              <div>
                <p className="text-brand-text-secondary">المنطقة</p>
                <p className="font-medium text-brand-text">{order.area || "—"}</p>
              </div>
              <div>
                <p className="text-brand-text-secondary">العنوان</p>
                <p className="font-medium text-brand-text">{order.address || "—"}</p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-brand-text-secondary">ملاحظات</p>
                  <p className="font-medium text-brand-text">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
