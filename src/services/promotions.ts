import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export interface Promotion {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  badge: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  linkText: string | null;
  isActive: boolean;
  sortOrder: number;
}

export async function getActivePromotions(): Promise<Promotion[]> {
  await connection();
  return prisma.promotion.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}