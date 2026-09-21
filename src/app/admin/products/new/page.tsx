import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

async function getFormData() {
  const supabase = await createClient();

  const [categoriesResult, themesResult, stickersResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name")
      .eq("isActive", true)
      .order("sortOrder"),
    supabase
      .from("themes")
      .select("id, name")
      .eq("isActive", true)
      .order("sortOrder"),
    supabase
      .from("stickers")
      .select("id, name")
      .eq("isActive", true)
      .order("sortOrder"),
  ]);

  return {
    categories: categoriesResult.data || [],
    themes: themesResult.data || [],
    stickers: stickersResult.data || [],
  };
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
