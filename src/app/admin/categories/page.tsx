import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { CategoriesClient } from "./CategoriesClient";

async function getCategories() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("sortOrder", { ascending: true });

  if (error) throw error;

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  return categories || [];
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
