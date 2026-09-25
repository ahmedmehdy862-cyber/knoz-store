import { NextResponse } from "next/server";
import { createOrder } from "@/services/orders";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function bad(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const { allowed, retryAfter } = checkRateLimit(
      `order:${getClientIp(request)}`,
      10,
      10 * 60 * 1000
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "طلبات كثيرة في وقت قصير. حاول بعد قليل" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const body = await request.json();

    const name = typeof body.customer_name === "string" ? body.customer_name.trim() : "";
    if (!name) return bad("الاسم مطلوب");

    const phone = typeof body.phone === "string" ? body.phone.replace(/[\s-]/g, "") : "";
    if (!/^[0-9]{10,11}$/.test(phone)) return bad("رقم الهاتف غير صحيح");

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return bad("السلة فارغة");
    }
    for (const item of body.items) {
      if (!item || typeof item.product_name !== "string" || !item.product_name) {
        return bad("بيانات منتج غير صحيحة");
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return bad("الكمية غير صحيحة");
      }
      if (!Number.isFinite(Number(item.product_price)) || Number(item.product_price) < 0) {
        return bad("سعر المنتج غير صحيح");
      }
    }

    for (const field of ["subtotal", "deliveryFee", "total"] as const) {
      const value = Number(body[field]);
      if (!Number.isFinite(value) || value < 0) return bad("إجمالي الطلب غير صحيح");
    }

    const order = await createOrder({ ...body, phone });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الطلب" },
      { status: 500 }
    );
  }
}