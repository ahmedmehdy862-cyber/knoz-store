import { createClient } from "@/lib/supabase/server";
import { ContentClient } from "./ContentClient";

async function getContent() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_content")
    .select("*");

  if (error) throw error;

  const contentMap: Record<string, Record<string, unknown>> = {};
  (data || []).forEach((item) => {
    contentMap[item.key] = item.value;
  });

  return contentMap;
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
