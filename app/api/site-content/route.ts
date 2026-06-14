import { NextRequest, NextResponse } from "next/server";
import { getSiteContent } from "@/lib/supabase-admin";

const publicKeys = new Set([
  "inicio",
  "nosotros",
  "servicios",
  "blog",
  "catalogo",
  "catalogo-lineas-vista",
  "catalogo-productos-vista",
  "catalog-settings",
  "contacto",
  "ventana-emergente",
  "visual-identity",
]);

export async function GET(request: NextRequest) {
  const pageKey = request.nextUrl.searchParams.get("pageKey");
  if (!pageKey || !publicKeys.has(pageKey)) {
    return NextResponse.json({ error: "Contenido no disponible" }, { status: 404 });
  }

  return NextResponse.json({
    content: await getSiteContent<Record<string, unknown>>(pageKey),
  });
}
