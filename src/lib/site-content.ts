export interface ContentField {
  name: string;
  label: string;
  type: "text" | "textarea";
  placeholder?: string;
}

export interface ContentSection {
  key: string;
  label: string;
  fields: ContentField[];
}

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    key: "hero",
    label: "البانر الرئيسي",
    fields: [
      {
        name: "title",
        label: "العنوان",
        type: "text",
        placeholder: "صمّم منتجك",
      },
      {
        name: "title_accent",
        label: "العنوان المميز (الجزء الملوّن)",
        type: "text",
        placeholder: "بتفاصيلك",
      },
      {
        name: "subtitle",
        label: "العنوان الفرعي",
        type: "text",
        placeholder: "مش مجرد منتج... خليه بيك.",
      },
      {
        name: "cta_text",
        label: "نص الزر الأساسي",
        type: "text",
        placeholder: "تسوق الآن",
      },
      {
        name: "cta_link",
        label: "رابط الزر الأساسي",
        type: "text",
        placeholder: "/shop",
      },
      {
        name: "secondary_text",
        label: "نص الزر الثانوي",
        type: "text",
        placeholder: "اكتشف منتجاتنا",
      },
      {
        name: "secondary_link",
        label: "رابط الزر الثانوي",
        type: "text",
        placeholder: "/categories",
      },
    ],
  },
  {
    key: "categories_home",
    label: "قسم التصنيفات (الرئيسية)",
    fields: [
      {
        name: "section_title",
        label: "عنوان القسم",
        type: "text",
        placeholder: "تصفح التصنيفات",
      },
      {
        name: "section_subtitle",
        label: "العنوان الفرعي",
        type: "text",
        placeholder: "اكتشف منتجاتنا حسب التصنيف",
      },
    ],
  },
  {
    key: "featured_products",
    label: "المنتجات المميزة",
    fields: [
      {
        name: "section_title",
        label: "عنوان القسم",
        type: "text",
        placeholder: "المنتجات المميزة",
      },
      {
        name: "section_subtitle",
        label: "العنوان الفرعي",
        type: "text",
        placeholder: "أكتر المنتجات اللي بيحبها عملاؤنا",
      },
    ],
  },
  {
    key: "promo_section",
    label: "البانر الترويجي - تخصيص كامل",
    fields: [
      {
        name: "title",
        label: "العنوان",
        type: "text",
        placeholder: "مش مجرد منتج... خليه بتفاصيلك.",
      },
      {
        name: "description",
        label: "الوصف",
        type: "textarea",
        placeholder: "عندنا تخصيص كامل للمنتجات...",
      },
      {
        name: "cta_text",
        label: "نص الزر",
        type: "text",
        placeholder: "شوف المنتجات القابلة للتخصيص",
      },
      {
        name: "cta_link",
        label: "رابط الزر",
        type: "text",
        placeholder: "/shop?customizable=true",
      },
    ],
  },
  {
    key: "latest_products",
    label: "أحدث المنتجات",
    fields: [
      {
        name: "section_title",
        label: "عنوان القسم",
        type: "text",
        placeholder: "أحدث المنتجات",
      },
      {
        name: "section_subtitle",
        label: "العنوان الفرعي",
        type: "text",
        placeholder: "شوف أكتر المنتجات اللي اتضافت مؤخراً",
      },
      {
        name: "view_all_text",
        label: "نص «عرض الكل»",
        type: "text",
        placeholder: "عرض الكل",
      },
    ],
  },
  {
    key: "why_us",
    label: "ليه كنوز ستور؟",
    fields: [
      {
        name: "section_title",
        label: "عنوان القسم",
        type: "text",
        placeholder: "ليه كنوز ستور؟",
      },
      {
        name: "section_subtitle",
        label: "العنوان الفرعي",
        type: "text",
        placeholder: "إحنا مش بس بنبيع منتجات، إحنا بنخلي كل منتج يحكي قصة",
      },
      {
        name: "benefit_1_title",
        label: "الميزة 1 - العنوان",
        type: "text",
        placeholder: "تخصيص كامل",
      },
      {
        name: "benefit_1_desc",
        label: "الميزة 1 - الوصف",
        type: "text",
        placeholder: "صمّم منتجك بالتفاصيل اللي تحبها",
      },
      {
        name: "benefit_2_title",
        label: "الميزة 2 - العنوان",
        type: "text",
        placeholder: "جودة مضمونة",
      },
      {
        name: "benefit_2_desc",
        label: "الميزة 2 - الوصف",
        type: "text",
        placeholder: "منتجات عالية الجودة، خامات ممتازة",
      },
      {
        name: "benefit_3_title",
        label: "الميزة 3 - العنوان",
        type: "text",
        placeholder: "توصيل لكل مصر",
      },
      {
        name: "benefit_3_desc",
        label: "الميزة 3 - الوصف",
        type: "text",
        placeholder: "نوصل لباب بيتك في أي محافظة",
      },
      {
        name: "benefit_4_title",
        label: "الميزة 4 - العنوان",
        type: "text",
        placeholder: "هدايا من القلب",
      },
      {
        name: "benefit_4_desc",
        label: "الميزة 4 - الوصف",
        type: "text",
        placeholder: "هدية تعبّر عن مشاعرك",
      },
    ],
  },
  {
    key: "about",
    label: "من نحن",
    fields: [
      {
        name: "title",
        label: "العنوان",
        type: "text",
        placeholder: "من نحن",
      },
      {
        name: "description",
        label: "الوصف",
        type: "textarea",
        placeholder: "وصف المتجر",
      },
    ],
  },
  {
    key: "contact",
    label: "معلومات التواصل",
    fields: [
      {
        name: "phone",
        label: "الهاتف",
        type: "text",
        placeholder: "+20 123 456 789",
      },
      {
        name: "email",
        label: "البريد الإلكتروني",
        type: "text",
        placeholder: "info@knozstore.com",
      },
      {
        name: "whatsapp",
        label: "واتساب",
        type: "text",
        placeholder: "+20 123 456 789",
      },
      {
        name: "address",
        label: "العنوان",
        type: "textarea",
        placeholder: "عنوان المتجر",
      },
    ],
  },
  {
    key: "social_media",
    label: "وسائل التواصل الاجتماعي",
    fields: [
      {
        name: "facebook",
        label: "فيسبوك",
        type: "text",
        placeholder: "رابط فيسبوك",
      },
      {
        name: "instagram",
        label: "انستجرام",
        type: "text",
        placeholder: "رابط انستجرام",
      },
      {
        name: "tiktok",
        label: "تيك توك",
        type: "text",
        placeholder: "رابط تيك توك",
      },
      {
        name: "twitter",
        label: "تويتر/X",
        type: "text",
        placeholder: "رابط تويتر",
      },
    ],
  },
];

