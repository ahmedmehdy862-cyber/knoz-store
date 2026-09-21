import { SettingsClient } from "./SettingsClient";
import { getSiteSettings } from "@/services/site-content";

async function getSettings() {
  return getSiteSettings();
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
