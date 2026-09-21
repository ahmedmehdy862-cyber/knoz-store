import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "*, images:product_images(url, isPrimary), themes:product_themes(theme_id), stickers:product_stickers(sticker_id)"
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
}

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

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, formData] = await Promise.all([getProduct(id), getFormData()]);

  if (!product) notFound();

  const productImages = product.images as Array<{ url: string; isPrimary: boolean }> | null;
  const primaryImage = productImages?.find((img) => img.isPrimary)?.url || productImages?.[0]?.url || "";
  const productThemes = product.themes as Array<{ theme_id: string }> | null;
  const productStickers = product.stickers as Array<{ sticker_id: string }> | null;

  const initialData = {
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: product.price,
    oldPrice: product.oldPrice,
    sku: product.sku || "",
    categoryId: product.categoryId || "",
    stock: product.stock,
    badge: product.badge || "",
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    customizationEnabled: product.customizationEnabled,
    allowsName: product.allowsName,
    allowsTheme: product.allowsTheme,
    allowsSticker: product.allowsSticker,
    allowsImageUpload: product.allowsImageUpload,
    allowsNotes: product.allowsNotes,
    imageUrl: primaryImage,
    theme_ids: productThemes?.map((t) => t.theme_id) || [],
    sticker_ids: productStickers?.map((s) => s.sticker_id) || [],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg hover:bg-brand-secondary text-brand-text-secondary transition-colors"
        >
          <ArrowRight size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-brand-primary font-heading">
            تعديل المنتج
          </h1>
          <p className="text-sm text-brand-text-secondary mt-0.5">
            {product.name}
          </p>
        </div>
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-6">
        <ProductForm
          categories={formData.categories}
          themes={formData.themes}
          stickers={formData.stickers}
          initialData={initialData}
          mode="edit"
        />
      </div>
    </div>
  );
}
