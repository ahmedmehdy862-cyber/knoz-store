import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const colorStyles = {
  primary: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
  accent: "bg-brand-accent/10 text-brand-accent-dark border-brand-accent/20",
  secondary: "bg-brand-secondary text-brand-primary border-brand-secondary-dark",
  success: "bg-brand-success/10 text-brand-success border-brand-success/20",
  warning: "bg-brand-warning/10 text-brand-warning border-brand-warning/20",
  danger: "bg-brand-error/10 text-brand-error border-brand-error/20",
  info: "bg-brand-info/10 text-brand-info border-brand-info/20",
} as const;

export type BadgeColor = keyof typeof colorStyles;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

function Badge({ className, color = "primary", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        colorStyles[color],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

const PRODUCT_BADGES = {
  جديد: { color: "info" as BadgeColor, label: "جديد" },
  مميز: { color: "accent" as BadgeColor, label: "مميز" },
  "الأكثر مبيعًا": { color: "warning" as BadgeColor, label: "الأكثر مبيعًا" },
  محدود: { color: "danger" as BadgeColor, label: "محدود" },
} as const;

function ProductBadge({ badge }: { badge: string | null }) {
  if (!badge || !(badge in PRODUCT_BADGES)) return null;
  const config = PRODUCT_BADGES[badge as keyof typeof PRODUCT_BADGES];
  return <Badge color={config.color}>{config.label}</Badge>;
}

export { Badge, ProductBadge };
