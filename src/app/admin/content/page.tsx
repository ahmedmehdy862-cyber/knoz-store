import { ContentClient } from "./ContentClient";
import { getSiteContent } from "@/services/site-content";

async function getContent() {
  return getSiteContent();
}

export default async function ContentPage() {
  const content = await getContent();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-primary font-heading">
          إدارة المحتوى
        </h1>
        <p className="text-sm text-brand-text-secondary mt-1">
          تعديل محتوى الموقع
        </p>
      </div>

      <ContentClient initialData={content} />
    </div>
  );
}
