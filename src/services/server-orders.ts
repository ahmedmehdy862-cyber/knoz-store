import { prisma } from "@/lib/prisma";

export async function getServerOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { customer: true, items: true },
  });
}

export async function getServerOrdersByCustomerId(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}
