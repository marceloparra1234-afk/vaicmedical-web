import { NextRequest, NextResponse } from "next/server";

const limits = {
  image: 20 * 1024 * 1024,
  document: 30 * 1024 * 1024,
  video: 50 * 1024 * 1024,
  font: 10 * 1024 * 1024,
};

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedVideoTypes = new Set(["video/mp4", "video/webm"]);
const allowedFontExtensions = /\.(woff2?|ttf|otf)$/i;

function sanitizeFilename(name: string) {
  const parts = name.split(".");
  const extension = parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : "";
  const base = parts
    .join(".")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "archivo"}${extension}`;
}

export async function POST(request: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase aún no está configurado" }, { status: 503 });
  }

  const body = (await request.json()) as {
    name?: string;
    size?: number;
    mimeType?: string;
    kind?: keyof typeof limits;
  };
  const kind = body.kind || "image";

  if (!body.name || !body.size || !body.mimeType || !limits[kind]) {
    return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
  }
  if (body.size > limits[kind]) {
    return NextResponse.json({ error: "El archivo supera el tamaño permitido" }, { status: 413 });
  }
  if (
    (kind === "image" && !allowedImageTypes.has(body.mimeType)) ||
    (kind === "video" && !allowedVideoTypes.has(body.mimeType)) ||
    (kind === "document" && body.mimeType !== "application/pdf" && !allowedImageTypes.has(body.mimeType)) ||
    (kind === "font" && !allowedFontExtensions.test(body.name))
  ) {
    return NextResponse.json({ error: "Formato de archivo no permitido" }, { status: 415 });
  }

  const path = `${kind}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${sanitizeFilename(body.name)}`;
  const response = await fetch(`${url}/storage/v1/object/upload/sign/site-media/${path}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase signed upload failed", response.status, detail);
    return NextResponse.json(
      { error: `No se pudo preparar la carga en Supabase (${response.status}). ${detail}` },
      { status: 500 },
    );
  }

  const signed = (await response.json()) as { url: string };
  return NextResponse.json({
    name: body.name,
    type: kind,
    uploadUrl: `${url}/storage/v1${signed.url}`,
    url: `${url}/storage/v1/object/public/site-media/${path}`,
  });
}
