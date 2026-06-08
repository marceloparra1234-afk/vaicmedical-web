export const ADMIN_SESSION_COOKIE = "vaicmedical_admin_session";

const encoder = new TextEncoder();

function toBase64Url(value: Uint8Array | string) {
  const text =
    typeof value === "string"
      ? value
      : String.fromCharCode(...Array.from(value));
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export async function createAdminSessionToken(secret: string) {
  const payload = toBase64Url(
    JSON.stringify({ expiresAt: Date.now() + 1000 * 60 * 60 * 12 }),
  );
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifyAdminSessionToken(token: string, secret: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if ((await sign(payload, secret)) !== signature) return false;

  try {
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { expiresAt?: number };
    return Boolean(decoded.expiresAt && decoded.expiresAt > Date.now());
  } catch {
    return false;
  }
}
