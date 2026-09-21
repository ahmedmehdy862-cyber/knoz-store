import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";

interface CustomersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCustomers(search?: string, page: number = 1) {
  const supabase = await createClient();
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("customers")
    .select("*, user:users(email)", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const customers = data || [];

  const customersWithStats = await Promise.all(
    customers.map(async (customer) => {
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("customerId", customer.id);

      const { data: orders } = await supabase
        .from("orders")
        .select("total")
        .eq("customerId", customer.id);

      const totalSpent = (orders || []).reduce(
        (sum, o) => sum + (Number(o.total) || 0),
        0
      );

      const lastOrder = orders && orders.length > 0 ? orders[0] : null;

      return {
        ...customer,
        orders_count: ordersCount || 0,
        total_spent: totalSpent,
      };
    })
  );

  return {
    customers: customersWithStats,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    page,
  };
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  const { customers, total, totalPages, page: currentPage } = await getCustomers(search, page);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-primary font-heading">
          إدارة العملاء
        </h1>
        <p className="text-sm text-brand-text-secondary mt-1">
          {total} عميل إجمالي
        </p>
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border-light">
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الاسم
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الهاتف
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  البريد
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الطلبات
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  إجمالي المشتريات
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  التسجيل
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-brand-text-muted"
                  >
                    لا يوجد عملاء
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-brand-border-light/50 hover:bg-brand-surface-hover transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-brand-text">
                      {customer.name}
                    </td>
                    <td className="px-5 py-3 text-brand-text-secondary" dir="ltr">
                      {customer.phone}
                    </td>
                    <td className="px-5 py-3 text-brand-text-secondary">
                      {(customer.user as { email: string } | null)?.email || "—"}
                    </td>
                    <td className="px-5 py-3 text-brand-text">
                      {customer.orders_count}
                    </td>
                    <td className="px-5 py-3 font-medium text-brand-text">
                      {customer.total_spent.toLocaleString("ar-EG")} جنيه
                    </td>
                    <td className="px-5 py-3 text-brand-text-secondary">
                      {formatDate(customer.createdAt)}
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
                <a
                  href={`/admin/customers?page=${currentPage - 1}`}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-secondary text-brand-primary hover:bg-brand-secondary-dark transition-colors"
                >
                  السابق
                </a>
              )}
              {currentPage < totalPages && (
                <a
                  href={`/admin/customers?page=${currentPage + 1}`}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-secondary text-brand-primary hover:bg-brand-secondary-dark transition-colors"
                >
                  التالي
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
