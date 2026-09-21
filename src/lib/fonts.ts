export interface FontOption {
  id: string;
  name: string;
  family: string;
  href: string;
}

export const DEFAULT_HEADING_FONT = "almarai";
export const DEFAULT_BODY_FONT = "tajawal";

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "almarai",
    name: "ألمرعي Almarai",
    family: "Almarai",
    href: "family=Almarai:wght@300;400;700;800",
  },
  {
    id: "tajawal",
    name: "تجوال Tajawal",
    family: "Tajawal",
    href: "family=Tajawal:wght@200;300;400;500;700;800;900",
  },
  {
    id: "cairo",
    name: "القاهرة Cairo",
    family: "Cairo",
    href: "family=Cairo:wght@200..1000",
  },
  {
    id: "aref-ruqaa",
    name: "عارف رقعة Aref Ruqaa",
    family: "Aref Ruqaa",
    href: "family=Aref+Ruqaa:wght@400;700",
  },
  {
    id: "amiri",
    name: "أميري Amiri",
    family: "Amiri",
    href: "family=Amiri:wght@400;700",
  },
  {
    id: "ibm-plex-sans-arabic",
    name: "IBM Plex Sans Arabic",
    family: "IBM Plex Sans Arabic",
    href: "family=IBM+Plex+Sans+Arabic:wght@100..700",
  },
  {
    id: "noto-kufi-arabic",
    name: "نوتو كوفي Noto Kufi Arabic",
    family: "Noto Kufi Arabic",
    href: "family=Noto+Kufi+Arabic:wght@100..900",
  },
  {
    id: "noto-naskh-arabic",
    name: "نوتو نسخ Noto Naskh Arabic",
    family: "Noto Naskh Arabic",
    href: "family=Noto+Naskh+Arabic:wght@400..700",
  },
  {
    id: "rubik",
    name: "روبيك Rubik",
    family: "Rubik",
    href: "family=Rubik:wght@300..900",
  },
  {
    id: "zain",
    name: "زين Zain",
    family: "Zain",
    href: "family=Zain:wght@200;300;400;700;800;900",
  },
  {
    id: "lemonada",
    name: "ليمونادا Lemonada",
    family: "Lemonada",
    href: "family=Lemonada:wght@300..700",
  },
  {
    id: "el-messiri",
    name: "المسيري El Messiri",
    family: "El Messiri",
    href: "family=El+Messiri:wght@400..700",
  },
  {
    id: "reem-kufi",
    name: "ريم كوفي Reem Kufi",
    family: "Reem Kufi",
    href: "family=Reem+Kufi:wght@400..700",
  },
  {
    id: "changa",
    name: "تشانجا Changa",
    family: "Changa",
    href: "family=Changa:wght@200..800",
  },
  {
    id: "lalezar",
    name: "لاليزار Lalezar",
    family: "Lalezar",
    href: "family=Lalezar",
  },
  {
    id: "marhey",
    name: "مارهي Marhey",
    family: "Marhey",
    href: "family=Marhey:wght@300..700",
  },
  {
    id: "rakkas",
    name: "راكاس Rakkas",
    family: "Rakkas",
    href: "family=Rakkas",
  },
  {
    id: "lateef",
    name: "لطيف Lateef",
    family: "Lateef",
    href: "family=Lateef:wght@200..800",
  },
];

const FONT_MAP = new Map(FONT_OPTIONS.map((f) => [f.id, f]));

export function getFont(id: string | undefined, fallbackId: string): FontOption {
  return FONT_MAP.get(id || "") || FONT_MAP.get(fallbackId) || FONT_OPTIONS[0];
}

export function buildGoogleFontsHref(headingId: string, bodyId: string): string {
  const heading = getFont(headingId, DEFAULT_HEADING_FONT);
  const body = getFont(bodyId, DEFAULT_BODY_FONT);
  return `https://fonts.googleapis.com/css2?${heading.href}&${body.href}&display=swap`;
}