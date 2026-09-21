"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface ContentSection {
  key: string;
  label: string;
  fields: ContentField[];
}

interface ContentField {
  name: string;
  label: string;
  type: "text" | "textarea";
  placeholder?: string;
}

interface ContentClientProps {
  sections?: ContentSection[];
  initialData: Record<string, Record<string, unknown>>;
}

const defaultSections: ContentSection[] = [
  {
    key: "hero",
    label: "البانر الرئيسي",
    fields: [
      { name: "title", label: "العنوان", type: "text", placeholder: "عنوان البانر" },
      { name: "subtitle", label: "العنوان الفرعي", type: "text", placeholder: "عنوان فرعي" },
      { name: "cta_text", label: "نص الزر", type: "text", placeholder: "تسوق الآن" },
      { name: "cta_link", label: "رابط الزر", type: "text", placeholder: "/shop" },
    ],
  },
  {
    key: "featured_products",
    label: "المنتجات المميزة",
    fields: [
      { name: "section_title", label: "عنوان القسم", type: "text", placeholder: "منتجات مميزة" },
      { name: "section_subtitle", label: "العنوان الفرعي", type: "text", placeholder: "اكتشف منتجاتنا" },
    ],
  },
  {
    key: "promotional_banners",
    label: "البانرات الترويجية",
    fields: [
      { name: "banner_1_title", label: "عنوان البانر 1", type: "text" },
      { name: "banner_1_link", label: "رابط البانر 1", type: "text" },
      { name: "banner_2_title", label: "عنوان البانر 2", type: "text" },
      { name: "banner_2_link", label: "رابط البانر 2", type: "text" },
    ],
  },
  {
    key: "about",
    label: "من نحن",
    fields: [
      { name: "title", label: "العنوان", type: "text", placeholder: "من نحن" },
      { name: "description", label: "الوصف", type: "textarea", placeholder: "وصف المتجر" },
    ],
  },
  {
    key: "contact",
    label: "معلومات التواصل",
    fields: [
      { name: "phone", label: "الهاتف", type: "text", placeholder: "+20 123 456 789" },
      { name: "email", label: "البريد الإلكتروني", type: "text", placeholder: "info@knozstore.com" },
      { name: "whatsapp", label: "واتساب", type: "text", placeholder: "+20 123 456 789" },
      { name: "address", label: "العنوان", type: "textarea", placeholder: "عنوان المتجر" },
    ],
  },
  {
    key: "social_media",
    label: "وسائل التواصل الاجتماعي",
    fields: [
      { name: "facebook", label: "فيسبوك", type: "text", placeholder: "رابط فيسبوك" },
      { name: "instagram", label: "انستجرام", type: "text", placeholder: "رابط انستجرام" },
      { name: "tiktok", label: "تيك توك", type: "text", placeholder: "رابط تيك توك" },
      { name: "twitter", label: "تويتر/X", type: "text", placeholder: "رابط تويتر" },
    ],
  },
];

function ContentClient({ sections = defaultSections, initialData }: ContentClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Record<string, Record<string, unknown>>>(
    initialData
  );

  const handleChange = (sectionKey: string, fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldName]: value,
      },
    }));
  };

  const handleSave = async (sectionKey: string) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: sectionKey,
          value: formData[sectionKey] || {},
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div
          key={section.key}
          className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-5"
        >
          <h3 className="font-bold text-brand-primary font-heading mb-4">
            {section.label}
          </h3>

          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.name}>
                {field.type === "textarea" ? (
                  <Textarea
                    label={field.label}
                    value={String(formData[section.key]?.[field.name] || "")}
                    onChange={(e) =>
                      handleChange(section.key, field.name, e.target.value)
                    }
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input
                    label={field.label}
                    value={String(formData[section.key]?.[field.name] || "")}
                    onChange={(e) =>
                      handleChange(section.key, field.name, e.target.value)
                    }
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={() => handleSave(section.key)}
              loading={loading}
              size="sm"
            >
              حفظ
            </Button>
            {success && (
              <span className="text-sm text-brand-success font-medium">
                تم الحفظ بنجاح
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export { ContentClient };
export type { ContentSection, ContentField };
