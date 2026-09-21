import { prisma } from "@/lib/prisma";

export async function createOrder(data: any) {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const lastNumber = lastOrder
    ? parseInt(lastOrder.orderNumber.replace("KZ-", ""))
    : 0;
  const orderNumber = `KZ-${String(lastNumber + 1).padStart(4, "0")}`;

  const customer = await prisma.customer.create({
    data: {
      name: data.customer_name,
      phone: data.phone,
      email: data.email,
      governorate: data.governorate,
      area: data.area,
      address: data.address,
    },
  });

  return prisma.order.create({
    data: {
      orderNumber,
      customerId: customer.id,
      status: "new",
      subtotal: data.subtotal,
      deliveryFee: data.deliveryFee,
      total: data.total,
      phone: data.phone,
      email: data.email,
      governorate: data.governorate,
      area: data.area,
      address: data.address,
      notes: data.notes,
      items: {
        create: data.items.map((item: any) => ({
          productId: item.product_id || item.productId,
          productName: item.product_name || item.productName,
          productPrice: item.product_price || item.productPrice,
          quantity: item.quantity,
          customizationName: item.customization_name || item.customizationName,
          customizationTheme: item.customization_theme || item.customizationTheme,
          customizationSticker: item.customization_sticker || item.customizationSticker,
          customizationNotes: item.customization_notes || item.customizationNotes,
          customizationImageUrl: item.customization_image_url || item.customizationImageUrl,
        })),
      },
    },
    include: { items: true, customer: true },
  });
}

export async function getOrders(filters: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
} = {}) {
  const { page = 1, limit = 20, status, search } = filters;

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { phone: { contains: search } },
      { customer: { name: { contains: search } } },
    ];
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { customer: true, items: true },
  });
}

export async function getOrdersByCustomerId(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}
