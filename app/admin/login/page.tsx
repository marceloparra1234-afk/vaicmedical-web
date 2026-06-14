"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    router.prefetch("/admin");
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Ingresando...");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setStatus("Usuario o contraseña incorrectos.");
      return;
    }
    router.replace("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#eaf8fc] px-5 py-12">
      <form className="w-full max-w-md rounded-xl border border-[#d7e9ef] bg-white p-8 shadow-xl shadow-[#213255]/10" onSubmit={submit}>
        <Image alt="VaicMedical" className="h-12 w-auto" height={48} src="/brand/vaicmedical-logo.svg" width={260} />
        <h1 className="mt-8 text-2xl font-bold text-[#213255]">Acceso al administrador</h1>
        <p className="mt-2 text-sm leading-6 text-[#34466f]">Ingresa tus credenciales para administrar el sitio.</p>
        <label className="mt-6 block text-xs font-bold text-[#34466f]">
          Usuario
          <input className="mt-2 h-12 w-full rounded-lg border border-[#d7e9ef] px-3 text-sm outline-none focus:border-[#58c3de]" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
        </label>
        <label className="mt-4 block text-xs font-bold text-[#34466f]">
          Contraseña
          <input className="mt-2 h-12 w-full rounded-lg border border-[#d7e9ef] px-3 text-sm outline-none focus:border-[#58c3de]" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
        </label>
        <button className="mt-6 w-full rounded-lg bg-[#213255] px-5 py-3 text-sm font-bold text-white" type="submit">Ingresar</button>
        <p className="mt-4 min-h-5 text-center text-sm font-semibold text-[#34466f]">{status}</p>
      </form>
    </main>
  );
}
