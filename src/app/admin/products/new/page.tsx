import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

async function getFormData() {
  const [categories, themes, stickers] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.theme.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.sticker.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return { categories, themes, stickers };
}

export default async function NewProductPage() {
  const { categories, themes, stickers } = await getFormData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-primary font-heading">
          إضافة منتج جديد
        </h1>
        <p className="text-sm text-brand-text-secondary mt-1">
          أضف منتجاً جديداً إلى المتجر
        </p>
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-6">
        <ProductForm
          categories={categories}
          themes={themes}
          stickers={stickers}
          mode="create"
        />
      </div>
    </div>
  );
}
