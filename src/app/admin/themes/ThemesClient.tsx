"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string;
  previewUrl: string;
  isActive: boolean;
}

interface ThemesClientProps {
  themes: Theme[];
}

export function ThemesClient({ themes }: ThemesClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setPreviewUrl("");
    setSubmitError("");
    setShowModal(true);
  };

  const openEdit = (theme: Theme) => {
    setEditing(theme);
    setName(theme.name);
    setDescription(theme.description || "");
    setPreviewUrl(theme.previewUrl || "");
    setSubmitError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    setSubmitError("");
    try {
      const body = { name, description, previewUrl: previewUrl };
      const url = editing
        ? `/api/admin/themes/${editing.id}`
        : "/api/admin/themes";
      const method = editing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setShowModal(false);
        router.refresh();
      } else {
        const data = await response.json().catch(() => null);
        setSubmitError(data?.error || "حدث خطأ أثناء الحفظ");
      }
    } catch {
      setSubmitError("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الثيم؟")) return;

    const response = await fetch(`/api/admin/themes/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    }
  };

  const toggleStatus = async (theme: Theme) => {
    const response = await fetch(`/api/admin/themes/${theme.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !theme.isActive }),
    });

    if (response.ok) {
      router.refresh();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-brand-text-muted">
            لا توجد ثيمات
          </div>
        ) : (
          themes.map((theme: any) => (
            <div
              key={theme.id}
              className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm overflow-hidden"
            >
              {theme.previewUrl && (
                <img
                  src={theme.previewUrl}
                  alt={theme.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-brand-primary">{theme.name}</h3>
                    <p className="text-sm text-brand-text-secondary mt-0.5 line-clamp-2">
                      {theme.description || "بدون وصف"}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleStatus(theme)}
                    className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      theme.isActive
                        ? "bg-brand-success/10 text-brand-success"
                        : "bg-brand-error/10 text-brand-error"
                    }`}
                  >
                    {theme.isActive ? <Check size={12} /> : <X size={12} />}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => openEdit(theme)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-secondary text-brand-text-secondary hover:bg-brand-secondary-dark transition-colors cursor-pointer"
                  >
                    <Pencil size={12} />
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(theme.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-brand-error hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "تعديل الثيم" : "إضافة ثيم جديد"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <p className="text-sm text-brand-error">{submitError}</p>
          )}
          <Input
            label="اسم الثيم"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم الثيم"
            required
          />
          <Textarea
            label="الوصف"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف الثيم"
          />
          <ImageUpload value={previewUrl} onChange={setPreviewUrl} />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading}>
              {editing ? "حفظ" : "إضافة"}
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
