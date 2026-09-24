import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function clean(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ error: "عنوان العرض مطلوب" }, { status: 400 });
    }

    const promotion = await prisma.promotion.create({
      data: {
        title,
        subtitle: clean(body.subtitle),
        description: clean(body.description),
        badge: clean(body.badge),
        imageUrl: clean(body.imageUrl),
        linkUrl: clean(body.linkUrl),
        linkText: clean(body.linkText),
        isActive: body.isActive !== false,
        sortOrder: Number.isFinite(Number(body.sortOrder))
          ? Math.floor(Number(body.sortOrder))
          : 0,
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء إضافة العرض" },
      { status: unauthorized ? 401 : 500 }
    );
  }
}