import { NextResponse } from "next/server";
import { loginUser, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const { allowed, retryAfter } = checkRateLimit(
      `login:${getClientIp(request)}`,
      8,
      10 * 60 * 1000
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "محاولات كثيرة. حاول بعد دقيقة" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "يرجى ملء جميع الحقول" },
        { status: 400 }
      );
    }

    const user = await loginUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const token = generateToken(user);
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
