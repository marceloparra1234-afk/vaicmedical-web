import { getSiteContent, saveSiteContent } from "@/lib/supabase-admin";

export const ADMIN_USERS_KEY = "admin-users";
export type AdminRole = "Administrador" | "Editor" | "Diseñador";
export type AdminUserStatus = "Activo" | "Inactivo";
export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminUserStatus;
  passwordHash?: string;
  createdAt: string;
  updatedAt: string;
};

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", iterations: 120000, salt }, key, 256);
  return `${Buffer.from(salt).toString("base64url")}.${Buffer.from(bits).toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [saltValue, expected] = stored.split(".");
  if (!saltValue || !expected) return false;
  const salt = new Uint8Array(Buffer.from(saltValue, "base64url"));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", iterations: 120000, salt }, key, 256);
  return Buffer.from(bits).toString("base64url") === expected;
}

export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  const stored = await getSiteContent<{ users: AdminUserRecord[] }>(ADMIN_USERS_KEY);
  if (stored?.users?.length) return stored.users;
  const now = new Date().toISOString();
  return [{
    id: "environment-admin",
    name: "Administrador VaicMedical",
    email: process.env.ADMIN_EMAIL || "admin@vaicmedical.cl",
    role: "Administrador",
    status: "Activo",
    createdAt: now,
    updatedAt: now,
  }];
}

export async function saveAdminUsers(users: AdminUserRecord[]) {
  return saveSiteContent(ADMIN_USERS_KEY, { users });
}
