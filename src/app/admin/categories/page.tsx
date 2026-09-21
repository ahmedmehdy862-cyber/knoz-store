import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { CategoriesClient } from "./CategoriesClient";

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return categories.map((c) => ({
    ...c,
    description: c.description ?? "",
    imageUrl: c.imageUrl ?? "",
  }));
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-primary font-heading">
            إدارة التصنيفات
          </h1>
          <p className="text-sm text-brand-text-secondary mt-1">
            {categories.length} تصنيف إجمالي
          </p>
        </div>
      </div>

      <CategoriesClient categories={categories} />
    </div>
  );
}
