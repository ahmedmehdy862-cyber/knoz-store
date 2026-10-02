import { NextResponse } from "next/server";
import { getDeliverySettings } from "@/services/orders";

export async function GET() {
  const settings = await getDeliverySettings();
  return NextResponse.json(settings);
}