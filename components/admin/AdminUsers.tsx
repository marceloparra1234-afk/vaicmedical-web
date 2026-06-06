"use client";

import { useState } from "react";
import { PageHeading } from "@/components/admin/AdminDashboard";

const tabs = ["Usuarios", "Permisos", "Roles"];

export function AdminUsers() {
  const [tab, setTab] = useState("Usuarios");

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading
        eyebrow="Administración"
        title="Usuarios, permisos y roles"
        text="Gestiona quién puede ingresar al administrador y qué módulos puede visualizar o editar."
      />
      <div className="mt-7 overflow-hidden rounded-xl border border-[#d7e9ef] bg-white shadow-sm">
        <div className="flex gap-1 border-b border-[#d7e9ef] p-3">
          {tabs.map((item) => (
            <button
              className={`rounded-lg px-5 py-3 text-sm font-semibold transition ${
                tab === item
                  ? "bg-[#213255] text-white"
                  : "text-[#667085] hover:bg-[#eef5f7]"
              }`}
              key={item}
              onClick={() => setTab(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === "Usuarios" && <UsersTab />}
          {tab === "Permisos" && <PermissionsTab />}
          {tab === "Roles" && <RolesTab />}
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold">Usuarios del administrador</h2>
          <p className="mt-1 text-sm text-[#667085]">
            Las cuentas reales se conectarán cuando implementemos autenticación.
          </p>
        </div>
        <button className="rounded-lg bg-[#58c3de] px-5 py-3 text-sm font-bold" type="button">
          Crear usuario
        </button>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-[#eef5f7] text-xs uppercase text-[#667085]">
            <tr>
              <th className="p-4">Usuario</th>
              <th className="p-4">Correo</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[#d7e9ef]">
              <td className="p-4 font-semibold">Marcelo Parra</td>
              <td className="p-4 text-[#667085]">administrador@vaicmedical.cl</td>
              <td className="p-4">Administrador</td>
              <td className="p-4 text-[#16845b]">Activo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function PermissionsTab() {
  const permissions = [
    "Visualizar panel de rendimiento",
    "Editar páginas",
    "Crear publicaciones",
    "Crear líneas y productos",
    "Gestionar usuarios",
  ];

  return (
    <div>
      <h2 className="font-bold">Permisos por usuario o rol</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {permissions.map((permission) => (
          <label
            className="flex items-center gap-3 rounded-lg border border-[#d7e9ef] p-4 text-sm font-semibold"
            key={permission}
          >
            <input className="h-4 w-4 accent-[#58c3de]" defaultChecked type="checkbox" />
            {permission}
          </label>
        ))}
      </div>
    </div>
  );
}

function RolesTab() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Roles disponibles</h2>
        <button className="rounded-lg bg-[#213255] px-5 py-3 text-sm font-bold text-white" type="button">
          Crear rol
        </button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ["Administrador", "Acceso completo al panel y configuración."],
          ["Editor", "Puede editar contenido y crear publicaciones."],
          ["Diseñador", "Puede editar apariencia, imágenes y vistas previas."],
        ].map(([role, text]) => (
          <article className="rounded-lg border border-[#d7e9ef] p-5" key={role}>
            <h3 className="font-bold">{role}</h3>
            <p className="mt-2 text-sm leading-6 text-[#667085]">{text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
