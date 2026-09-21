import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  change?: number;
  className?: string;
}

function StatsCard({ icon, title, value, change, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-brand-surface rounded-xl border border-brand-border-light p-5 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-brand-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold text-brand-primary font-heading">
            {value}
          </p>
          {typeof change === "number" && (
            <p
              className={cn(
                "text-xs mt-1 font-medium",
                change >= 0 ? "text-brand-success" : "text-brand-error"
              )}
            >
              {change >= 0 ? "+" : ""}
              {change}% من الشهر الماضي
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

export { StatsCard };
