import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { getSiteContent, getSiteSettings } from "@/services/site-content";
import { CONTENT_DEFAULTS } from "@/lib/site-content";

export default async function ContactPage() {
  let content: Record<string, Record<string, unknown>> = {};
  let settings: Record<string, Record<string, unknown>> = {};
  try {
    [content, settings] = await Promise.all([getSiteContent(), getSiteSettings()]);
  } catch {
    // fallback to defaults
  }

  const contact = {
    ...CONTENT_DEFAULTS.contact,
    ...((content.contact || {}) as Record<string, string>),
  } as Record<string, string>;
  const store = (settings.store || {}) as Record<string, unknown>;
  const storeSocial = (settings.social || {}) as Record<string, unknown>;
  const contentSocial = (content.social_media || {}) as Record<string, string>;
  const social: Record<string, string> = {};
  for (const key of ["facebook", "instagram", "tiktok", "twitter"]) {
    const value =
      (typeof storeSocial[key] === "string" && (storeSocial[key] as string)) ||
      contentSocial[key] ||
      "";
    if (value) social[key] = value;
  }

  const phone =
    (typeof store.phone === "string" && store.phone) || contact.phone || "";
  const email =
    (typeof store.email === "string" && store.email) || contact.email || "";
  const whatsapp =
    (typeof store.whatsapp === "string" && store.whatsapp) || contact.whatsapp || "";
  const address = contact.address || "";

  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  const socialLinks = [
    { key: "facebook", label: "فيسبوك" },
    { key: "instagram", label: "انستجرام" },
    { key: "tiktok", label: "تيك توك" },
    { key: "twitter", label: "تويتر/X" },
  ].filter(({ key }) => social[key]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: "تواصل معنا" }]} />

      <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary font-heading mt-6 mb-6">
        تواصل معنا
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {phone && (
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
            className="rounded-xl border border-brand-border-light bg-brand-surface p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-brand-text-muted mb-1">الهاتف</p>
            <p className="font-bold text-brand-primary" dir="ltr">
              {phone}
            </p>
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="rounded-xl border border-brand-border-light bg-brand-surface p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-brand-text-muted mb-1">البريد الإلكتروني</p>
            <p className="font-bold text-brand-primary">{email}</p>
          </a>
        )}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-brand-border-light bg-brand-surface p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-brand-text-muted mb-1">واتساب</p>
            <p className="font-bold text-brand-success" dir="ltr">
              {whatsapp} — ابعتلنا رسالة
            </p>
          </a>
        )}
        {address && (
          <div className="rounded-xl border border-brand-border-light bg-brand-surface p-5 shadow-sm">
            <p className="text-sm text-brand-text-muted mb-1">العنوان</p>
            <p className="font-bold text-brand-primary">{address}</p>
          </div>
        )}
      </div>

      {socialLinks.length > 0 && (
        <div className="mt-6 rounded-xl border border-brand-border-light bg-brand-surface p-5 shadow-sm">
          <p className="text-sm font-bold text-brand-primary font-heading mb-3">
            تابعنا على
          </p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ key, label }) => (
              <a
                key={key}
                href={social[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-brand-secondary text-brand-primary text-sm font-medium hover:bg-brand-secondary-dark transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}