import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeleteProductButton } from "./DeleteProductButton";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getProducts(search?: string, page: number = 1) {
  const supabase = await createClient();
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("products")
    .select("*, category:categories(name), images:product_images(url, isPrimary)", {
      count: "exact",
    });

  if (search) {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    products: data || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    page,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  const { products, total, totalPages, page: currentPage } = await getProducts(search, page);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-primary font-heading">
            إدارة المنتجات
          </h1>
          <p className="text-sm text-brand-text-secondary mt-1">
            {total} منتج إجمالي
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-brand-accent text-white hover:bg-brand-accent-dark transition-colors"
        >
          <Plus size={16} />
          إضافة منتج
        </Link>
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border-light">
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الصورة
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الاسم
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  التصنيف
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  السعر
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  المخزون
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الحالة
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  مميز
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-brand-text-muted"
                  >
                    لا توجد منتجات
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const images = product.images as Array<{ url: string; isPrimary: boolean }> | null;
                  const primaryImage = images?.find((img) => img.isPrimary)?.url || images?.[0]?.url;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-brand-border-light/50 hover:bg-brand-surface-hover transition-colors"
                    >
                      <td className="px-5 py-3">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-brand-border-light"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-brand-secondary flex items-center justify-center text-brand-text-muted text-xs">
                            —
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-brand-text">{product.name}</p>
                        <p className="text-xs text-brand-text-muted">{product.sku}</p>
                      </td>
                      <td className="px-5 py-3 text-brand-text-secondary">
                        {(product.category as { name: string } | null)?.name || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-brand-text">
                          {formatPrice(Number(product.price))}
                        </p>
                        {product.oldPrice && (
                          <p className="text-xs text-brand-text-muted line-through">
                            {formatPrice(Number(product.oldPrice))}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`font-medium ${
                            product.stock > 0 ? "text-brand-success" : "text-brand-error"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            product.isActive
                              ? "bg-brand-success/10 text-brand-success"
                              : "bg-brand-error/10 text-brand-error"
                          }`}
                        >
                          {product.isActive ? "متاح" : "غير متاح"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {product.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-accent/10 text-brand-accent">
                            مميز
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 rounded-lg hover:bg-brand-secondary text-brand-text-secondary hover:text-brand-primary transition-colors"
                          >
                            <Pencil size={16} />
                          </Link>
                          <DeleteProductButton productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-brand-border-light flex items-center justify-between">
            <p className="text-sm text-brand-text-secondary">
              صفحة {currentPage} من {totalPages}
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/admin/products?page=${currentPage - 1}`}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-secondary text-brand-primary hover:bg-brand-secondary-dark transition-colors"
                >
                  السابق
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/admin/products?page=${currentPage + 1}`}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-secondary text-brand-primary hover:bg-brand-secondary-dark transition-colors"
                >
                  التالي
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
