import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/admin/StatsCard";
import { BadgeStatus } from "@/components/ui/BadgeStatus";
import { formatPrice, formatDateTime, type OrderStatus } from "@/lib/utils";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
} from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  const supabase = await createClient();

  const [ordersResult, productsResult, customersResult] = await Promise.all([
    supabase
      .from("orders")
      .select("id, status, total", { count: "exact" }),
    supabase
      .from("products")
      .select("id, isActive", { count: "exact" }),
    supabase
      .from("customers")
      .select("id", { count: "exact" }),
  ]);

  const orders = ordersResult.data || [];
  const products = productsResult.data || [];

  const totalOrders = ordersResult.count || 0;
  const newOrders = orders.filter((o) => o.status === "new").length;
  const preparingOrders = orders.filter((o) => o.status === "preparing").length;
  const completedOrders = orders.filter(
    (o) => o.status === "delivered"
  ).length;
  const totalProducts = productsResult.count || 0;
  const inactiveProducts = products.filter((p) => !p.isActive).length;
  const totalCustomers = customersResult.count || 0;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return {
    totalOrders,
    newOrders,
    preparingOrders,
    completedOrders,
    totalProducts,
    inactiveProducts,
    totalCustomers,
    totalRevenue,
  };
}

async function getRecentOrders() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, customer:customers(name, phone)")
    .order("createdAt", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data || [];
}

export default async function AdminDashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          icon={<ShoppingCart size={20} />}
          title="إجمالي الطلبات"
          value={stats.totalOrders}
        />
        <StatsCard
          icon={<Clock size={20} />}
          title="الطلبات الجديدة"
          value={stats.newOrders}
        />
        <StatsCard
          icon={<Package size={20} />}
          title="قيد التجهيز"
          value={stats.preparingOrders}
        />
        <StatsCard
          icon={<CheckCircle size={20} />}
          title="الطلبات المكتملة"
          value={stats.completedOrders}
        />
        <StatsCard
          icon={<Package size={20} />}
          title="إجمالي المنتجات"
          value={stats.totalProducts}
        />
        <StatsCard
          icon={<AlertTriangle size={20} />}
          title="المنتجات غير المتاحة"
          value={stats.inactiveProducts}
        />
        <StatsCard
          icon={<Users size={20} />}
          title="إجمالي العملاء"
          value={stats.totalCustomers}
        />
        <StatsCard
          icon={<TrendingUp size={20} />}
          title="إجمالي الإيرادات"
          value={formatPrice(stats.totalRevenue)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-brand-surface rounded-xl border border-brand-border-light shadow-sm">
          <div className="px-5 py-4 border-b border-brand-border-light flex items-center justify-between">
            <h2 className="font-bold text-brand-primary font-heading">
              أحدث الطلبات
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-brand-accent hover:text-brand-accent-dark font-medium"
            >
              عرض الكل
            </Link>
          </div>
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
                    المبلغ
                  </th>
                  <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                    التاريخ
                  </th>
                  <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-brand-text-muted"
                    >
                      لا توجد طلبات بعد
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-brand-border-light/50 hover:bg-brand-surface-hover transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-brand-accent hover:text-brand-accent-dark"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-brand-text">
                        {order.customer?.name || "—"}
                      </td>
                      <td className="px-5 py-3 text-brand-text font-medium">
                        {formatPrice(Number(order.total))}
                      </td>
                      <td className="px-5 py-3 text-brand-text-secondary">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <BadgeStatus status={order.status as OrderStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-5">
          <h2 className="font-bold text-brand-primary font-heading mb-4">
            إجراءات سريعة
          </h2>
          <div className="space-y-2">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-secondary transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                <Plus size={18} />
              </div>
              <span className="text-sm font-medium text-brand-text">
                إضافة منتج جديد
              </span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-secondary transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                <Eye size={18} />
              </div>
              <span className="text-sm font-medium text-brand-text">
                مراجعة الطلبات
              </span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-secondary transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                <Package size={18} />
              </div>
              <span className="text-sm font-medium text-brand-text">
                إدارة المنتجات
              </span>
            </Link>
            <Link
              href="/admin/customers"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-secondary transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                <Users size={18} />
              </div>
              <span className="text-sm font-medium text-brand-text">
                عرض العملاء
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
