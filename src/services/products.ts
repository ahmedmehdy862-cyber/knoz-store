import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";

interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  categoryId?: string;
  isFeatured?: boolean;
  customizable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

function mapProduct(p: any): Product {
  return {
    ...p,
    category: p.category || undefined,
    images: p.images || [],
    themes: p.productThemes?.map((pt: any) => pt.theme) || [],
    stickers: p.productStickers?.map((ps: any) => ps.sticker) || [],
  };
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResult<Product>> {
  const {
    page = 1,
    limit = 12,
    search,
    categorySlug,
    categoryId,
    isFeatured,
    customizable,
    minPrice,
    maxPrice,
    sort = "newest",
  } = filters;

  const where: any = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { badge: { contains: search } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (typeof isFeatured === "boolean") {
    where.isFeatured = isFeatured;
  }

  if (typeof customizable === "boolean") {
    where.customizationEnabled = customizable;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const orderBy: any = (() => {
    switch (sort) {
      case "price_asc": return { price: "asc" as const };
      case "price_desc": return { price: "desc" as const };
      case "oldest": return { createdAt: "asc" as const };
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
        productThemes: { include: { theme: true } },
        productStickers: { include: { sticker: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products.map(mapProduct),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      productThemes: { include: { theme: true } },
      productStickers: { include: { sticker: true } },
    },
  });

  return product ? mapProduct(product) : null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      productThemes: { include: { theme: true } },
      productStickers: { include: { sticker: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return products.map(mapProduct);
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 4
): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId,
      id: { not: productId },
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return products.map(mapProduct);
}

export async function createProduct(data: any): Promise<Product> {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      oldPrice: data.oldPrice,
      sku: data.sku,
      categoryId: data.categoryId,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      badge: data.badge,
      customizationEnabled: data.customizationEnabled ?? false,
      allowsName: data.allowsName ?? false,
      allowsTheme: data.allowsTheme ?? false,
      allowsSticker: data.allowsSticker ?? false,
      allowsImageUpload: data.allowsImageUpload ?? false,
      allowsNotes: data.allowsNotes ?? false,
      stock: data.stock ?? 0,
    },
    include: {
      category: true,
      images: true,
      productThemes: { include: { theme: true } },
      productStickers: { include: { sticker: true } },
    },
  });

  return mapProduct(product);
}

export async function updateProduct(id: string, data: any): Promise<Product> {
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      oldPrice: data.oldPrice,
      sku: data.sku,
      categoryId: data.categoryId,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      badge: data.badge,
      customizationEnabled: data.customizationEnabled,
      allowsName: data.allowsName,
      allowsTheme: data.allowsTheme,
      allowsSticker: data.allowsSticker,
      allowsImageUpload: data.allowsImageUpload,
      allowsNotes: data.allowsNotes,
      stock: data.stock,
    },
    include: {
      category: true,
      images: true,
      productThemes: { include: { theme: true } },
      productStickers: { include: { sticker: true } },
    },
  });

  return mapProduct(product);
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}
