export function getSupabaseAdminConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

export function getSupabaseAdminHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

export async function getSiteContent<T>(pageKey: string): Promise<T | null> {
  const config = getSupabaseAdminConfig();
  if (!config) return null;
  const response = await fetch(
    `${config.url}/rest/v1/site_content?page_key=eq.${encodeURIComponent(pageKey)}&select=content&limit=1`,
    {
      headers: getSupabaseAdminHeaders(config.serviceRoleKey),
      cache: "no-store",
    },
  );
  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{ content: T }>;
  return rows[0]?.content || null;
}

export async function getSiteContentBundle<T>(
  pageKeys: string[],
): Promise<Record<string, T | null>> {
  const config = getSupabaseAdminConfig();
  if (!config || pageKeys.length === 0) return {};
  const encodedKeys = pageKeys.map((key) => `"${key.replaceAll('"', "")}"`).join(",");
  const response = await fetch(
    `${config.url}/rest/v1/site_content?page_key=in.(${encodeURIComponent(encodedKeys)})&select=page_key,content`,
    {
      headers: getSupabaseAdminHeaders(config.serviceRoleKey),
      cache: "no-store",
    },
  );
  if (!response.ok) return Object.fromEntries(pageKeys.map((key) => [key, null]));
  const rows = (await response.json()) as Array<{ page_key: string; content: T }>;
  const stored = new Map(rows.map((row) => [row.page_key, row.content]));
  return Object.fromEntries(pageKeys.map((key) => [key, stored.get(key) ?? null]));
}

export async function saveSiteContent(pageKey: string, content: unknown) {
  const config = getSupabaseAdminConfig();
  if (!config) return { ok: false as const, error: "Supabase aún no está configurado" };
  const response = await fetch(`${config.url}/rest/v1/site_content?on_conflict=page_key`, {
    method: "POST",
    headers: {
      ...getSupabaseAdminHeaders(config.serviceRoleKey),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ page_key: pageKey, content, updated_at: new Date().toISOString() }),
  });
  if (response.ok) {
    revalidateTag(`site-content:${pageKey}`, { expire: 0 });
    return { ok: true as const };
  }
  console.error("Supabase site_content save failed", response.status, await response.text());
  return { ok: false as const, error: "No se pudo guardar el contenido en Supabase" };
}
import { revalidateTag } from "next/cache";
