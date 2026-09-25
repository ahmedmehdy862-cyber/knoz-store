import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_BYTES = 4 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

function hasImageMagic(bytes: Uint8Array): boolean {
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return true;
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  // GIF: 47 49 46 38 ("GIF8")
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38)
    return true;
  // WebP: "RIFF"...."WEBP"
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  )
    return true;
  return false;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const { allowed, retryAfter } = checkRateLimit(
      `upload:${getClientIp(request)}`,
      30,
      10 * 60 * 1000
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "رفع كثير في وقت قصير. حاول بعد قليل" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "الصورة يجب أن تكون PNG أو JPG أو WebP أو GIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "حجم الصورة كبير. الحد الأقصى 4MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!hasImageMagic(buffer)) {
      return NextResponse.json(
        { error: "محتوى الملف ليس صورة حقيقية" },
        { status: 400 }
      );
    }

    const url = `data:${file.type};base64,${buffer.toString("base64")}`;

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