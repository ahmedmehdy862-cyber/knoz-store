import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    totalOrders,
    newOrders,
    preparingOrders,
    completedOrders,
    totalProducts,
    inactiveProducts,
    totalCustomers,
    revenueResult,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "new" } }),
    prisma.order.count({ where: { status: "preparing" } }),
    prisma.order.count({ where: { status: "delivered" } }),
    prisma.product.count(),
    prisma.product.count({ where: { isActive: false } }),
    prisma.customer.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "cancelled" } } }),
  ]);

  return {
    total_orders: totalOrders,
    new_orders: newOrders,
    preparing_orders: preparingOrders,
    completed_orders: completedOrders,
    total_products: totalProducts,
    inactive_products: inactiveProducts,
    total_customers: totalCustomers,
    total_revenue: revenueResult._sum.total || 0,
  };
}

export async function getRecentOrders(limit: number = 10) {
  return prisma.order.findMany({
    include: { customer: true, items: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
