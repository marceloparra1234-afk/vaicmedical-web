"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeading } from "@/components/admin/AdminDashboard";

const tabs = ["Usuarios", "Permisos", "Roles"];
const roles = ["Administrador", "Editor", "Diseñador"] as const;
const statuses = ["Activo", "Inactivo"] as const;

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: (typeof roles)[number];
  status: (typeof statuses)[number];
};

const emptyForm = {
  id: "",
  name: "",
  email: "",
  role: "Editor" as AdminUser["role"],
  status: "Activo" as AdminUser["status"],
  password: "",
};

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
              className={`rounded-lg px-5 py-3 text-sm font-semibold transition ${tab === item ? "bg-[#213255] text-white" : "text-[#667085] hover:bg-[#eef5f7]"}`}
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
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState("Cargando usuarios...");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setUsers(result.users);
        setStatus("");
      })
      .catch(() => setStatus("No se pudieron cargar los usuarios"));
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setShowForm(true);
    setStatus("");
  }

  function openEdit(user: AdminUser) {
    setForm({ ...user, password: "" });
    setShowForm(true);
    setStatus("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("Guardando usuario...");
    const response = await fetch("/api/admin/users", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json().catch(() => null);
    setSaving(false);
    if (!response.ok) {
      setStatus(result?.error || "No se pudo guardar el usuario");
      return;
    }
    setUsers((current) =>
      form.id
        ? current.map((user) => user.id === result.user.id ? result.user : user)
        : [...current, result.user],
    );
    setShowForm(false);
    setStatus("Usuario guardado correctamente");
  }

  async function removeUser(user: AdminUser) {
    if (!window.confirm(`¿Eliminar a ${user.name}?`)) return;
    setStatus("Eliminando usuario...");
    const response = await fetch(`/api/admin/users?id=${encodeURIComponent(user.id)}`, { method: "DELETE" });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus(result?.error || "No se pudo eliminar el usuario");
      return;
    }
    setUsers((current) => current.filter((item) => item.id !== user.id));
    setStatus("Usuario eliminado correctamente");
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold">Usuarios del administrador</h2>
          <p className="mt-1 text-sm text-[#667085]">
            Crea cuentas y modifica su correo, contraseña, rol y estado.
          </p>
        </div>
        <button className="rounded-lg bg-[#58c3de] px-5 py-3 text-sm font-bold text-[#213255]" onClick={openCreate} type="button">
          Crear usuario
        </button>
      </div>

      {showForm && (
        <form className="mt-6 grid gap-4 rounded-lg border border-[#d7e9ef] bg-[#f6fbfd] p-5 md:grid-cols-2" onSubmit={submit}>
          <UserField label="Nombre" value={form.name} onChange={(name) => setForm({ ...form, name })} />
          <UserField label="Correo" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
          <label className="text-xs font-semibold text-[#34466f]">
            Rol
            <select className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as AdminUser["role"] })}>
              {roles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-[#34466f]">
            Estado
            <select className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AdminUser["status"] })}>
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <UserField label={form.id ? "Nueva contraseña (opcional)" : "Contraseña"} type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
          <div className="flex items-end gap-3">
            <button className="h-11 rounded-lg border border-[#d7e9ef] bg-white px-5 text-sm font-semibold" onClick={() => setShowForm(false)} type="button">Cancelar</button>
            <button className="h-11 rounded-lg bg-[#213255] px-5 text-sm font-bold text-white disabled:opacity-60" disabled={saving} type="submit">
              {saving ? "Guardando..." : form.id ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      )}

      <p className="mt-4 min-h-5 text-sm font-semibold text-[#34466f]" role="status">{status}</p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[#eef5f7] text-xs uppercase text-[#667085]">
            <tr><th className="p-4">Usuario</th><th className="p-4">Correo</th><th className="p-4">Rol</th><th className="p-4">Estado</th><th className="p-4">Acciones</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr className="border-t border-[#d7e9ef]" key={user.id}>
                <td className="p-4 font-semibold">{user.name}</td>
                <td className="p-4 text-[#667085]">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className={`p-4 font-semibold ${user.status === "Activo" ? "text-[#213255]" : "text-[#667085]"}`}>{user.status}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]" onClick={() => openEdit(user)} type="button">Editar</button>
                    <button className="rounded-lg border border-[#d7e9ef] px-3 py-2 text-xs font-bold text-[#667085]" onClick={() => removeUser(user)} type="button">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function UserField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="text-xs font-semibold text-[#34466f]">{label}<input className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3" onChange={(event) => onChange(event.target.value)} required={type !== "password" || !label.includes("opcional")} type={type} value={value} /></label>;
}

function PermissionsTab() {
  const permissions = ["Visualizar rendimiento", "Editar p\u00e1ginas", "Crear publicaciones", "Crear l\u00edneas y productos", "Editar dise\u00f1o del cat\u00e1logo", "Gestionar identidad visual", "Gestionar usuarios"];
  return (
    <div>
      <h2 className="font-bold">{"Auditor\u00eda de permisos activos"}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">
        {"Todos los roles autenticados tienen acceso operativo a los m\u00f3dulos del editor. Si m\u00e1s adelante quieres restringir acciones por rol, esta matriz ser\u00e1 la base para activar bloqueos reales."}
      </p>
      <div className="mt-5 overflow-x-auto rounded-lg border border-[#d7e9ef]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#eef5f7] text-xs uppercase text-[#667085]">
            <tr>
              <th className="p-4">Permiso</th>
              {roles.map((role) => <th className="p-4 text-center" key={role}>{role}</th>)}
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr className="border-t border-[#d7e9ef]" key={permission}>
                <td className="p-4 font-semibold">{permission}</td>
                {roles.map((role) => (
                  <td className="p-4 text-center" key={`${permission}-${role}`}>
                    <span className="inline-flex rounded-full bg-[#eaf8fc] px-3 py-1 text-xs font-bold text-[#213255]">Activo</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RolesTab() {
  return <div><h2 className="font-bold">Roles disponibles</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{[["Administrador", "Acceso completo al panel y configuración."], ["Editor", "Puede editar contenido y crear publicaciones."], ["Diseñador", "Puede editar apariencia, imágenes y vistas previas."]].map(([role, text]) => <article className="rounded-lg border border-[#d7e9ef] p-5" key={role}><h3 className="font-bold">{role}</h3><p className="mt-2 text-sm leading-6 text-[#667085]">{text}</p></article>)}</div></div>;
}
