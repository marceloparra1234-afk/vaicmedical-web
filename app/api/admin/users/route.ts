import { NextRequest, NextResponse } from "next/server";
import { AdminRole, AdminUserRecord, AdminUserStatus, getAdminUsers, hashPassword, saveAdminUsers } from "@/lib/admin-users";

const roles: AdminRole[] = ["Administrador", "Editor", "Diseñador"];
const statuses: AdminUserStatus[] = ["Activo", "Inactivo"];
type UserInput = { id?: string; name?: string; email?: string; role?: AdminRole; status?: AdminUserStatus; password?: string };

export async function GET() {
  return NextResponse.json({ users: (await getAdminUsers()).map(toPublicUser) });
}

export async function POST(request: NextRequest) {
  const input = (await request.json()) as UserInput;
  const error = validateInput(input, true);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const users = await getAdminUsers();
  if (users.some((user) => user.email.toLowerCase() === input.email?.toLowerCase())) {
    return NextResponse.json({ error: "Ya existe un usuario con ese correo" }, { status: 409 });
  }
  const now = new Date().toISOString();
  const user: AdminUserRecord = {
    id: crypto.randomUUID(), name: input.name!.trim(), email: input.email!.trim().toLowerCase(),
    role: input.role!, status: input.status!, passwordHash: await hashPassword(input.password!),
    createdAt: now, updatedAt: now,
  };
  const result = await saveAdminUsers([...users, user]);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ user: toPublicUser(user) });
}

export async function PATCH(request: NextRequest) {
  const input = (await request.json()) as UserInput;
  const error = validateInput(input, false);
  if (error || !input.id) return NextResponse.json({ error: error || "Falta identificar el usuario" }, { status: 400 });
  const users = await getAdminUsers();
  const current = users.find((user) => user.id === input.id);
  if (!current) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  if (users.some((user) => user.id !== input.id && user.email.toLowerCase() === input.email?.toLowerCase())) {
    return NextResponse.json({ error: "Ya existe un usuario con ese correo" }, { status: 409 });
  }
  const updated: AdminUserRecord = {
    ...current, name: input.name!.trim(), email: input.email!.trim().toLowerCase(),
    role: input.role!, status: input.status!, updatedAt: new Date().toISOString(),
    ...(input.password ? { passwordHash: await hashPassword(input.password) } : {}),
  };
  const result = await saveAdminUsers(users.map((user) => user.id === input.id ? updated : user));
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ user: toPublicUser(updated) });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta identificar el usuario" }, { status: 400 });
  const users = await getAdminUsers();
  const user = users.find((item) => item.id === id);
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  const remaining = users.filter((item) => item.id !== id);
  if (!remaining.some((item) => item.role === "Administrador" && item.status === "Activo")) {
    return NextResponse.json({ error: "Debe existir al menos un administrador activo" }, { status: 400 });
  }
  const result = await saveAdminUsers(remaining);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}

function validateInput(input: UserInput, passwordRequired: boolean) {
  if (!input.name?.trim()) return "Ingresa el nombre del usuario";
  if (!input.email?.trim() || !input.email.includes("@")) return "Ingresa un correo válido";
  if (!input.role || !roles.includes(input.role)) return "Selecciona un rol válido";
  if (!input.status || !statuses.includes(input.status)) return "Selecciona un estado válido";
  if ((passwordRequired || input.password) && (!input.password || input.password.length < 8)) return "La contraseña debe tener al menos 8 caracteres";
  return "";
}

function toPublicUser(user: AdminUserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
