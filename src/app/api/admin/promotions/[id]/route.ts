import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function clean(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.promotion.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "العرض غير موجود" }, { status: 404 });
    }

    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : existing.title;

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        title,
        subtitle: body.subtitle === undefined ? existing.subtitle : clean(body.subtitle),
        description:
          body.description === undefined ? existing.description : clean(body.description),
        badge: body.badge === undefined ? existing.badge : clean(body.badge),
        imageUrl: body.imageUrl === undefined ? existing.imageUrl : clean(body.imageUrl),
        linkUrl: body.linkUrl === undefined ? existing.linkUrl : clean(body.linkUrl),
        linkText: body.linkText === undefined ? existing.linkText : clean(body.linkText),
        isActive:
          body.isActive === undefined ? existing.isActive : body.isActive !== false,
        sortOrder:
          body.sortOrder === undefined || !Number.isFinite(Number(body.sortOrder))
            ? existing.sortOrder
            : Math.floor(Number(body.sortOrder)),
      },
    });

    return NextResponse.json(promotion);
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء حفظ العرض" },
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

    const existing = await prisma.promotion.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "العرض غير موجود" }, { status: 404 });
    }

    await prisma.promotion.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء حذف العرض" },
      { status: unauthorized ? 401 : 500 }
    );
  }
}