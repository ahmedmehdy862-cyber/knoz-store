"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  products_count?: number;
}

interface CategoriesPageProps {
  categories: Category[];
}

export function CategoriesClient({ categories }: CategoriesPageProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const openCreate = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImageUrl("");
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setImageUrl(cat.imageUrl || "");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      const body = { name, description, imageUrl: imageUrl };
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setShowModal(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التصنيف؟")) return;

    const response = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    }
  };

  const toggleStatus = async (cat: Category) => {
    const response = await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !cat.isActive }),
    });

    if (response.ok) {
      router.refresh();
    }
  };

  return (
    <>
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
                  الرابط
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  المنتجات
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الحالة
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-brand-text-muted"
                  >
                    لا توجد تصنيفات
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-brand-border-light/50 hover:bg-brand-surface-hover transition-colors"
                  >
                    <td className="px-5 py-3">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-10 h-10 rounded-lg object-cover border border-brand-border-light"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-brand-secondary flex items-center justify-center text-brand-text-muted text-xs">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-brand-text">
                      {cat.name}
                    </td>
                    <td className="px-5 py-3 text-brand-text-secondary text-xs">
                      {cat.slug}
                    </td>
                    <td className="px-5 py-3 text-brand-text-secondary">
                      {cat.products_count || 0}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleStatus(cat)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          cat.isActive
                            ? "bg-brand-success/10 text-brand-success hover:bg-brand-success/20"
                            : "bg-brand-error/10 text-brand-error hover:bg-brand-error/20"
                        }`}
                      >
                        {cat.isActive ? (
                          <>
                            <Check size={12} /> نشط
                          </>
                        ) : (
                          <>
                            <X size={12} /> غير نشط
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-1.5 rounded-lg hover:bg-brand-secondary text-brand-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-brand-text-secondary hover:text-brand-error transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="اسم التصنيف"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم التصنيف"
            required
          />
          <Textarea
            label="الوصف"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف التصنيف"
          />
          <ImageUpload value={imageUrl} onChange={setImageUrl} />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading}>
              {editingCategory ? "حفظ" : "إضافة"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowModal(false)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
