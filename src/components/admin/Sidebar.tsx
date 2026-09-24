"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Palette,
  Sticker,
  Users,
  FileText,
  Settings,
  LogOut,
  BadgePercent,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/promotions", label: "العروض", icon: BadgePercent },
  { href: "/admin/categories", label: "التصنيفات", icon: FolderTree },
  { href: "/admin/themes", label: "الثيمات", icon: Palette },
  { href: "/admin/stickers", label: "الاستيكرز", icon: Sticker },
  { href: "/admin/customers", label: "العملاء", icon: Users },
  { href: "/admin/content", label: "المحتوى", icon: FileText },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  // Lock body scroll + close on Escape while the mobile drawer is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Overlay - mobile only */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="قائمة لوحة التحكم"
        className={cn(
          "fixed top-0 bottom-0 right-0 z-50 w-64 max-w-[85vw] bg-brand-primary text-brand-secondary-light flex flex-col transition-transform duration-300 ease-in-out rounded-l-2xl overflow-hidden",
          "lg:static lg:z-auto lg:w-72 lg:max-w-none lg:transition-none lg:rounded-none",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header with built-in close button - mobile only */}
        <div className="p-4 border-b border-brand-primary-light/30 flex items-center justify-between lg:hidden">
          <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-9 h-9 rounded-lg bg-brand-accent flex items-center justify-center text-white font-bold text-lg font-heading">
              K
            </div>
            <div>
              <h1 className="text-base font-bold text-white font-heading leading-tight">
                Knoz Store
              </h1>
              <p className="text-xs text-brand-secondary/80">لوحة التحكم</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 -me-1 rounded-lg hover:bg-brand-primary-light/40 active:bg-brand-primary-light/60 text-white cursor-pointer"
            aria-label="إغلاق القائمة"
          >
            <X size={22} />
          </button>
        </div>

        {/* Logo - desktop only */}
        <div className="p-5 border-b border-brand-primary-light/30 hidden lg:block">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand-accent flex items-center justify-center text-white font-bold text-lg font-heading">
              K
            </div>
            <div>
              <h1 className="text-base font-bold text-white font-heading leading-tight">
                Knoz Store
              </h1>
              <p className="text-xs text-brand-secondary/80">لوحة التحكم</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-accent text-white"
                        : "text-brand-secondary-light/80 hover:bg-brand-primary-light/40 active:bg-brand-primary-light/60 hover:text-white"
                    )}
                  >
                    <Icon size={19} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-brand-primary-light/30">
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-brand-secondary-light/80 hover:bg-red-500/20 active:bg-red-500/30 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut size={19} />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

export { Sidebar };
export type { SidebarProps };
