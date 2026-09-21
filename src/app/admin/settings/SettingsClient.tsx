"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SettingsClientProps {
  initialData: Record<string, Record<string, unknown>>;
}

const defaultSettings: Record<string, Record<string, unknown>> = {
  store: {
    name: "Knoz Store",
    name_ar: "كنوز ستور",
    description: "منتجات مخصصة، مجات، استيكرز، ثيمات، هدايا بطابع شخصي",
    phone: "",
    email: "",
    whatsapp: "",
  },
  delivery: {
    free_delivery_threshold: 500,
    default_deliveryFee: 50,
    delivery_time: "2-5 أيام عمل",
  },
  currency: {
    code: "EGP",
    symbol: "جنيه",
    name: "الجنيه المصري",
  },
  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
    twitter: "",
  },
};

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

export { SettingsClient };
