import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const price = Number(body.price);
    if (!name || !Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { error: "اسم المنتج والسعر مطلوبان" },
        { status: 400 }
      );
    }

    const categoryId =
      typeof body.categoryId === "string" && body.categoryId
        ? body.categoryId
        : null;
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return NextResponse.json(
          { error: "التصنيف المختار غير موجود" },
          { status: 400 }
        );
      }
    }

    const slug = await uniqueSlug(
      async (s) => (await prisma.product.findUnique({ where: { slug: s } })) !== null,
      name
    );

    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl : "";
    const themeIds = toStringArray(body.theme_ids);
    const stickerIds = toStringArray(body.sticker_ids);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description:
          typeof body.description === "string" && body.description
            ? body.description
            : null,
        price,
        oldPrice:
          body.oldPrice === null || body.oldPrice === undefined || body.oldPrice === ""
            ? null
            : Number(body.oldPrice) || null,
        sku: typeof body.sku === "string" && body.sku ? body.sku : null,
        categoryId,
        stock: Number.isFinite(Number(body.stock)) ? Math.max(0, Math.floor(Number(body.stock))) : 0,
        badge: typeof body.badge === "string" && body.badge ? body.badge : null,
        isActive: body.isActive !== false,
        isFeatured: body.isFeatured === true,
        customizationEnabled: body.customizationEnabled === true,
        allowsName: body.allowsName === true,
        allowsTheme: body.allowsTheme === true,
        allowsSticker: body.allowsSticker === true,
        allowsImageUpload: body.allowsImageUpload === true,
        allowsNotes: body.allowsNotes === true,
        images: imageUrl
          ? { create: [{ url: imageUrl, isPrimary: true }] }
          : undefined,
        productThemes: themeIds.length
          ? { create: themeIds.map((themeId) => ({ themeId })) }
          : undefined,
        productStickers: stickerIds.length
          ? { create: stickerIds.map((stickerId) => ({ stickerId })) }
          : undefined,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء إضافة المنتج" },
      { status: unauthorized ? 401 : 500 }
    );
  }
}