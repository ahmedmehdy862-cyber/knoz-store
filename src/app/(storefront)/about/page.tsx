import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { getSiteContent } from "@/services/site-content";
import { CONTENT_DEFAULTS } from "@/lib/site-content";

export default async function AboutPage() {
  let content: Record<string, Record<string, unknown>> = {};
  try {
    content = await getSiteContent();
  } catch {
    // fallback to defaults
  }
  const about = {
    ...CONTENT_DEFAULTS.about,
    ...((content.about || {}) as Record<string, string>),
  } as Record<string, string>;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: about.title || "من نحن" }]} />

      <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary font-heading mt-6 mb-6">
        {about.title || "من نحن"}
      </h1>

      <div className="rounded-xl border border-brand-border-light bg-brand-surface p-6 sm:p-8 shadow-sm">
        <p className="text-brand-text-secondary leading-loose whitespace-pre-line">
          {about.description}
        </p>
      </div>
    </div>
  );
}