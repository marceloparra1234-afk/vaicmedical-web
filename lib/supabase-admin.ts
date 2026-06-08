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
    { cache: "no-store", headers: getSupabaseAdminHeaders(config.serviceRoleKey) },
  );
  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{ content: T }>;
  return rows[0]?.content || null;
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
  if (response.ok) return { ok: true as const };
  console.error("Supabase site_content save failed", response.status, await response.text());
  return { ok: false as const, error: "No se pudo guardar el contenido en Supabase" };
}
