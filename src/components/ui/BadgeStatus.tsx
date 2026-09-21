import { cn, type OrderStatus, getOrderStatusInfo } from "@/lib/utils";

export interface BadgeStatusProps {
  status: OrderStatus;
  className?: string;
}

function BadgeStatus({ status, className }: BadgeStatusProps) {
  const info = getOrderStatusInfo(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        info.color,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {info.label}
    </span>
  );
}

export { BadgeStatus };
