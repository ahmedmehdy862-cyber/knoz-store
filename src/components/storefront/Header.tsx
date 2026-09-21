"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { SearchBar } from "./SearchBar";
import { MobileNav } from "./MobileNav";
import { CartDrawer } from "./CartDrawer";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/categories", label: "التصنيفات" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCartOpen = useCallback(() => setCartOpen(true), []);
  const handleCartClose = useCallback(() => setCartOpen(false), []);
  const handleMobileNavOpen = useCallback(() => setMobileNavOpen(true), []);
  const handleMobileNavClose = useCallback(() => setMobileNavOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full bg-brand-surface border-b transition-shadow duration-300",
          scrolled
            ? "border-brand-border shadow-md"
            : "border-brand-border-light shadow-sm"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Right: Logo + Nav (RTL) */}
            <div className="flex items-center gap-8">
              <Link href="/" className="shrink-0">
                <span className="text-xl font-bold text-brand-primary font-heading">
                  Knoz Store
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-brand-text-secondary hover:text-brand-primary hover:bg-brand-secondary/50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: Search (desktop) */}
            <div className="hidden lg:block flex-1 max-w-md">
              <SearchBar />
            </div>

            {/* Left: Actions (RTL = left side) */}
            <div className="flex items-center gap-2">
              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg text-brand-text-secondary hover:text-brand-primary hover:bg-brand-secondary/50 transition-colors"
                aria-label="حسابي"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              </Link>

              {/* Cart */}
              <button
                onClick={handleCartOpen}
                className="relative flex items-center justify-center w-10 h-10 rounded-lg text-brand-text-secondary hover:text-brand-primary hover:bg-brand-secondary/50 transition-colors cursor-pointer"
                aria-label="سلة التسوق"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-accent text-white text-[10px] font-bold leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={handleMobileNavOpen}
                className="flex md:hidden items-center justify-center w-10 h-10 rounded-lg text-brand-text-secondary hover:text-brand-primary hover:bg-brand-secondary/50 transition-colors cursor-pointer"
                aria-label="القائمة"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={handleMobileNavClose} />
      <CartDrawer open={cartOpen} onClose={handleCartClose} />
    </>
  );
}
