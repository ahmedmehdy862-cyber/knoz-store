import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { upsertSetting } from "@/services/site-content";

export async function PUT(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { key, value } = body || {};

    if (!key || typeof key !== "string" || !value || typeof value !== "object") {
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
    }

    await upsertSetting(key, value);
    return NextResponse.json({ success: true });
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء الحفظ" },
      { status: unauthorized ? 401 : 500 }
    );
  }
}