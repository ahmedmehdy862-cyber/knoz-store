"use client";

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
  ChevronLeft,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/products", label: "المنتجات", icon: Package },
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

  return (
    <>
      {/* Overlay - mobile only */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-brand-primary text-brand-secondary-light flex flex-col transition-transform duration-300 ease-in-out",
          "lg:static lg:z-auto lg:transition-none",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Close button - mobile only */}
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
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-brand-primary-light/40 text-brand-secondary-light cursor-pointer"
            aria-label="إغلاق القائمة"
          >
            <X size={20} />
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-accent text-white"
                        : "text-brand-secondary-light/80 hover:bg-brand-primary-light/40 hover:text-white"
                    )}
                  >
                    <Icon size={18} />
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
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-brand-secondary-light/80 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut size={18} />
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
