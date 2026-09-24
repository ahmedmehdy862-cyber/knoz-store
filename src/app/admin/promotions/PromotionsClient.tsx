"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  imageUrl: string;
  linkUrl: string;
  linkText: string;
  isActive: boolean;
  sortOrder: number;
}

interface PromotionsClientProps {
  promotions: Promotion[];
}

export function PromotionsClient({ promotions }: PromotionsClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("/shop");
  const [linkText, setLinkText] = useState("تسوق الآن");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const openCreate = () => {
    setEditing(null);
    setTitle("");
    setSubtitle("");
    setDescription("");
    setBadge("");
    setImageUrl("");
    setLinkUrl("/shop");
    setLinkText("تسوق الآن");
    setSortOrder("0");
    setIsActive(true);
    setSubmitError("");
    setShowModal(true);
  };

  const openEdit = (promo: Promotion) => {
    setEditing(promo);
    setTitle(promo.title);
    setSubtitle(promo.subtitle || "");
    setDescription(promo.description || "");
    setBadge(promo.badge || "");
    setImageUrl(promo.imageUrl || "");
    setLinkUrl(promo.linkUrl || "/shop");
    setLinkText(promo.linkText || "تسوق الآن");
    setSortOrder(String(promo.sortOrder ?? 0));
    setIsActive(promo.isActive);
    setSubmitError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setSubmitError("");
    try {
      const body = {
        title: title.trim(),
        subtitle,
        description,
        badge,
        imageUrl,
        linkUrl,
        linkText,
        sortOrder: parseInt(sortOrder) || 0,
        isActive,
      };
      const url = editing
        ? `/api/admin/promotions/${editing.id}`
        : "/api/admin/promotions";
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
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;

    const response = await fetch(`/api/admin/promotions/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    } else {
      const data = await response.json().catch(() => null);
      alert(data?.error || "تعذر حذف العرض");
    }
  };

  const toggleStatus = async (promo: Promotion) => {
    const response = await fetch(`/api/admin/promotions/${promo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !promo.isActive }),
    });

    if (response.ok) {
      router.refresh();
    }
  };

  return (
    <>
      <div className="flex justify-start">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-brand-accent text-white hover:bg-brand-accent-dark transition-colors cursor-pointer"
        >
          <Plus size={16} />
          إضافة عرض
        </button>
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border-light">
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  العرض
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الشارة
                </th>
                <th className="px-5 py-3 text-right font-semibold text-brand-text-secondary">
                  الترتيب
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
              {promotions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-brand-text-muted"
                  >
                    لا توجد عروض بعد — أضف أول عرض
                  </td>
                </tr>
              ) : (
                promotions.map((promo) => (
                  <tr
                    key={promo.id}
                    className="border-b border-brand-border-light/50 hover:bg-brand-surface-hover transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {promo.imageUrl ? (
                          <img
                            src={promo.imageUrl}
                            alt={promo.title}
                            className="w-12 h-12 rounded-lg object-cover border border-brand-border-light shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-brand-secondary flex items-center justify-center text-brand-text-muted text-xs shrink-0">
                            —
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-brand-text">{promo.title}</p>
                          {promo.subtitle && (
                            <p className="text-xs text-brand-text-muted">{promo.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-brand-text-secondary">
                      {promo.badge || "—"}
                    </td>
                    <td className="px-5 py-3 text-brand-text-secondary">
                      {promo.sortOrder}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleStatus(promo)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                          promo.isActive
                            ? "bg-brand-success/10 text-brand-success"
                            : "bg-brand-error/10 text-brand-error"
                        }`}
                      >
                        {promo.isActive ? "مفعّل" : "معطّل"}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(promo)}
                          className="p-1.5 rounded-lg hover:bg-brand-secondary text-brand-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
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
        title={editing ? "تعديل العرض" : "إضافة عرض جديد"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <p className="text-sm text-brand-error">{submitError}</p>
          )}
          <Input
            label="عنوان العرض *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="خصم 20% على المجات"
            required
          />
          <Input
            label="العنوان الفرعي"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="لفترة محدودة"
          />
          <Textarea
            label="الوصف"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="تفاصيل العرض"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="الشارة"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="خصم 20%"
            />
            <Input
              label="الترتيب"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              min="0"
            />
          </div>
          <ImageUpload value={imageUrl} onChange={setImageUrl} />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="رابط الزر"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/shop"
              dir="ltr"
            />
            <Input
              label="نص الزر"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="تسوق الآن"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30"
            />
            <span className="text-sm text-brand-text">مفعّل (يظهر في الموقع)</span>
          </label>
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