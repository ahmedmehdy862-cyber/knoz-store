"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  getDiscountPercent,
  oldPriceFromDiscount,
} from "@/lib/discount";

interface Category {
  id: string;
  name: string;
}

interface Theme {
  id: string;
  name: string;
}

interface Sticker {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  themes: Theme[];
  stickers: Sticker[];
  initialData?: {
    id?: string;
    name: string;
    description: string;
    price: number;
    oldPrice: number | null;
    sku: string;
    categoryId: string;
    stock: number;
    badge: string;
    isActive: boolean;
    isFeatured: boolean;
    customizationEnabled: boolean;
    allowsName: boolean;
    allowsTheme: boolean;
    allowsSticker: boolean;
    allowsImageUpload: boolean;
    allowsNotes: boolean;
    imageUrl: string;
    theme_ids: string[];
    sticker_ids: string[];
  };
  mode: "create" | "edit";
}

export function ProductForm({
  categories,
  themes,
  stickers,
  initialData,
  mode,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [oldPrice, setOldPrice] = useState(initialData?.oldPrice?.toString() || "");
  const [discountPercent, setDiscountPercent] = useState(
    initialData?.oldPrice && initialData?.price
      ? String(getDiscountPercent(initialData.price, initialData.oldPrice) || "")
      : ""
  );
  const [sku, setSku] = useState(initialData?.sku || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "0");
  const [badge, setBadge] = useState(initialData?.badge || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>(
    initialData?.theme_ids || []
  );
  const [selectedStickerIds, setSelectedStickerIds] = useState<string[]>(
    initialData?.sticker_ids || []
  );

  const [customizationEnabled, setCustomizationEnabled] = useState(
    initialData?.customizationEnabled ?? false
  );
  const [allowsName, setAllowsName] = useState(initialData?.allowsName ?? false);
  const [allowsTheme, setAllowsTheme] = useState(initialData?.allowsTheme ?? false);
  const [allowsSticker, setAllowsSticker] = useState(initialData?.allowsSticker ?? false);
  const [allowsImageUpload, setAllowsImageUpload] = useState(
    initialData?.allowsImageUpload ?? false
  );
  const [allowsNotes, setAllowsNotes] = useState(initialData?.allowsNotes ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !price || !categoryId) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);

    try {
      const body = {
        name,
        description,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        sku,
        categoryId: categoryId,
        stock: parseInt(stock) || 0,
        badge: badge || null,
        isActive: isActive,
        isFeatured: isFeatured,
        customizationEnabled: customizationEnabled,
        allowsName: allowsName,
        allowsTheme: allowsTheme,
        allowsSticker: allowsSticker,
        allowsImageUpload: allowsImageUpload,
        allowsNotes: allowsNotes,
        imageUrl: imageUrl,
        theme_ids: selectedThemeIds,
        sticker_ids: selectedStickerIds,
      };

      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${initialData?.id}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "حدث خطأ");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));
  const badgeOptions = [
    { value: "", label: "بدون شارة" },
    { value: "جديد", label: "جديد" },
    { value: "مميز", label: "مميز" },
    { value: "الأكثر مبيعًا", label: "الأكثر مبيعًا" },
    { value: "محدود", label: "محدود" },
  ];

  const toggleTheme = (id: string) => {
    setSelectedThemeIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleSticker = (id: string) => {
    setSelectedStickerIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-brand-error/10 border border-brand-error/20 text-brand-error text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label="اسم المنتج *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المنتج"
            required
          />

          <Textarea
            label="الوصف"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف المنتج"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="السعر *"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            <Input
              label="السعر القديم"
              type="number"
              value={oldPrice}
              onChange={(e) => {
                setOldPrice(e.target.value);
                setDiscountPercent("");
              }}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Input
              label="نسبة الخصم % (يملأ السعر القديم تلقائياً)"
              type="number"
              value={discountPercent}
              onChange={(e) => {
                const v = e.target.value;
                setDiscountPercent(v);
                const p = parseFloat(price);
                const d = parseFloat(v);
                if (Number.isFinite(p) && p > 0 && Number.isFinite(d) && d > 0 && d < 100) {
                  setOldPrice(String(oldPriceFromDiscount(p, d)));
                } else if (!v) {
                  setOldPrice("");
                }
              }}
              placeholder="مثال: 20"
              min="0"
              max="99"
            />
            {(() => {
              const pct = getDiscountPercent(
                parseFloat(price) || 0,
                parseFloat(oldPrice) || null
              );
              return pct > 0 ? (
                <p className="mt-1.5 text-xs font-medium text-brand-success">
                  خصم {pct}% — سيظهر السعر القديم مشطوباً بجانب السعر
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-brand-text-muted">
                  اترك السعر القديم فارغاً لبيع المنتج بدون خصم
                </p>
              );
            })()}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="KZ-001"
            />
            <Input
              label="المخزون"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
            />
          </div>

          <Select
            label="التصنيف *"
            options={categoryOptions}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="اختر تصنيفاً"
          />

          <Select
            label="الشارة"
            options={badgeOptions}
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <ImageUpload value={imageUrl} onChange={setImageUrl} />

          <div className="bg-brand-surface rounded-lg border border-brand-border-light p-4">
            <h3 className="text-sm font-bold text-brand-primary mb-3">
              الإعدادات
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30"
                />
                <span className="text-sm text-brand-text">متاح للبيع</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30"
                />
                <span className="text-sm text-brand-text">منتج مميز</span>
              </label>
            </div>
          </div>

          <div className="bg-brand-surface rounded-lg border border-brand-border-light p-4">
            <h3 className="text-sm font-bold text-brand-primary mb-3">
              إعدادات التخصيص
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customizationEnabled}
                  onChange={(e) => setCustomizationEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30"
                />
                <span className="text-sm text-brand-text">تفعيل التخصيص</span>
              </label>
              {customizationEnabled && (
                <>
                  <label className="flex items-center gap-2 cursor-pointer pr-4">
                    <input
                      type="checkbox"
                      checked={allowsName}
                      onChange={(e) => setAllowsName(e.target.checked)}
                      className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30"
                    />
                    <span className="text-sm text-brand-text">السماح بالاسم</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer pr-4">
                    <input
                      type="checkbox"
                      checked={allowsTheme}
                      onChange={(e) => setAllowsTheme(e.target.checked)}
                      className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30"
                    />
                    <span className="text-sm text-brand-text">السماح بالثيم</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer pr-4">
                    <input
                      type="checkbox"
                      checked={allowsSticker}
                      onChange={(e) => setAllowsSticker(e.target.checked)}
                      className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30"
                    />
                    <span className="text-sm text-brand-text">السماح بالاستيكر</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer pr-4">
                    <input
                      type="checkbox"
                      checked={allowsImageUpload}
                      onChange={(e) => setAllowsImageUpload(e.target.checked)}
                      className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30"
                    />
                    <span className="text-sm text-brand-text">السماح برفع الصور</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer pr-4">
                    <input
                      type="checkbox"
                      checked={allowsNotes}
                      onChange={(e) => setAllowsNotes(e.target.checked)}
                      className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30"
                    />
                    <span className="text-sm text-brand-text">السماح بالملاحظات</span>
                  </label>
                </>
              )}
            </div>
          </div>

          {allowsTheme && themes.length > 0 && (
            <div className="bg-brand-surface rounded-lg border border-brand-border-light p-4">
              <h3 className="text-sm font-bold text-brand-primary mb-3">
                الثيمات المتاحة
              </h3>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme: any) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => toggleTheme(theme.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedThemeIds.includes(theme.id)
                        ? "bg-brand-accent text-white"
                        : "bg-brand-secondary text-brand-text-secondary hover:bg-brand-secondary-dark"
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {allowsSticker && stickers.length > 0 && (
            <div className="bg-brand-surface rounded-lg border border-brand-border-light p-4">
              <h3 className="text-sm font-bold text-brand-primary mb-3">
                الاستيكرز المتاحة
              </h3>
              <div className="flex flex-wrap gap-2">
                {stickers.map((sticker: any) => (
                  <button
                    key={sticker.id}
                    type="button"
                    onClick={() => toggleSticker(sticker.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedStickerIds.includes(sticker.id)
                        ? "bg-brand-accent text-white"
                        : "bg-brand-secondary text-brand-text-secondary hover:bg-brand-secondary-dark"
                    }`}
                  >
                    {sticker.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-brand-border-light">
        <Button type="submit" loading={loading}>
          {mode === "create" ? "إضافة المنتج" : "حفظ التغييرات"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
