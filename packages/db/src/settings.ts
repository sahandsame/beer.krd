import { type SiteSettings, settingsInput } from "@beer/validators";
import { eq } from "drizzle-orm";
import type { Database } from "./client";
import { setting } from "./schema";
import { defaultSettings } from "./seed-data";

export const SITE_SETTINGS_KEY = "site";

/** Stored settings merged over defaults, so new fields never come back undefined. */
export async function getSiteSettings(db: Database): Promise<SiteSettings> {
  const row = await db.query.setting.findFirst({ where: eq(setting.key, SITE_SETTINGS_KEY) });
  const merged = { ...defaultSettings, ...((row?.value as Partial<SiteSettings>) ?? {}) };
  const parsed = settingsInput.safeParse(merged);
  return parsed.success ? parsed.data : defaultSettings;
}

export async function saveSiteSettings(db: Database, value: SiteSettings): Promise<void> {
  await db
    .insert(setting)
    .values({ key: SITE_SETTINGS_KEY, value })
    .onConflictDoUpdate({ target: setting.key, set: { value, updatedAt: new Date() } });
}
