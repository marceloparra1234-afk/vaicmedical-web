"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Rendimiento", href: "/admin", icon: "01" },
  { label: "Inicio", href: "/admin/inicio", icon: "02" },
  { label: "Nosotros", href: "/admin/nosotros", icon: "03" },
  { label: "Servicios", href: "/admin/servicios", icon: "04" },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: "05",
    children: [
      { label: "Crear publicación", href: "/admin/blog/crear" },
    ],
  },
  {
    label: "Catálogo",
    href: "/admin/catalogo",
    icon: "06",
    children: [
      { label: "Gestión del catálogo", href: "/admin/catalogo" },
      { label: "Crear producto", href: "/admin/catalogo/productos/crear" },
      { label: "Editar vista catálogo", href: "/admin/catalogo/vista" },
      { label: "Editar vista producto", href: "/admin/catalogo/productos/vista" },
    ],
  },
  { label: "Contacto", href: "/admin/contacto", icon: "07" },
  { label: "Ventana emergente", href: "/admin/ventana-emergente", icon: "08" },
  { label: "Identidad visual", href: "/admin/identidad-visual", icon: "09" },
  { label: "Usuarios", href: "/admin/usuarios", icon: "10" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vaicmedical:admin-user");
      setAdminUser(stored ? JSON.parse(stored) : null);
    } catch {
      setAdminUser(null);
    }
  }, []);

  if (pathname === "/admin/login") return children;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    localStorage.removeItem("vaicmedical:admin-user");
    window.location.href = "/admin/login";
  }

  const initials = getInitials(adminUser?.name || adminUser?.email || "Usuario");

  return (
    <div className="min-h-screen bg-[#eef5f7] text-[#213255]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 overflow-y-auto border-r border-[#d7e9ef] bg-[#213255] text-white transition-[width] duration-200 ${
          collapsed ? "w-[76px]" : "w-[286px]"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
          {!collapsed && (
            <Image
              alt="VaicMedical"
              className="h-9 w-auto"
              height={42}
              src="/brand/vaicmedical-logo-white.svg"
              width={225}
            />
          )}
          <button
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/15 text-lg font-semibold transition hover:border-[#58c3de] hover:text-[#58c3de]"
            onClick={() => setCollapsed((value) => !value)}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
            type="button"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="grid gap-1 p-3">
          {navigation.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <div key={item.href}>
                <Link
                  className={`flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#58c3de] text-[#213255]"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-current/25 font-mono text-[10px]">
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>

                {!collapsed && item.children && active && (
                  <div className="ml-10 mt-1 grid gap-1 border-l border-white/15 pl-3">
                    {item.children.map((child) => (
                      <Link
                        className={`rounded-md px-3 py-2 text-xs transition ${
                          pathname === child.href
                            ? "bg-white/12 text-[#58c3de]"
                            : "text-white/55 hover:text-white"
                        }`}
                        href={child.href}
                        key={child.href}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div
        className={`transition-[padding] duration-200 ${
          collapsed ? "pl-[76px]" : "pl-[286px]"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#d7e9ef] bg-white/95 px-7 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58c3de]">
              Administrador
            </p>
            <p className="mt-1 text-sm text-[#667085]">
              Gestión de contenido VaicMedical
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="rounded-lg border border-[#d7e9ef] px-4 py-2 text-sm font-semibold transition hover:border-[#58c3de]"
              href="/"
              target="_blank"
            >
              Ver sitio
            </Link>
            <button
              className="rounded-lg border border-[#d7e9ef] px-4 py-2 text-sm font-semibold transition hover:border-[#58c3de]"
              onClick={logout}
              type="button"
            >
              Cerrar sesión
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#213255] text-xs font-bold text-white">
              {initials}
            </div>
          </div>
        </header>
        <main className="p-7">{children}</main>
      </div>
    </div>
  );
}

function getInitials(value: string) {
  const clean = value.trim();
  if (!clean) return "US";
  const source = clean.includes("@") ? clean.split("@")[0].replace(/[._-]+/g, " ") : clean;
  const parts = source.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "U").concat(parts[1]?.[0] || parts[0]?.[1] || "S").toUpperCase();
}
