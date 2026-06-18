export type AdminUploadKind = "image" | "document" | "video" | "font";

export async function uploadAdminFile(file: File, kind: AdminUploadKind) {
  if (kind === "image") {
    try {
      const image = await createImageBitmap(file);
      image.close();
    } catch {
      throw new Error("El archivo seleccionado no contiene una imagen válida");
    }
  }

  const mimeType = file.type || guessMimeType(file.name);
  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      mimeType,
      kind,
    }),
  });
  const result = (await response.json()) as {
    error?: string;
    uploadUrl?: string;
    url?: string;
  };
  if (!response.ok || !result.uploadUrl || !result.url) {
    throw new Error(result.error || "No se pudo preparar la carga");
  }

  const uploadResponse = await fetch(result.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: file,
  });
  if (!uploadResponse.ok) {
    const detail = await uploadResponse.text().catch(() => "");
    throw new Error(`No se pudo subir el archivo a Supabase (${uploadResponse.status}). ${detail}`);
  }
  return result.url;
}

function guessMimeType(name: string) {
  const extension = name.split(".").pop()?.toLowerCase();
  if (extension === "ttf") return "font/ttf";
  if (extension === "otf") return "font/otf";
  if (extension === "woff") return "font/woff";
  if (extension === "woff2") return "font/woff2";
  return "application/octet-stream";
}
