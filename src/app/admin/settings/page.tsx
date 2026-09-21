import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./SettingsClient";

async function getSettings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settings")
    .select("*");

  if (error) throw error;

  const settingsMap: Record<string, Record<string, unknown>> = {};
  (data || []).forEach((item) => {
    settingsMap[item.key] = item.value;
  });

  return settingsMap;
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-primary font-heading">
          الإعدادات
        </h1>
        <p className="text-sm text-brand-text-secondary mt-1">
          إدارة إعدادات المتجر
        </p>
      </div>

      <SettingsClient initialData={settings} />
    </div>
  );
}
