import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ar-EG")} جنيه`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateOrderNumber(id: number): string {
  return `KZ-${String(id).padStart(4, "0")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const ORDER_STATUSES = [
  { value: "new", label: "جديد", color: "bg-blue-100 text-blue-700" },
  { value: "reviewing", label: "قيد المراجعة", color: "bg-yellow-100 text-yellow-700" },
  { value: "preparing", label: "قيد التجهيز", color: "bg-orange-100 text-orange-700" },
  { value: "ready_to_ship", label: "جاهز للشحن", color: "bg-purple-100 text-purple-700" },
  { value: "shipped", label: "تم الشحن", color: "bg-indigo-100 text-indigo-700" },
  { value: "delivered", label: "تم التسليم", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "ملغي", color: "bg-red-100 text-red-700" },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export function getOrderStatusInfo(status: OrderStatus) {
  return ORDER_STATUSES.find((s) => s.value === status) || ORDER_STATUSES[0];
}

export const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "القليوبية",
  "الشرقية",
  "الدقهلية",
  "البحيرة",
  "كفر الشيخ",
  "الغربية",
  "المنوفية",
  "بني سويف",
  "الفيوم",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "الوادي الجديد",
  "مطروح",
  "شمال سيناء",
  "جنوب سيناء",
] as const;
