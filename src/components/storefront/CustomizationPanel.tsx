"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Product, Theme, Sticker, ProductCustomization } from "@/types";

interface CustomizationPanelProps {
  product: Product;
  customization: ProductCustomization;
  onChange: (customization: ProductCustomization) => void;
  className?: string;
}

export function CustomizationPanel({
  product,
  customization,
  onChange,
  className,
}: CustomizationPanelProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(
    customization.theme?.id || ""
  );
  const [selectedStickerId, setSelectedStickerId] = useState<string>(
    customization.sticker?.id || ""
  );

  const themes = product.themes || [];
  const stickers = product.stickers || [];

  const handleNameChange = (value: string) => {
    onChange({ ...customization, name: value || undefined });
  };

  const handleThemeSelect = (theme: Theme) => {
    if (selectedThemeId === theme.id) {
      setSelectedThemeId("");
      onChange({ ...customization, theme: undefined });
    } else {
      setSelectedThemeId(theme.id);
      onChange({ ...customization, theme });
    }
  };

  const handleStickerSelect = (sticker: Sticker) => {
    if (selectedStickerId === sticker.id) {
      setSelectedStickerId("");
      onChange({ ...customization, sticker: undefined });
    } else {
      setSelectedStickerId(sticker.id);
      onChange({ ...customization, sticker });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ ...customization, imageUrl: url });
    }
  };

  const handleNotesChange = (value: string) => {
    onChange({ ...customization, notes: value || undefined });
  };

  const hasAnyOption =
    product.allowsName ||
    product.allowsTheme ||
    product.allowsSticker ||
    product.allowsImageUpload ||
    product.allowsNotes;

  if (!hasAnyOption) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-brand-border-light bg-brand-surface p-5 shadow-sm",
        className
      )}
    >
      <h3 className="text-lg font-bold text-brand-primary font-heading mb-5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
        تخصيص المنتج
      </h3>

      <div className="space-y-6">
        {/* Name Input */}
        {product.allowsName && (
          <Input
            label="اسم على المنتج"
            placeholder="مثال: أحمد، يا قمر..."
            value={customization.name || ""}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        )}

        {/* Theme Selector */}
        {product.allowsTheme && themes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              اختر الثيم
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {themes.map((theme: any) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all cursor-pointer",
                    selectedThemeId === theme.id
                      ? "border-brand-accent bg-brand-accent/5 shadow-sm"
                      : "border-brand-border-light hover:border-brand-border"
                  )}
                >
                  <div className="relative w-full aspect-square rounded-md overflow-hidden bg-brand-secondary-light">
                    <Image
                      src={theme.previewUrl}
                      alt={theme.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs text-brand-text text-center leading-tight">
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sticker Selector */}
        {product.allowsSticker && stickers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              اختر الاستيكر
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {stickers.map((sticker: any) => (
                <button
                  key={sticker.id}
                  onClick={() => handleStickerSelect(sticker)}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all cursor-pointer",
                    selectedStickerId === sticker.id
                      ? "border-brand-accent bg-brand-accent/5 shadow-sm"
                      : "border-brand-border-light hover:border-brand-border"
                  )}
                >
                  <div className="relative w-full aspect-square rounded-md overflow-hidden bg-brand-secondary-light">
                    <Image
                      src={sticker.previewUrl}
                      alt={sticker.name}
                      fill
                      sizes="60px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-brand-text-muted text-center leading-tight">
                    {sticker.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image Upload */}
        {product.allowsImageUpload && (
          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              ارفع صورة
            </label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-24 h-24 rounded-lg border-2 border-dashed border-brand-border hover:border-brand-accent bg-brand-secondary/20 transition-colors cursor-pointer">
                {customization.imageUrl ? (
                  <div className="relative w-full h-full rounded-md overflow-hidden">
                    <Image
                      src={customization.imageUrl}
                      alt="صورة مرفوعة"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-text-muted">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    <span className="text-[10px] text-brand-text-muted mt-1">ارفع صورة</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
              {customization.imageUrl && (
                <button
                  onClick={() => onChange({ ...customization, imageUrl: undefined })}
                  className="text-xs text-brand-error hover:underline cursor-pointer"
                >
                  حذف الصورة
                </button>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {product.allowsNotes && (
          <Textarea
            label="ملاحظات إضافية"
            placeholder=" أي تفاصيل تانية عايز تضيفها..."
            value={customization.notes || ""}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={3}
          />
        )}
      </div>
    </div>
  );
}
