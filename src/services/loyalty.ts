import { prisma } from "@/lib/prisma";

export interface LoyaltyTier {
  min: number;
  discount: number;
}

export async function getLoyaltyTiers(): Promise<LoyaltyTier[]> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "loyalty" } });
    const parsed = row ? (JSON.parse(row.value) as Record<string, unknown>) : {};
    const raw = (parsed as { tiers?: unknown }).tiers;
    if (!Array.isArray(raw)) return [{ min: 0, discount: 0 }];
    return raw
      .map((t) => ({
        min: Math.max(0, Number((t as Record<string, unknown>)?.min) || 0),
        discount: Math.min(
          90,
          Math.max(0, Number((t as Record<string, unknown>)?.discount) || 0)
        ),
      }))
      .sort((a, b) => a.min - b.min);
  } catch {
    return [{ min: 0, discount: 0 }];
  }
}

export function resolveLoyaltyDiscount(tiers: LoyaltyTier[], totalSpent: number): number {
  let percent = 0;
  for (const tier of tiers) {
    if (totalSpent >= tier.min) percent = tier.discount;
  }
  return percent;
}

export async function findCustomerByPhone(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  const exact = await prisma.customer.findFirst({ where: { phone } });
  if (exact) return exact;
  if (digits.length < 7) return null;
  const tail = digits.slice(-9);
  const candidates = await prisma.customer.findMany({
    where: { phone: { contains: tail } },
  });
  return (
    candidates.find((c) => c.phone.replace(/[^0-9]/g, "") === digits) || null
  );
}

export async function getCustomerLoyalty(
  phone: string
): Promise<{ totalSpent: number; percent: number }> {
  const customer = await findCustomerByPhone(phone);
  if (!customer) return { totalSpent: 0, percent: 0 };
  const agg = await prisma.order.aggregate({
    where: { customerId: customer.id, status: { not: "cancelled" } },
    _sum: { total: true },
  });
  const totalSpent = Math.round((agg._sum.total || 0) * 100) / 100;
  const tiers = await getLoyaltyTiers();
  return { totalSpent, percent: resolveLoyaltyDiscount(tiers, totalSpent) };
}