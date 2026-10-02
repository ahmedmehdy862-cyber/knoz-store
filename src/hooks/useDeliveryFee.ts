"use client";

import { useEffect, useState } from "react";

const FALLBACK = { threshold: 500, fee: 50 };

export function useDeliveryFee(subtotal: number): {
  deliveryFee: number;
  threshold: number;
  isFree: boolean;
} {
  const [settings, setSettings] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings/delivery")
      .then((res) => (res.ok ? res.json() : FALLBACK))
      .then((data) => {
        if (cancelled) return;
        setSettings({
          threshold:
            Number.isFinite(Number(data?.threshold)) && Number(data.threshold) >= 0
              ? Number(data.threshold)
              : FALLBACK.threshold,
          fee:
            Number.isFinite(Number(data?.fee)) && Number(data.fee) >= 0
              ? Number(data.fee)
              : FALLBACK.fee,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (subtotal <= 0) return { deliveryFee: 0, threshold: settings.threshold, isFree: false };
  const isFree = subtotal >= settings.threshold;
  return { deliveryFee: isFree ? 0 : settings.fee, threshold: settings.threshold, isFree };
}