"use client";

import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-brand-primary font-heading mb-8">
        حسابي
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-accent"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              معلومات الحساب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-brand-text-muted">الاسم:</span>
                <span className="mr-2 font-medium text-brand-text">
                  لم تسجل الدخول بعد
                </span>
              </div>
              <div>
                <span className="text-brand-text-muted">البريد الإلكتروني:</span>
                <span className="mr-2 font-medium text-brand-text">-</span>
              </div>
            </div>
            <div className="mt-5">
              <Button variant="outline" size="sm" className="w-full">
                تسجيل الدخول
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-accent"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              </svg>
              طلباتي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-text-secondary mb-4">
              تابع طلباتك السابقة وحالة التوصيل
            </p>
            <Link href="/account/orders">
              <Button variant="accent" size="sm" className="w-full">
                عرض الطلبات
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
