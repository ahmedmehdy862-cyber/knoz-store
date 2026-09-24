import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "الملف يجب أن يكون صورة" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "حجم الصورة كبير. الحد الأقصى 4MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const url = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "غير مصرح" : "حدث خطأ أثناء رفع الصورة" },
      { status: unauthorized ? 401 : 500 }
    );
  }
}