export const CONTENT_DEFAULTS: Record<string, Record<string, string>> = {
  hero: {
    title: "صمّم منتجك",
    title_accent: "بتفاصيلك",
    subtitle: "مش مجرد منتج... خليه بيك.",
    cta_text: "تسوق الآن",
    cta_link: "/shop",
    secondary_text: "اكتشف منتجاتنا",
    secondary_link: "/categories",
  },
  categories_home: {
    section_title: "تصفح التصنيفات",
    section_subtitle: "اكتشف منتجاتنا حسب التصنيف",
  },
  featured_products: {
    section_title: "المنتجات المميزة",
    section_subtitle: "أكتر المنتجات اللي بيحبها عملاؤنا",
  },
  promo_section: {
    title: "مش مجرد منتج... خليه بتفاصيلك.",
    description:
      "عندنا تخصيص كامل للمنتجات. اكتب اسمك، اختار ثيم، حط استيكر، أو ارفع صورتك. كل منتج يبقى فريد زيك.",
    cta_text: "شوف المنتجات القابلة للتخصيص",
    cta_link: "/shop?customizable=true",
  },
  latest_products: {
    section_title: "أحدث المنتجات",
    section_subtitle: "شوف أكتر المنتجات اللي اتضافت مؤخراً",
    view_all_text: "عرض الكل",
  },
  why_us: {
    section_title: "ليه كنوز ستور؟",
    section_subtitle: "إحنا مش بس بنبيع منتجات، إحنا بنخلي كل منتج يحكي قصة",
    benefit_1_title: "تخصيص كامل",
    benefit_1_desc: "صمّم منتجك بالتفاصيل اللي تحبها. اسمك، ثيمك، استيكرك، صورتك.",
    benefit_2_title: "جودة مضمونة",
    benefit_2_desc: "منتجات عالية الجودة، خامات ممتازة، وطباعة تتحمل الوقت.",
    benefit_3_title: "توصيل لكل مصر",
    benefit_3_desc: "نوصل لباب بيتك في أي محافظة في مصر. توصيل سريع وآمن.",
    benefit_4_title: "هدايا من القلب",
    benefit_4_desc: "منتجات مميزة ليك أو لحد بتحبه. هدية تعبّر عن مشاعرك.",
  },
  about: {
    title: "من نحن",
    description:
      "كنوز ستور - متجر متخصص في المنتجات المخصصة بطابع شخصي. صمّم منتجك بتفاصيلك: اكتب اسمك، اختار تصميمك، وخلّيه فريد زيك.",
  },
  contact: {
    phone: "+20 1XX XXX XXXX",
    email: "info@knozstore.com",
    whatsapp: "+20 1XX XXX XXXX",
    address: "القاهرة، مصر",
  },
  social_media: {
    facebook: "",
    instagram: "",
    tiktok: "",
    twitter: "",
  },
};

export const SETTINGS_DEFAULTS: Record<string, Record<string, string | number>> = {
  store: {
    name: "Knoz Store",
    name_ar: "كنوز ستور",
    description: "منتجات مخصصة، مجات، استيكرز، ثيمات، هدايا بطابع شخصي",
    phone: "+20 1XX XXX XXXX",
    email: "info@knozstore.com",
    whatsapp: "+20 1XX XXX XXXX",
  },
  delivery: {
    free_delivery_threshold: 500,
    default_deliveryFee: 50,
    delivery_time: "2-5 أيام عمل",
  },
  currency: {
    code: "EGP",
    symbol: "جنيه",
    name: "الجنيه المصري",
  },
  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
    twitter: "",
  },
  fonts: {
    heading: "almarai",
    body: "tajawal",
  },
};