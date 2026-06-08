import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };
  const valid =
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD &&
    Boolean(process.env.ADMIN_SESSION_SECRET);

  if (!valid) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  const token = await createAdminSessionToken(process.env.ADMIN_SESSION_SECRET || "");
  (await cookies()).set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
