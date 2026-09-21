import { createClient } from "@/lib/supabase/server";
import { ThemesClient } from "./ThemesClient";

async function getThemes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .order("sortOrder", { ascending: true });

  if (error) throw error;
  return data || [];
}

export default async function ThemesPage() {
  const themes = await getThemes();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-primary font-heading">
          إدارة الثيمات
        </h1>
        <p className="text-sm text-brand-text-secondary mt-1">
          {themes.length} ثيم إجمالي
        </p>
      </div>

      <ThemesClient themes={themes} />
    </div>
  );
}
