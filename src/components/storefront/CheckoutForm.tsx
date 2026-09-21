"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { GOVERNORATES } from "@/lib/utils";
import { createOrder } from "@/services/orders";

interface FormData {
  name: string;
  phone: string;
  email: string;
  governorate: string;
  area: string;
  address: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  governorate?: string;
  area?: string;
  address?: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();
  const deliveryFee = total > 0 ? 50 : 0;

  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    governorate: "",
    area: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!form.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    else if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "رقم الهاتف غير صحيح";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "البريد الإلكتروني غير صحيح";
    if (!form.governorate) newErrors.governorate = "المحافظة مطلوبة";
    if (!form.area.trim()) newErrors.area = "المنطقة مطلوبة";
    if (!form.address.trim()) newErrors.address = "العنوان مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      if (items.length === 0) return;

      setLoading(true);
      setServerError("");

      try {
        const orderItems = items.map((item: any) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_price: item.product.price,
          quantity: item.quantity,
          customization_name: item.customization.name,
          customization_theme: item.customization.theme?.name,
          customization_sticker: item.customization.sticker?.name,
          customization_notes: item.customization.notes,
          customization_image_url: item.customization.imageUrl,
        }));

        const order = await createOrder({
          customer_name: form.name,
          phone: form.phone,
          email: form.email,
          governorate: form.governorate,
          area: form.area,
          address: form.address,
          notes: form.notes,
          items: orderItems,
          subtotal: total,
          deliveryFee: deliveryFee,
          total: total + deliveryFee,
        });

        clearCart();
        router.push(`/order-confirmation/${order.id}`);
      } catch (err) {
        setServerError("حدث خطأ أثناء إنشاء الطلب. حاول مرة تانية.");
      } finally {
        setLoading(false);
      }
    },
    [form, items, deliveryFee, validate, clearCart, router]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {serverError && (
        <div className="p-4 rounded-lg bg-brand-error/10 border border-brand-error/20 text-brand-error text-sm">
          {serverError}
        </div>
      )}

      <Input
        label="الاسم الكامل"
        placeholder="أحمد محمد"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        error={errors.name}
      />

      <Input
        label="رقم الهاتف"
        placeholder="01XXXXXXXXX"
        type="tel"
        value={form.phone}
        onChange={(e) => updateField("phone", e.target.value)}
        error={errors.phone}
      />

      <Input
        label="البريد الإلكتروني (اختياري)"
        placeholder="ahmed@example.com"
        type="email"
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        error={errors.email}
      />

      <div>
        <label className="block text-sm font-medium text-brand-text mb-1.5">
          المحافظة
        </label>
        <select
          dir="rtl"
          value={form.governorate}
          onChange={(e) => updateField("governorate", e.target.value)}
          className={`w-full px-4 py-2.5 rounded-lg border bg-white text-brand-text transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent ${
            errors.governorate
              ? "border-brand-error focus:ring-brand-error/30 focus:border-brand-error"
              : "border-brand-border hover:border-brand-primary-light"
          }`}
        >
          <option value="" disabled>
            اختر المحافظة
          </option>
          {GOVERNORATES.map((gov) => (
            <option key={gov} value={gov}>
              {gov}
            </option>
          ))}
        </select>
        {errors.governorate && (
          <p className="mt-1.5 text-sm text-brand-error">{errors.governorate}</p>
        )}
      </div>

      <Input
        label="المنطقة / المنطقة الفرعية"
        placeholder="مثال: مدينة نصر، المعادي..."
        value={form.area}
        onChange={(e) => updateField("area", e.target.value)}
        error={errors.area}
      />

      <Textarea
        label="العنوان التفصيلي"
        placeholder="الشارع، رقم المبنى، الشقة، علامة مميزة..."
        value={form.address}
        onChange={(e) => updateField("address", e.target.value)}
        error={errors.address}
        rows={3}
      />

      <Textarea
        label="ملاحظات إضافية (اختياري)"
        placeholder="أي تفاصيل إضافية عن الطلب..."
        value={form.notes}
        onChange={(e) => updateField("notes", e.target.value)}
        rows={2}
      />

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        size="lg"
      >
        تأكيد الطلب
      </Button>
    </form>
  );
}
