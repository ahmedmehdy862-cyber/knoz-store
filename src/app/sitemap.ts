import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://knozstore.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const { data: products } = await supabase
    .from("products")
    .select("slug, updatedAt")
    .eq("isActive", true);

  const { data: categories } = await supabase
    .from("categories")
    .select("slug, createdAt")
    .eq("isActive", true);

  const productPages: MetadataRoute.Sitemap =
    products?.map((product) => ({
      url: `${BASE_URL}/shop/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    })) ?? [];

  const categoryPages: MetadataRoute.Sitemap =
    categories?.map((category) => ({
      url: `${BASE_URL}/shop?category=${category.slug}`,
      lastModified: new Date(category.createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
    })) ?? [];

  return [...staticPages, ...productPages, ...categoryPages];
}
