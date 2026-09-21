"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SETTINGS_DEFAULTS as defaultSettings } from "@/lib/site-content";
import { FONT_OPTIONS } from "@/lib/fonts";

interface SettingsClientProps {
  initialData: Record<string, Record<string, unknown>>;
}

function SettingsClient({ initialData }: SettingsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<Record<string, Record<string, unknown>>>(
    Object.keys(defaultSettings).reduce((acc, key) => {
      acc[key] = { ...defaultSettings[key], ...(initialData[key] || {}) };
      return acc;
    }, {} as Record<string, Record<string, unknown>>)
  );

  const handleChange = (section: string, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      for (const [key, value] of Object.entries(formData)) {
        await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-5">
        <h3 className="font-bold text-brand-primary font-heading mb-4">
          معلومات المتجر
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="اسم المتجر (إنجليزي)"
            value={String(formData.store?.name || "")}
            onChange={(e) => handleChange("store", "name", e.target.value)}
          />
          <Input
            label="اسم المتجر (عربي)"
            value={String(formData.store?.name_ar || "")}
            onChange={(e) => handleChange("store", "name_ar", e.target.value)}
          />
          <Input
            label="الهاتف"
            value={String(formData.store?.phone || "")}
            onChange={(e) => handleChange("store", "phone", e.target.value)}
            dir="ltr"
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={String(formData.store?.email || "")}
            onChange={(e) => handleChange("store", "email", e.target.value)}
          />
          <Input
            label="واتساب"
            value={String(formData.store?.whatsapp || "")}
            onChange={(e) => handleChange("store", "whatsapp", e.target.value)}
            dir="ltr"
          />
        </div>
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-5">
        <h3 className="font-bold text-brand-primary font-heading mb-4">
          إعدادات التوصيل
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="حد التوصيل المجاني (جنيه)"
            type="number"
            value={String(formData.delivery?.free_delivery_threshold || "")}
            onChange={(e) =>
              handleChange("delivery", "free_delivery_threshold", Number(e.target.value))
            }
          />
          <Input
            label="رسوم التوصيل الافتراضية (جنيه)"
            type="number"
            value={String(formData.delivery?.default_deliveryFee || "")}
            onChange={(e) =>
              handleChange("delivery", "default_deliveryFee", Number(e.target.value))
            }
          />
          <Input
            label="مدة التوصيل"
            value={String(formData.delivery?.delivery_time || "")}
            onChange={(e) => handleChange("delivery", "delivery_time", e.target.value)}
          />
        </div>
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-5">
        <h3 className="font-bold text-brand-primary font-heading mb-4">
          العملة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="رمز العملة"
            value={String(formData.currency?.code || "")}
            onChange={(e) => handleChange("currency", "code", e.target.value)}
          />
          <Input
            label="رمز العملة (الرمز)"
            value={String(formData.currency?.symbol || "")}
            onChange={(e) => handleChange("currency", "symbol", e.target.value)}
          />
          <Input
            label="اسم العملة"
            value={String(formData.currency?.name || "")}
            onChange={(e) => handleChange("currency", "name", e.target.value)}
          />
        </div>
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-5">
        <h3 className="font-bold text-brand-primary font-heading mb-4">
          وسائل التواصل الاجتماعي
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="فيسبوك"
            value={String(formData.social?.facebook || "")}
            onChange={(e) => handleChange("social", "facebook", e.target.value)}
            placeholder="https://facebook.com/..."
            dir="ltr"
          />
          <Input
            label="انستجرام"
            value={String(formData.social?.instagram || "")}
            onChange={(e) => handleChange("social", "instagram", e.target.value)}
            placeholder="https://instagram.com/..."
            dir="ltr"
          />
          <Input
            label="تيك توك"
            value={String(formData.social?.tiktok || "")}
            onChange={(e) => handleChange("social", "tiktok", e.target.value)}
            placeholder="https://tiktok.com/..."
            dir="ltr"
          />
          <Input
            label="تويتر/X"
            value={String(formData.social?.twitter || "")}
            onChange={(e) => handleChange("social", "twitter", e.target.value)}
            placeholder="https://x.com/..."
            dir="ltr"
          />
        </div>
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-5">
        <h3 className="font-bold text-brand-primary font-heading mb-1">
          خطوط الموقع
        </h3>
        <p className="text-sm text-brand-text-secondary mb-4">
          اختر الخط المستخدم في العناوين ونص الموقع
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">
              خط العناوين
            </label>
            <select
              value={String(formData.fonts?.heading || "")}
              onChange={(e) => handleChange("fonts", "heading", e.target.value)}
              className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))}
            </select>
            <p
              className="mt-2 text-lg font-bold text-brand-primary"
              style={{
                fontFamily: `'${getSelectedFont(
                  String(formData.fonts?.heading || "")
                ).family}', sans-serif`,
              }}
            >
              عنوان تجريبي
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">
              خط النص
            </label>
            <select
              value={String(formData.fonts?.body || "")}
              onChange={(e) => handleChange("fonts", "body", e.target.value)}
              className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))}
            </select>
            <p
              className="mt-2 text-sm text-brand-text-secondary"
              style={{
                fontFamily: `'${getSelectedFont(
                  String(formData.fonts?.body || "")
                ).family}', sans-serif`,
              }}
            >
              نص تجريبي للخط: كنوز ستور - منتجات مخصصة بطابع شخصي.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} loading={loading}>
          حفظ جميع الإعدادات
        </Button>
        {success && (
          <span className="text-sm text-brand-success font-medium">
            تم الحفظ بنجاح
          </span>
        )}
      </div>
    </div>
  );
}

function getSelectedFont(id: string) {
  return FONT_OPTIONS.find((f) => f.id === id) || FONT_OPTIONS[0];
}

export { SettingsClient };
