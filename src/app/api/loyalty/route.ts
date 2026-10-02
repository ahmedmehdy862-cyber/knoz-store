import { NextResponse } from "next/server";
import { getCustomerLoyalty } from "@/services/loyalty";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = (searchParams.get("phone") || "").replace(/[\s-]/g, "");
  if (!/^[0-9]{10,11}$/.test(phone)) {
    return NextResponse.json({ totalSpent: 0, percent: 0 });
  }
  const loyalty = await getCustomerLoyalty(phone);
  return NextResponse.json(loyalty);
}