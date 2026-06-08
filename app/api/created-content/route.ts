import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const type = request.nextUrl.searchParams.get("type");
  if (!url || !serviceRoleKey || !type || !["blog", "line", "product"].includes(type)) {
    return NextResponse.json({ items: [] });
  }

  const response = await fetch(
    `${url}/rest/v1/created_content?content_type=eq.${encodeURIComponent(type)}&select=id,slug,content,created_at&order=created_at.desc`,
    {
      cache: "no-store",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );
  if (!response.ok) return NextResponse.json({ items: [] });

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
