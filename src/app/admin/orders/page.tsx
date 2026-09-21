import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { BadgeStatus } from "@/components/ui/BadgeStatus";
import { formatPrice, formatDateTime, ORDER_STATUSES, type OrderStatus } from "@/lib/utils";
import Link from "next/link";
import { Eye, Search } from "lucide-react";

interface OrdersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getOrders(status?: string, search?: string, page: number = 1) {
  const limit = 10;
  const from = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {};
  if (status && status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [orders, count] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: from,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    total: count,
    totalPages: Math.ceil(count / limit),
    page,
  };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  const { orders, total, totalPages, page: currentPage } = await getOrders(status, search, page);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-primary font-heading">
            إدارة الطلبات
          </h1>
          <p className="text-sm text-brand-text-secondary mt-1">
            {total} طلب إجمالي
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !status || status === "all"
              ? "bg-brand-primary text-white"
              : "bg-brand-surface border border-brand-border-light text-brand-text-secondary hover:bg-brand-secondary"
          }`}
        >
          الكل
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s.value}
            href={`/admin/orders?status=${s.value}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === s.value
                ? "bg-brand-primary text-white"
                : "bg-brand-surface border border-brand-border-light text-brand-text-secondary hover:bg-brand-secondary"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border-light">
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  رقم الطلب
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  العميل
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الهاتف
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  المبلغ
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  التاريخ
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الحالة
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-brand-text-muted"
                  >
                    لا توجد طلبات
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-brand-border-light/50 hover:bg-brand-surface-hover transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-brand-accent">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-brand-text">
                      {order.customer?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-brand-text-secondary" dir="ltr">
                      {order.phone}
                    </td>
                    <td className="px-5 py-3 font-medium text-brand-text">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="px-5 py-3 text-brand-text-secondary">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <BadgeStatus status={order.status as OrderStatus} />
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-accent/10 text-brand-accent hover:bg-brand-accent hover:text-white transition-colors"
                      >
                        <Eye size={14} />
                        تفاصيل
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-brand-border-light flex items-center justify-between">
            <p className="text-sm text-brand-text-secondary">
              صفحة {currentPage} من {totalPages}
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/admin/orders?status=${status || "all"}&page=${currentPage - 1}`}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-secondary text-brand-primary hover:bg-brand-secondary-dark transition-colors"
                >
                  السابق
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/admin/orders?status=${status || "all"}&page=${currentPage + 1}`}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-secondary text-brand-primary hover:bg-brand-secondary-dark transition-colors"
                >
                  التالي
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
