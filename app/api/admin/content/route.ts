import { NextRequest, NextResponse } from "next/server";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

export async function GET(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Supabase aún no está configurado" },
      { status: 503 },
    );
  }

  const pageKey = request.nextUrl.searchParams.get("pageKey");
  if (!pageKey) {
    return NextResponse.json({ error: "Falta pageKey" }, { status: 400 });
  }

  const response = await fetch(
    `${config.url}/rest/v1/site_content?page_key=eq.${encodeURIComponent(pageKey)}&select=content&limit=1`,
    {
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json({ error: "No se pudo leer el contenido" }, { status: 500 });
  }

  const rows = (await response.json()) as Array<{ content: unknown }>;
  return NextResponse.json({ content: rows[0]?.content || null });
}

export async function POST(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Supabase aún no está configurado" },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { pageKey?: string; content?: unknown };
  if (!body.pageKey || !body.content) {
    return NextResponse.json({ error: "Contenido inválido" }, { status: 400 });
  }

  const response = await fetch(`${config.url}/rest/v1/site_content?on_conflict=page_key`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      page_key: body.pageKey,
      content: body.content,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "No se pudo guardar el contenido" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
