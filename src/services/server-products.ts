import { prisma } from "@/lib/prisma";

export async function getServerProducts(filters: any = {}) {
  const { page = 1, limit = 12, search, categorySlug, sort = "newest" } = filters;

  const where: any = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  const orderBy: any = (() => {
    switch (sort) {
      case "price_asc": return { price: "asc" as const };
      case "price_desc": return { price: "desc" as const };
      default: return { createdAt: "desc" as const };
    }
  })();

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { data: products, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getServerProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      productThemes: { include: { theme: true } },
      productStickers: { include: { sticker: true } },
    },
  });
}

export async function getServerFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

export async function getServerRelatedProducts(productId: string, categoryId: string) {
  return prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: productId } },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
}
