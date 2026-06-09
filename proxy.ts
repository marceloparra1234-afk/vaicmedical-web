import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authenticated =
    Boolean(secret && token) &&
    (await verifyAdminSessionToken(token || "", secret || ""));

  if (authenticated) {
    const response = NextResponse.next();
    const refreshedToken = await createAdminSessionToken(secret || "");
    response.cookies.set(ADMIN_SESSION_COOKIE, refreshedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12,
      path: "/",
    });
    return response;
  }

  if (pathname.startsWith("/api/admin/")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
