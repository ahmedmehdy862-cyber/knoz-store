import { prisma } from "@/lib/prisma";
import { StickersClient } from "./StickersClient";

async function getStickers() {
  const stickers = await prisma.sticker.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return stickers.map((s) => ({
    ...s,
    description: s.description ?? "",
    previewUrl: s.previewUrl ?? "",
  }));
}

export default async function StickersPage() {
  const stickers = await getStickers();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-primary font-heading">
          إدارة الاستيكرز
        </h1>
        <p className="text-sm text-brand-text-secondary mt-1">
          {stickers.length} استيكر إجمالي
        </p>
      </div>

      <StickersClient stickers={stickers} />
    </div>
  );
}
