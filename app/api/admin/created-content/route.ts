import { NextRequest, NextResponse } from "next/server";

type CreatedContentBody = {
  type?: "blog" | "line" | "product";
  slug?: string;
  content?: unknown;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

function getSupabaseHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

export async function GET(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Supabase aún no está configurado", items: [] },
      { status: 503 },
    );
  }

  const type = request.nextUrl.searchParams.get("type");
  if (!type || !["blog", "line", "product"].includes(type)) {
    return NextResponse.json({ error: "Tipo inválido", items: [] }, { status: 400 });
  }

  const response = await fetch(
    `${config.url}/rest/v1/created_content?content_type=eq.${encodeURIComponent(type)}&select=id,slug,content,created_at&order=created_at.desc`,
    {
      cache: "no-store",
      headers: getSupabaseHeaders(config.serviceRoleKey),
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "No se pudo leer el contenido creado", items: [] },
      { status: 500 },
    );
  }

  const rows = (await response.json()) as Array<{
    id: string;
    slug: string;
    content: Record<string, unknown>;
    created_at: string;
  }>;

  return NextResponse.json({
    items: rows.map((row) => ({
      ...row.content,
      id: row.id,
      slug: row.slug,
      createdAt: row.created_at,
    })),
  });
}

export async function POST(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Supabase aún no está configurado" },
      { status: 503 },
    );
  }

  const body = (await request.json()) as CreatedContentBody;
  if (!body.type || !body.slug || !body.content) {
    return NextResponse.json({ error: "Contenido inválido" }, { status: 400 });
  }

  const response = await fetch(`${config.url}/rest/v1/created_content?on_conflict=content_type,slug`, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(config.serviceRoleKey),
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      content_type: body.type,
      slug: body.slug,
      content: body.content,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "No se pudo publicar en Supabase" },
      { status: 500 },
    );
  }

  const rows = (await response.json()) as Array<{ id: string }>;
  return NextResponse.json({ ok: true, id: rows[0]?.id || null });
}
