import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from "@/lib/admin-session";
import { getAdminUsers, verifyPassword } from "@/lib/admin-users";

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };
  const users = await getAdminUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === email?.trim().toLowerCase(),
  );
  const storedPasswordValid = Boolean(
    user?.passwordHash &&
      password &&
      (await verifyPassword(password, user.passwordHash)),
  );
  const environmentPasswordValid = Boolean(
    user?.id === "environment-admin" &&
      password === process.env.ADMIN_PASSWORD,
  );
  const valid = Boolean(
    user &&
      user.status === "Activo" &&
      (storedPasswordValid || environmentPasswordValid) &&
      process.env.ADMIN_SESSION_SECRET,
  );

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
