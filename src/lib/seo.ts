export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://knoz-store.vercel.app";

export const SITE_NAME = "Knoz Store";
export const SITE_NAME_AR = "كنوز ستور";
export const SITE_LOCALE = "ar_EG";
export const SITE_AUTHOR = "Knoz Store";

export const DEFAULT_TITLE = "Knoz Store | كنوز ستور";
export const DEFAULT_DESCRIPTION =
  "كنوز ستور - منتجات مخصصة، مجات، استيكرز، ثيمات، هدايا بطابع شخصي. صمّم منتجك بتفاصيلك.";

export const OG_IMAGE = "/logo/knoz-logo.png";
export const OG_IMAGE_WIDTH = 640;
export const OG_IMAGE_HEIGHT = 640;

export const CURRENCY = "EGP";

// Set via Vercel env (NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) after
// adding the property in Google Search Console. Empty = tag omitted.
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : clean;
}
