import { prisma } from "@/lib/prisma";
import { PromotionsClient } from "./PromotionsClient";

async function getPromotions() {
  const promotions = await prisma.promotion.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return promotions.map((p) => ({
    ...p,
    subtitle: p.subtitle ?? "",
    description: p.description ?? "",
    badge: p.badge ?? "",
    imageUrl: p.imageUrl ?? "",
    linkUrl: p.linkUrl ?? "",
    linkText: p.linkText ?? "",
  }));
}

export default async function PromotionsPage() {
  const promotions = await getPromotions();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-primary font-heading">
          إدارة العروض
        </h1>
        <p className="text-sm text-brand-text-secondary mt-1">
          {promotions.length} عرض إجمالي — تظهر العروض المفعّلة في الصفحة الرئيسية
        </p>
      </div>

      <PromotionsClient promotions={promotions} />
    </div>
  );
}