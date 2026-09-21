"use client";

import { Menu, Bell } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-brand-surface/80 backdrop-blur-md border-b border-brand-border-light">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-brand-secondary text-brand-text-secondary lg:hidden cursor-pointer"
            aria-label="فتح القائمة"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold text-brand-primary font-heading">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="relative p-2 rounded-lg hover:bg-brand-secondary text-brand-text-secondary transition-colors cursor-pointer"
            aria-label="الإشعارات"
          >
            <Bell size={20} />
            <span className="absolute top-1 left-1 w-2 h-2 bg-brand-accent rounded-full" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
              {getInitials("Admin User")}
            </div>
            <span className="text-sm font-medium text-brand-text hidden sm:block">
              المدير
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export { AdminHeader };
