import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { CONTENT_DEFAULTS, SETTINGS_DEFAULTS } from "@/lib/site-content";

function mergeDefaults(
  defaults: Record<string, Record<string, unknown>>,
  rows: { key: string; value: string }[]
): Record<string, Record<string, unknown>> {
  const map: Record<string, Record<string, unknown>> = {};
  const rowMap = new Map(rows.map((r) => [r.key, r.value]));

  for (const key of Object.keys(defaults)) {
    let merged: Record<string, unknown> = { ...defaults[key] };
    const raw = rowMap.get(key);
    if (raw) {
      try {
        merged = { ...merged, ...JSON.parse(raw) };
      } catch {
        // keep defaults on parse failure
      }
    }
    map[key] = merged;
  }

  return map;
}

export async function getSiteSettings(): Promise<
  Record<string, Record<string, unknown>>
> {
  await connection();
  const rows = await prisma.setting.findMany();
  return mergeDefaults(SETTINGS_DEFAULTS, rows);
}

export async function getSiteContent(): Promise<
  Record<string, Record<string, unknown>>
> {
  await connection();
  const rows = await prisma.siteContent.findMany();
  return mergeDefaults(CONTENT_DEFAULTS, rows);
}

export async function upsertSetting(
  key: string,
  value: Record<string, unknown>
) {
  const existing = await prisma.setting.findUnique({ where: { key } });
  let merged: Record<string, unknown> = value;
  if (existing) {
    try {
      merged = { ...JSON.parse(existing.value), ...value };
    } catch {
      merged = value;
    }
  }
  return prisma.setting.upsert({
    where: { key },
    update: { value: JSON.stringify(merged) },
    create: { key, value: JSON.stringify(merged) },
  });
}

export async function upsertSiteContent(
  key: string,
  value: Record<string, unknown>
) {
  const existing = await prisma.siteContent.findUnique({ where: { key } });
  let merged: Record<string, unknown> = value;
  if (existing) {
    try {
      merged = { ...JSON.parse(existing.value), ...value };
    } catch {
      merged = value;
    }
  }
  return prisma.siteContent.upsert({
    where: { key },
    update: { value: JSON.stringify(merged) },
    create: { key, value: JSON.stringify(merged) },
  });
}