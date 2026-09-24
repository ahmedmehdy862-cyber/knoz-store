import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
    }

    const slug = await uniqueSlug(
      async (s) => (await prisma.category.findUnique({ where: { slug: s } })) !== null,
      name
    );

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description:
          typeof body.description === "string" && body.description
            ? body.description
            : null,
        imageUrl:
          typeof body.imageUrl === "string" && body.imageUrl
            ? body.imageUrl
            : null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء الإضافة" },
      { status: unauthorized ? 401 : 500 }
    );
  }
}