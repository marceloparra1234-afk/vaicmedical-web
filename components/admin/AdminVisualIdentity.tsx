"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/admin/AdminDashboard";
import { uploadAdminFile } from "@/components/admin/upload-file";
import {
  DEFAULT_VISUAL_IDENTITY,
  normalizeHex,
  VAIC_PALETTE,
  type VisualIdentity,
} from "@/data/visual-identity";

export function AdminVisualIdentity() {
  const [identity, setIdentity] = useState<VisualIdentity>(DEFAULT_VISUAL_IDENTITY);
  const [lastSaved, setLastSaved] = useState<VisualIdentity>(DEFAULT_VISUAL_IDENTITY);
  const [status, setStatus] = useState("Cargando configuración...");
  const [customName, setCustomName] = useState("");
  const [customHex, setCustomHex] = useState("");
  const [activeTab, setActiveTab] = useState<"settings" | "preview">("settings");

  useEffect(() => {
    fetch("/api/admin/content?pageKey=visual-identity")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((result) => {
        const stored = result?.content as Partial<VisualIdentity> | undefined;
        const next = stored
          ? {
              ...DEFAULT_VISUAL_IDENTITY,
              ...stored,
              social: { ...DEFAULT_VISUAL_IDENTITY.social, ...stored.social },
            }
          : DEFAULT_VISUAL_IDENTITY;
        setIdentity(next);
        setLastSaved(next);
        setStatus(stored ? "Configuración cargada" : "Guardando configuración inicial...");
        if (!stored) {
          void fetch("/api/admin/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pageKey: "visual-identity", content: next }),
          }).then((response) => {
            setStatus(response.ok ? "Configuración inicial guardada" : "No se pudo guardar la configuración inicial");
          });
        }
      })
      .catch(() => setStatus("No se pudo cargar la configuración"));
  }, []);

  function update(changes: Partial<VisualIdentity>) {
    setIdentity((current) => ({ ...current, ...changes }));
    setStatus("Cambios sin guardar");
  }

  async function save() {
    setStatus("Guardando...");
    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageKey: "visual-identity", content: identity }),
    });
    if (!response.ok) {
      setStatus("No se pudieron guardar los cambios");
      return;
    }
    setLastSaved(identity);
    setStatus("Identidad visual guardada");
  }

  function addCustomColor() {
    const hex = normalizeHex(customHex);
    if (!customName.trim() || !hex) {
      setStatus("Escribe un nombre y un hexadecimal válido, por ejemplo #58C3DE");
      return;
    }
    update({
      customColors: [...identity.customColors, { name: customName.trim(), hex }],
    });
    setCustomName("");
    setCustomHex("");
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading
        eyebrow="Configuración"
        title="Identidad visual"
        text="Centraliza colores, tipografías, formas, ancho del sitio y enlaces sociales."
      />

      <div className="mt-7 flex gap-2 border-b border-[#D7E9EF]">
        <TabButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")}>Configuración</TabButton>
        <TabButton active={activeTab === "preview"} onClick={() => setActiveTab("preview")}>Vista previa</TabButton>
      </div>

      {activeTab === "settings" ? (
      <div className="mt-7 grid gap-6 xl:grid-cols-2">
        <SettingsPanel title="Paleta VaicMedical">
          <p className="text-sm leading-6 text-[#667085]">
            Estos son los únicos colores disponibles en el editor mientras la paleta personalizada esté desactivada.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {VAIC_PALETTE.map((color) => (
              <div className="flex items-center gap-3 rounded-lg border border-[#D7E9EF] bg-white p-3" key={color.hex}>
                <span
                  className="h-10 w-10 rounded-md border border-[#D7E9EF]"
                  style={{
                    background:
                      color.hex === "transparent"
                        ? "linear-gradient(135deg, #fff 45%, #D7E9EF 46%, #D7E9EF 54%, #fff 55%)"
                        : color.hex,
                  }}
                />
                <span>
                  <strong className="block text-sm">{color.name}</strong>
                  <span className="text-xs text-[#667085]">{color.hex === "transparent" ? "Sin color" : color.hex}</span>
                </span>
              </div>
            ))}
          </div>

          <label className="mt-5 flex items-center justify-between rounded-lg border border-[#D7E9EF] bg-[#F6FBFD] p-4 text-sm font-semibold">
            Permitir colores personalizados
            <input
              checked={identity.allowCustomColors}
              className="h-5 w-5 accent-[#58C3DE]"
              onChange={(event) => update({ allowCustomColors: event.target.checked })}
              type="checkbox"
            />
          </label>
          {identity.allowCustomColors && (
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_160px_auto]">
              <Input label="Nombre" onChange={setCustomName} value={customName} />
              <Input label="Hexadecimal" onChange={setCustomHex} placeholder="#58C3DE" value={customHex} />
              <button className="mt-6 rounded-lg bg-[#213255] px-4 py-3 text-sm font-bold text-white" onClick={addCustomColor} type="button">
                Agregar
              </button>
            </div>
          )}
          {identity.customColors.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {identity.customColors.map((color, index) => (
                <button
                  className="rounded-full border border-[#D7E9EF] bg-white px-3 py-2 text-xs font-semibold"
                  key={`${color.hex}-${index}`}
                  onClick={() => update({ customColors: identity.customColors.filter((_, itemIndex) => itemIndex !== index) })}
                  title="Quitar color"
                  type="button"
                >
                  {color.name} · {color.hex} · Quitar
                </button>
              ))}
            </div>
          )}
        </SettingsPanel>

        <SettingsPanel title="Tipografías">
          <p className="text-sm leading-6 text-[#667085]">
            Carga WOFF, WOFF2, TTF u OTF. Después podrás elegir la tipografía principal desde esta misma sección.
          </p>
          <label className="mt-4 block cursor-pointer rounded-lg border border-dashed border-[#58C3DE] bg-[#F6FBFD] p-4 text-sm font-semibold">
            Agregar tipografía · máximo 10 MB
            <input
              accept=".woff,.woff2,.ttf,.otf"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadAdminFile(file, "font");
                  const name = file.name.replace(/\.[^.]+$/, "");
                  update({ fonts: [...identity.fonts, { name, url }] });
                } catch (error) {
                  setStatus(error instanceof Error ? error.message : "No se pudo cargar la tipografía");
                }
              }}
              type="file"
            />
          </label>
          <label className="mt-4 block text-xs font-semibold">
            Tipografía principal
            <select
              className="mt-2 h-11 w-full rounded-lg border border-[#D7E9EF] bg-white px-3"
              onChange={(event) => update({ primaryFont: event.target.value })}
              value={identity.primaryFont}
            >
              <option value="Geist">Geist</option>
              {identity.fonts.map((font) => <option key={font.url} value={font.name}>{font.name}</option>)}
            </select>
          </label>
        </SettingsPanel>

        <SettingsPanel title="Diseño general">
          <Range label="Ancho máximo del contenido" max={1920} min={960} onChange={(contentWidth) => update({ contentWidth })} suffix="px" value={identity.contentWidth} />
          <Range label="Redondeado general" max={32} min={0} onChange={(cornerRadius) => update({ cornerRadius })} suffix="px" value={identity.cornerRadius} />
          <Range label="Grosor de bordes" max={4} min={0} onChange={(borderWidth) => update({ borderWidth })} suffix="px" value={identity.borderWidth} />
          <Range label="Espaciado entre secciones" max={160} min={40} onChange={(sectionSpacing) => update({ sectionSpacing })} suffix="px" value={identity.sectionSpacing} />
          <Range label="Tamaño máximo de títulos" max={88} min={40} onChange={(titleSize) => update({ titleSize })} suffix="px" value={identity.titleSize} />
          <Range label="Redondeado de botones" max={999} min={0} onChange={(buttonRadius) => update({ buttonRadius })} suffix="px" value={identity.buttonRadius} />
          <Range label="Redondeado de iconos" max={999} min={0} onChange={(iconRadius) => update({ iconRadius })} suffix="px" value={identity.iconRadius} />
          <label className="mt-5 block text-xs font-semibold">
            Intensidad de sombra
            <select className="mt-2 h-11 w-full rounded-lg border border-[#D7E9EF] bg-white px-3" onChange={(event) => update({ shadowStrength: event.target.value as VisualIdentity["shadowStrength"] })} value={identity.shadowStrength}>
              <option value="none">Sin sombra</option>
              <option value="soft">Suave</option>
              <option value="medium">Media</option>
            </select>
          </label>
        </SettingsPanel>

        <SettingsPanel title="Redes sociales">
          <p className="text-sm leading-6 text-[#667085]">
            Los enlaces vacíos no aparecerán en el pie de página.
          </p>
          <div className="mt-4 grid gap-4">
            {(Object.keys(identity.social) as Array<keyof VisualIdentity["social"]>).map((network) => (
              <Input
                key={network}
                label={network.charAt(0).toUpperCase() + network.slice(1)}
                onChange={(value) => update({ social: { ...identity.social, [network]: value } })}
                placeholder="https://"
                value={identity.social[network]}
              />
            ))}
          </div>
        </SettingsPanel>
      </div>
      ) : (
        <IdentityPreview identity={identity} />
      )}

      <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-xl border border-[#D7E9EF] bg-white/95 p-4 shadow-lg backdrop-blur">
        <span className="text-sm font-semibold text-[#34466F]" role="status">{status}</span>
        <div className="flex gap-3">
          <button className="rounded-lg border border-[#D7E9EF] px-5 py-3 text-sm font-semibold" onClick={() => { setIdentity(structuredClone(lastSaved)); setStatus("Cambios descartados"); }} type="button">
            Descartar
          </button>
          <button className="rounded-lg bg-[#213255] px-5 py-3 text-sm font-bold text-white" onClick={() => void save()} type="button">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button className={`border-b-2 px-5 py-3 text-sm font-bold ${active ? "border-[#58C3DE] text-[#213255]" : "border-transparent text-[#667085]"}`} onClick={onClick} type="button">{children}</button>;
}

