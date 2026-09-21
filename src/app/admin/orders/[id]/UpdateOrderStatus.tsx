"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/utils";

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: string;
}

export function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        dir="rtl"
        className="px-3 py-2 rounded-lg border border-brand-border-light bg-white text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent cursor-pointer"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {status !== currentStatus && (
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-accent text-white hover:bg-brand-accent-dark transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "جاري التحديث..." : "تحديث"}
        </button>
      )}
    </div>
  );
}
