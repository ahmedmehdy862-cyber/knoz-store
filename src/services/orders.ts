import { prisma } from "@/lib/prisma";
import {
  getLoyaltyTiers,
  resolveLoyaltyDiscount,
  findCustomerByPhone,
} from "@/services/loyalty";

function bad(message: string): Error {
  return Object.assign(new Error(message), { status: 400 });
}

interface NormalizedItem {
  productId: string | null;
  productName: string;
  productPrice: number;
  quantity: number;
  customizationName?: string | null;
  customizationTheme?: string | null;
  customizationSticker?: string | null;
  customizationNotes?: string | null;
  customizationImageUrl?: string | null;
}

export async function getDeliverySettings(): Promise<{ threshold: number; fee: number }> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "delivery" } });
    const parsed = row ? (JSON.parse(row.value) as Record<string, unknown>) : {};
    const threshold = Number(parsed.free_delivery_threshold);
    const fee = Number(parsed.default_deliveryFee);
    return {
      threshold: Number.isFinite(threshold) && threshold >= 0 ? threshold : 500,
      fee: Number.isFinite(fee) && fee >= 0 ? fee : 50,
    };
  } catch {
    return { threshold: 500, fee: 50 };
  }
}

export async function createOrder(data: any) {
  const rawItems = Array.isArray(data.items) ? data.items : [];
  if (rawItems.length === 0) throw bad("السلة فارغة");

  const items: NormalizedItem[] = rawItems.map((item: any) => ({
    productId: item.product_id || item.productId || null,
    productName: item.product_name || item.productName || "منتج",
    productPrice: Number(item.product_price ?? item.productPrice ?? 0),
    quantity: item.quantity,
    customizationName: item.customization_name || item.customizationName || null,
    customizationTheme: item.customization_theme || item.customizationTheme || null,
    customizationSticker: item.customization_sticker || item.customizationSticker || null,
    customizationNotes: item.customization_notes || item.customizationNotes || null,
    customizationImageUrl:
      item.customization_image_url || item.customizationImageUrl || null,
  }));

  const ids = [...new Set(items.map((i) => i.productId).filter((id): id is string => !!id))];
  const dbProducts = ids.length
    ? await prisma.product.findMany({ where: { id: { in: ids } } })
    : [];
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  for (const item of items) {
    const dbProduct = item.productId ? productMap.get(item.productId) : undefined;
    if (item.productId && !dbProduct) throw bad(`المنتج "${item.productName}" غير موجود`);
    if (dbProduct && !dbProduct.isActive) throw bad(`المنتج "${item.productName}" غير متاح حالياً`);
    if (dbProduct) {
      item.productPrice = dbProduct.price;
      if (dbProduct.stock < item.quantity) {
        throw bad(`الكمية المتاحة من "${item.productName}" غير كافية`);
      }
    }
    subtotal += item.productPrice * item.quantity;
  }
  subtotal = Math.round(subtotal * 100) / 100;

  const { threshold, fee } = await getDeliverySettings();

  const phone: string = data.phone;
  let customer = await findCustomerByPhone(phone);
  if (customer) {
    customer = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        name: data.customer_name || customer.name,
        email: data.email || customer.email,
        governorate: data.governorate ?? customer.governorate,
        area: data.area ?? customer.area,
        address: data.address ?? customer.address,
      },
    });
  } else {
    customer = await prisma.customer.create({
      data: {
        name: data.customer_name,
        phone,
        email: data.email || null,
        governorate: data.governorate || null,
        area: data.area || null,
        address: data.address || null,
      },
    });
  }

  const priorAgg = await prisma.order.aggregate({
    where: { customerId: customer.id, status: { not: "cancelled" } },
    _sum: { total: true },
  });
  const priorSpent = priorAgg._sum.total || 0;
  const tiers = await getLoyaltyTiers();
  const loyaltyPercent = resolveLoyaltyDiscount(tiers, priorSpent);
  const loyaltyDiscount = Math.round(((subtotal * loyaltyPercent) / 100) * 100) / 100;
  const discountedSubtotal = Math.round((subtotal - loyaltyDiscount) * 100) / 100;

  const deliveryFee = discountedSubtotal <= 0 ? 0 : discountedSubtotal >= threshold ? 0 : fee;
  const total = Math.round((discountedSubtotal + deliveryFee) * 100) / 100;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const lastOrder = await prisma.order.findFirst({
        orderBy: { createdAt: "desc" },
        select: { orderNumber: true },
      });
      const lastNumber = lastOrder
        ? parseInt(lastOrder.orderNumber.replace("KZ-", "")) || 0
        : 0;
      const orderNumber = `KZ-${String(lastNumber + 1).padStart(4, "0")}`;

      return await prisma.$transaction(async (tx) => {
        for (const item of items) {
          if (!item.productId) continue;
          const updated = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (updated.count === 0) {
            throw bad(`الكمية المتاحة من "${item.productName}" غير كافية`);
          }
        }

        return tx.order.create({
          data: {
            orderNumber,
            customerId: customer.id,
            status: "new",
            subtotal,
            loyaltyPercent,
            loyaltyDiscount,
            deliveryFee,
            total,
            phone,
            email: data.email || null,
            governorate: data.governorate || null,
            area: data.area || null,
            address: data.address || null,
            notes: data.notes || null,
            items: {
              create: items.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                productPrice: item.productPrice,
                quantity: item.quantity,
                customizationName: item.customizationName,
                customizationTheme: item.customizationTheme,
                customizationSticker: item.customizationSticker,
                customizationNotes: item.customizationNotes,
                customizationImageUrl: item.customizationImageUrl,
              })),
            },
          },
          include: { items: true, customer: true },
        });
      });
    } catch (error: any) {
      if (error?.status === 400) throw error;
      if (error?.code === "P2002" && attempt < 2) continue;
      throw error;
    }
  }

  throw new Error("Order creation failed");
}