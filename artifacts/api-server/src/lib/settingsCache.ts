import { db, systemSettingsTable } from "@workspace/db";

let cache: Record<string, string> = {};
let lastFetch = 0;
const TTL_MS = 60_000;

export async function getSettings(): Promise<Record<string, string>> {
  const now = Date.now();
  if (now - lastFetch < TTL_MS && Object.keys(cache).length > 0) return cache;
  const rows = await db.select().from(systemSettingsTable);
  const fresh: Record<string, string> = {};
  for (const row of rows) {
    if (row.value !== null) fresh[row.key] = row.value;
  }
  cache = fresh;
  lastFetch = now;
  return cache;
}

export function invalidateCache() {
  lastFetch = 0;
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const settings = await getSettings();
  return settings[key] ?? fallback;
}

export async function getBannedIps(): Promise<string[]> {
  const val = await getSetting("banned_ips", "[]");
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}
