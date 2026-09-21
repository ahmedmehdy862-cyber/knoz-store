import { prisma } from "@/lib/prisma";

export async function getServerCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getServerCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
  });
}
