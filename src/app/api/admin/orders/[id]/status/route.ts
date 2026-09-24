import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES } from "@/lib/utils";

const ALLOWED = new Set(ORDER_STATUSES.map((s) => s.value));

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const status = typeof body.status === "string" ? body.status : "";
    if (!ALLOWED.has(status as (typeof ORDER_STATUSES)[number]["value"])) {
      return NextResponse.json({ error: "الحالة غير صحيحة" }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    const order = await prisma.order.update({ where: { id }, data: { status } });
    return NextResponse.json(order);
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء تحديث الطلب" },
      { status: unauthorized ? 401 : 500 }
    );
  }
}