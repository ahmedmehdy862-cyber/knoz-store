"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary mx-auto flex items-center justify-center text-white text-2xl font-bold font-heading mb-4">
            K
          </div>
          <h1 className="text-2xl font-bold text-brand-primary font-heading">
            Knoz Store
          </h1>
          <p className="text-brand-text-secondary mt-1">لوحة التحكم</p>
        </div>

        <div className="bg-brand-surface rounded-xl border border-brand-border-light shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-primary font-heading mb-6">
            تسجيل الدخول
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-brand-error/10 border border-brand-error/20 text-brand-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="admin@knozstore.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <Input
              label="كلمة المرور"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              دخول
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-brand-text-muted mt-6">
          © {new Date().getFullYear()} Knoz Store. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
