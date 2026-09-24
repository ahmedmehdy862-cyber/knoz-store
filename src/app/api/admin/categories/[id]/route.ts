import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "التصنيف غير موجود" }, { status: 404 });
    }

    const name =
      typeof body.name === "string" && body.name.trim()
        ? body.name.trim()
        : existing.name;
    const slug =
      name === existing.name
        ? existing.slug
        : await uniqueSlug(
            async (s) => {
              const found = await prisma.category.findUnique({ where: { slug: s } });
              return found !== null && found.id !== id;
            },
            name
          );

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description:
          body.description === undefined
            ? existing.description
            : body.description || null,
        imageUrl:
          body.imageUrl === undefined ? existing.imageUrl : body.imageUrl || null,
        isActive:
          body.isActive === undefined ? existing.isActive : body.isActive !== false,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء الحفظ" },
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

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "التصنيف غير موجود" }, { status: 404 });
    }

    const linkedProducts = await prisma.product.count({ where: { categoryId: id } });
    if (linkedProducts > 0) {
      return NextResponse.json(
        { error: "لا يمكن حذف تصنيف مرتبط بمنتجات" },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء الحذف" },
      { status: unauthorized ? 401 : 500 }
    );
  }
}