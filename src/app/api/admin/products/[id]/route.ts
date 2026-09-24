import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    const name =
      typeof body.name === "string" && body.name.trim()
        ? body.name.trim()
        : existing.name;
    const price =
      body.price === undefined ? existing.price : Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "السعر غير صحيح" }, { status: 400 });
    }

    const categoryId =
      body.categoryId === undefined
        ? existing.categoryId
        : typeof body.categoryId === "string" && body.categoryId
          ? body.categoryId
          : null;

    const slug =
      name === existing.name
        ? existing.slug
        : await uniqueSlug(
            async (s) => {
              const found = await prisma.product.findUnique({ where: { slug: s } });
              return found !== null && found.id !== id;
            },
            name
          );

    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl : undefined;
    const themeIds = body.theme_ids === undefined ? undefined : toStringArray(body.theme_ids);
    const stickerIds = body.sticker_ids === undefined ? undefined : toStringArray(body.sticker_ids);

    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: {
          name,
          slug,
          description:
            body.description === undefined
              ? existing.description
              : body.description || null,
          price,
          oldPrice:
            body.oldPrice === undefined
              ? existing.oldPrice
              : body.oldPrice === null || body.oldPrice === ""
                ? null
                : Number(body.oldPrice) || null,
          sku: body.sku === undefined ? existing.sku : body.sku || null,
          categoryId,
          stock:
            body.stock === undefined
              ? existing.stock
              : Math.max(0, Math.floor(Number(body.stock)) || 0),
          badge: body.badge === undefined ? existing.badge : body.badge || null,
          isActive: body.isActive === undefined ? existing.isActive : body.isActive !== false,
          isFeatured: body.isFeatured === undefined ? existing.isFeatured : body.isFeatured === true,
          customizationEnabled:
            body.customizationEnabled === undefined
              ? existing.customizationEnabled
              : body.customizationEnabled === true,
          allowsName: body.allowsName === undefined ? existing.allowsName : body.allowsName === true,
          allowsTheme: body.allowsTheme === undefined ? existing.allowsTheme : body.allowsTheme === true,
          allowsSticker:
            body.allowsSticker === undefined ? existing.allowsSticker : body.allowsSticker === true,
          allowsImageUpload:
            body.allowsImageUpload === undefined
              ? existing.allowsImageUpload
              : body.allowsImageUpload === true,
          allowsNotes: body.allowsNotes === undefined ? existing.allowsNotes : body.allowsNotes === true,
        },
      });

      if (imageUrl !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (imageUrl) {
          await tx.productImage.create({
            data: { productId: id, url: imageUrl, isPrimary: true },
          });
        }
      }

      if (themeIds !== undefined) {
        await tx.productTheme.deleteMany({ where: { productId: id } });
        if (themeIds.length) {
          await tx.productTheme.createMany({
            data: themeIds.map((themeId) => ({ productId: id, themeId })),
          });
        }
      }

      if (stickerIds !== undefined) {
        await tx.productSticker.deleteMany({ where: { productId: id } });
        if (stickerIds.length) {
          await tx.productSticker.createMany({
            data: stickerIds.map((stickerId) => ({ productId: id, stickerId })),
          });
        }
      }

      return updated;
    });

    return NextResponse.json(product);
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء حفظ المنتج" },
      { status: unauthorized ? 401 : 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    const linkedOrders = await prisma.orderItem.count({ where: { productId: id } });
    if (linkedOrders > 0) {
      return NextResponse.json(
        { error: "لا يمكن حذف منتج مرتبط بطلبات. عطّله بدلاً من حذفه" },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء حذف المنتج" },
      { status: unauthorized ? 401 : 500 }
    );
  }
}