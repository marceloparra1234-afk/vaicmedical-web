export type AdminUploadKind = "image" | "document" | "video" | "font";

export async function uploadAdminFile(file: File, kind: AdminUploadKind) {
  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
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
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!uploadResponse.ok) throw new Error("No se pudo subir el archivo");
  return result.url;
}

