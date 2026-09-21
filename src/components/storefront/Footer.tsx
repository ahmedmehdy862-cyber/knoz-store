import Link from "next/link";
import { getSiteSettings, getSiteContent } from "@/services/site-content";

const QUICK_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/categories", label: "التصنيفات" },
  { href: "/about", label: "عن كنوز ستور" },
  { href: "/contact", label: "تواصل معنا" },
] as const;

const CATEGORY_LINKS = [
  { href: "/shop?category=mugs", label: "مجات" },
  { href: "/shop?category=stickers", label: "استيكرز" },
  { href: "/shop?category=phone-cases", label: "جراريب موبايل" },
  { href: "/shop?category=tshirts", label: "تيشيرتات" },
  { href: "/shop?category=notebooks", label: "دفاتر" },
] as const;

const SOCIAL_CONFIG = [
  {
    key: "instagram",
    label: "Instagram",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    key: "twitter",
    label: "Twitter/X",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l7.5 10.5M20 4l-11 16M4 4h4l16 16h-4" />
      </svg>
    ),
  },
] as const;

export async function Footer() {
  const content = await getSiteContent();
  const settings = await getSiteSettings();

  const store = (settings.store || {}) as Record<string, unknown>;
  const social = (settings.social || {}) as Record<string, unknown>;
  const contact = (content.contact || {}) as Record<string, string>;

  const storeName = typeof store.name === "string" ? store.name : "Knoz Store";
  const storeNameAr =
    typeof store.name_ar === "string" ? store.name_ar : "كنوز ستور";
  const storeDescription =
    typeof store.description === "string"
      ? store.description
      : "كنوز ستور - منتجات مخصصة بطابع شخصي. صمّم منتجك بتفاصيلك.";
  const aboutDescription =
    typeof (content.about as Record<string, string> | undefined)?.description ===
    "string"
      ? (content.about as Record<string, string>).description
      : storeDescription;

  const phone =
    (typeof store.phone === "string" && store.phone) ||
    contact.phone ||
    "+20 1XX XXX XXXX";
  const email =
    (typeof store.email === "string" && store.email) ||
    contact.email ||
    "info@knozstore.com";

  const socialLinks = SOCIAL_CONFIG.map(({ key, label, icon }) => ({
    href:
      (typeof social[key] === "string" && (social[key] as string)) ||
      `https://${key}.com`,
    label,
    icon,
  }));

  return (
    <footer className="bg-brand-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold font-heading text-white">
                {storeName}
              </span>
            </Link>
            <p className="text-brand-secondary text-sm leading-relaxed max-w-xs">
              {aboutDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-brand-secondary mb-4 uppercase tracking-wider">
              روابط سريعة
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-secondary/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-brand-secondary mb-4 uppercase tracking-wider">
              التصنيفات
            </h3>
            <ul className="space-y-2.5">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-secondary/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-brand-secondary mb-4 uppercase tracking-wider">
              تواصل معنا
            </h3>
            <ul className="space-y-3 text-sm text-brand-secondary/80">
              {phone && (
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{phone}</span>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>{email}</span>
                </li>
              )}
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-brand-secondary hover:bg-white/20 hover:text-white transition-colors"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-brand-secondary/60">
            &copy; {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}