function IdentityPreview({ identity }: { identity: VisualIdentity }) {
  const shadow = identity.shadowStrength === "none" ? "none" : identity.shadowStrength === "medium" ? "0 18px 50px rgba(33,50,85,.18)" : "0 10px 30px rgba(33,50,85,.1)";
  return (
    <section className="mt-7 overflow-hidden border border-[#D7E9EF] bg-[#F6FBFD] p-6 sm:p-10" style={{ borderRadius: identity.cornerRadius, fontFamily: identity.primaryFont }}>
      <div className="mx-auto bg-white p-7 sm:p-10" style={{ borderRadius: identity.cornerRadius, boxShadow: shadow, maxWidth: Math.min(identity.contentWidth, 1200) }}>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#58C3DE]">Etiqueta o acento</p>
        <h2 className="mt-4 font-semibold leading-[1.08] text-[#213255]" style={{ fontSize: Math.min(identity.titleSize, 72) }}>Vista previa de identidad visual</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#34466F]">Aquí puedes revisar cómo afectan los controles globales a títulos, texto, botones, tarjetas, bordes e iconos antes de guardar.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button className="border bg-[#213255] px-6 py-3 font-bold text-white" style={{ borderRadius: identity.buttonRadius, borderWidth: identity.borderWidth }}>Botón principal</button>
          <button className="border border-[#58C3DE] bg-white px-6 py-3 font-bold text-[#213255]" style={{ borderRadius: identity.buttonRadius, borderWidth: identity.borderWidth }}>Botón secundario</button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {["Tarjeta de contenido", "Forma e iconografía"].map((title, index) => (
            <article className="border border-[#D7E9EF] bg-[#F6FBFD] p-6" key={title} style={{ borderRadius: identity.cornerRadius, borderWidth: identity.borderWidth }}>
              <div className="grid h-12 w-12 place-items-center bg-[#58C3DE] font-bold text-[#213255]" style={{ borderRadius: identity.iconRadius }}>{index + 1}</div>
              <h3 className="mt-5 text-xl font-bold text-[#213255]">{title}</h3>
              <p className="mt-3 leading-7 text-[#34466F]">Ejemplo del tratamiento visual que se aplicará de forma coherente en el sitio.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SettingsPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-[#D7E9EF] bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">{title}</h2><div className="mt-4">{children}</div></section>;
}

function Input({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block text-xs font-semibold">{label}<input className="mt-2 h-11 w-full rounded-lg border border-[#D7E9EF] px-3" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} /></label>;
}

function Range({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="mt-5 block text-xs font-semibold first:mt-0"><span className="flex justify-between"><span>{label}</span><strong>{value}{suffix}</strong></span><input className="mt-3 w-full accent-[#58C3DE]" max={max} min={min} onChange={(event) => onChange(Number(event.target.value))} type="range" value={value} /></label>;
}
