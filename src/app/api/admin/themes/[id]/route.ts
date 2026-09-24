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

    const existing = await prisma.theme.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "الثيم غير موجود" }, { status: 404 });
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
              const found = await prisma.theme.findUnique({ where: { slug: s } });
              return found !== null && found.id !== id;
            },
            name
          );

    const theme = await prisma.theme.update({
      where: { id },
      data: {
        name,
        slug,
        description:
          body.description === undefined
            ? existing.description
            : body.description || null,
        previewUrl:
          body.previewUrl === undefined
            ? existing.previewUrl
            : body.previewUrl || null,
        isActive:
          body.isActive === undefined ? existing.isActive : body.isActive !== false,
      },
    });

    return NextResponse.json(theme);
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

    const existing = await prisma.theme.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "الثيم غير موجود" }, { status: 404 });
    }

    await prisma.theme.delete({ where: { id } });
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