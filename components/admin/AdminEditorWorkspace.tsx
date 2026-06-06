"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/admin/AdminDashboard";
import {
  ClientPagePreview,
  type PreviewContent,
} from "@/components/admin/ClientPagePreview";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type EditorWorkspaceProps = {
  contentKey: string;
  title: string;
  description: string;
  sections: string[];
  previewType?: "page" | "popup";
};

type SectionContent = PreviewContent;

const homeDefaults: Record<string, SectionContent> = {
  "Hero principal": {
    title: "Soporte técnico para mantener operativa la atención en salud.",
    subtitle: "Mantención y reparación de equipos médicos",
    content:
      "Reparamos y mantenemos camas clínicas, camillas, mesas quirúrgicas, lámparas, monitores multiparámetros y otros equipos esenciales para la continuidad asistencial.",
  },
  "Método de trabajo": {
    title: "Solicitud, diagnóstico, reparación e informe.",
    subtitle: "Método de trabajo",
    content:
      "Recibimos el requerimiento y clasificamos la criticidad para iniciar una atención técnica ordenada.",
  },
  Nosotros: {
    title: "Trabajo técnico para equipos que no pueden quedar fuera de servicio.",
    subtitle:
      "Recuperar y mantener equipos médicos críticos con respuesta técnica clara y trazable.",
    content:
      "VaicMedical se enfoca en diagnosticar, reparar y mantener equipos médicos de uso intensivo. Nuestro trabajo combina coordinación, criterio técnico y documentación.",
  },
  Servicios: {
    title:
      "Mantención preventiva, reparación correctiva y soporte en terreno.",
    subtitle: "Servicios",
    content:
      "Atendemos equipos esenciales para la operación diaria, con foco en recuperar disponibilidad y reducir tiempos fuera de servicio.",
  },
  "Productos destacados": {
    title: "Categorías para ordenar equipos, repuestos y solicitudes técnicas.",
    subtitle: "Productos y líneas destacadas",
    content:
      "Revisa una selección de equipos, componentes y servicios técnicos. Cada producto cuenta con información, galería y acceso directo para realizar consultas.",
  },
  "Noticias destacadas": {
    title: "Criterios técnicos para cuidar equipos médicos.",
    subtitle: "Noticias y artículos técnicos",
    content:
      "Publicaciones sobre mantención, reparación y continuidad técnica de equipos médicos.",
  },
  Contacto: {
    title: "Coordinemos una evaluación técnica para tus equipos.",
    subtitle: "Contacto",
    content:
      "Puedes solicitar una visita, coordinar una reparación o consultar por mantenciones programadas.",
  },
};

function createInitialContent(contentKey: string, sections: string[]) {
  return Object.fromEntries(
    sections.map((section) => [
      section,
      contentKey === "inicio" && homeDefaults[section]
        ? homeDefaults[section]
        : {
            title: `<strong>${section}</strong>`,
            subtitle: "Texto secundario de la sección",
            content:
              "Contenido editable de esta sección. Los cambios y formatos aparecen inmediatamente en la vista previa.",
          },
    ]),
  ) as Record<string, SectionContent>;
}

export function AdminEditorWorkspace({
  contentKey,
  title,
  description,
  sections,
  previewType = "page",
}: EditorWorkspaceProps) {
  const [selected, setSelected] = useState(sections[0]);
  const [content, setContent] = useState(() =>
    createInitialContent(contentKey, sections),
  );
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    fetch(`/api/admin/content?pageKey=${encodeURIComponent(contentKey)}`)
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((result) => {
        if (result?.content) {
          setContent((current) => ({ ...current, ...result.content }));
        }
      })
      .catch(() => undefined);
  }, [contentKey]);

  const selectedContent = content[selected];

  function updateField(field: keyof SectionContent, value: string) {
    setContent((current) => ({
      ...current,
      [selected]: { ...current[selected], [field]: value },
    }));
    setSaveStatus("Cambios sin guardar");
  }

  async function saveChanges() {
    setSaveStatus("Guardando...");

    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageKey: contentKey, content }),
    });

    if (response.ok) {
      setSaveStatus("Cambios guardados en Supabase");
      return;
    }

    const result = await response.json().catch(() => null);
    setSaveStatus(result?.error || "Supabase aún no está configurado");
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeading eyebrow="Editor de página" title={title} text={description} />

      <div className="mt-7 min-h-[760px] overflow-hidden rounded-xl border border-[#d7e9ef] bg-white shadow-sm">
        <section className="border-b border-[#d7e9ef] bg-white">
          <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="shrink-0">
              <h2 className="font-bold">Secciones</h2>
              <p className="mt-1 text-xs text-[#667085]">
                Selecciona una sección para editarla y verla en la vista previa.
              </p>
            </div>
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 lg:justify-end">
              {sections.map((section) => (
                <button
                  className={`min-h-11 shrink-0 rounded-lg border px-4 py-3 text-center text-xs font-semibold transition ${
                    selected === section
                      ? "border-[#58c3de] bg-[#eaf8fc] text-[#213255]"
                      : "border-[#d7e9ef] text-[#667085] hover:border-[#58c3de]"
                  }`}
                  key={section}
                  onClick={() => setSelected(section)}
                  type="button"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="grid min-h-[690px] xl:grid-cols-[520px_minmax(0,1fr)]">
          <section className="border-b border-[#d7e9ef] bg-white xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between gap-3 border-b border-[#d7e9ef] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58c3de]">
                  Editando sección
                </p>
                <h2 className="mt-1 font-bold">{selected}</h2>
              </div>
              <span className="text-right text-[11px] text-[#667085]">
                {saveStatus}
              </span>
            </div>
            <div className="max-h-[calc(100vh-245px)] overflow-y-auto">
              <EditorFields
                content={selectedContent}
                onChange={updateField}
                onDiscard={() => {
                  setContent(createInitialContent(contentKey, sections));
                  setSaveStatus("Cambios descartados");
                }}
                onSave={saveChanges}
                previewType={previewType}
              />
            </div>
          </section>

          <section className="bg-[#eef5f7] p-5 sm:p-7">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58c3de]">
                  Vista previa en tiempo real
                </p>
                <h2 className="mt-1 font-bold">{selected}</h2>
              </div>
              <span className="rounded-lg border border-[#d7e9ef] bg-white px-3 py-2 text-xs text-[#667085]">
                Escritorio
              </span>
            </div>
            {previewType === "popup" ? (
              <PopupPreview content={selectedContent} section={selected} />
            ) : (
              <ClientPagePreview
                content={selectedContent}
                contentKey={contentKey}
                section={selected}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function EditorFields({
  content,
  previewType,
  onChange,
  onDiscard,
  onSave,
}: {
  content: SectionContent;
  previewType: "page" | "popup";
  onChange: (field: keyof SectionContent, value: string) => void;
  onDiscard: () => void;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-5 p-5">
      <RichTextEditor
        label="Título"
        minHeight="76px"
        onChange={(value) => onChange("title", value)}
        value={content.title}
      />
      <RichTextEditor
        label="Subtítulo"
        minHeight="86px"
        onChange={(value) => onChange("subtitle", value)}
        value={content.subtitle}
      />
      <RichTextEditor
        label="Contenido"
        minHeight="140px"
        onChange={(value) => onChange("content", value)}
        value={content.content}
      />
      <UploadGuide
        formats="JPG, PNG, WEBP"
        maxSize="Máximo 5 MB"
        recommended={
          previewType === "popup"
            ? "Recomendado: 1200 × 1200 px"
            : "Recomendado: 1920 × 1080 px"
        }
        title="Imagen de la sección"
      />
      <div className="grid grid-cols-2 gap-3">
        <button
          className="rounded-lg border border-[#d7e9ef] px-4 py-3 text-sm font-semibold text-[#667085]"
          onClick={onDiscard}
          type="button"
        >
          Descartar
        </button>
        <button
          className="rounded-lg bg-[#213255] px-4 py-3 text-sm font-semibold text-white"
          onClick={onSave}
          type="button"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

export function UploadGuide({
  title,
  recommended,
  maxSize,
  formats,
}: {
  title: string;
  recommended: string;
  maxSize: string;
  formats: string;
}) {
  return (
    <label className="block cursor-pointer rounded-lg border border-dashed border-[#9eddea] bg-[#f4fbfd] p-4">
      <span className="text-sm font-bold text-[#213255]">{title}</span>
      <span className="mt-2 block text-xs text-[#34466f]">{recommended}</span>
      <span className="mt-1 block text-xs text-[#667085]">
        {formats} · {maxSize}
      </span>
      <span className="mt-4 inline-flex rounded-md bg-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]">
        Seleccionar archivo
      </span>
      <input className="hidden" type="file" />
    </label>
  );
}

function RichPreview({ html, className }: { html: string; className: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function PopupPreview({
  section,
  content,
}: {
  section: string;
  content: SectionContent;
}) {
  return (
    <div className="grid min-h-[610px] place-items-center rounded-lg bg-[#213255]/65 p-7">
      <div className="grid w-full max-w-3xl overflow-hidden rounded-[24px] bg-white shadow-2xl md:grid-cols-2">
        <div className="grid min-h-72 place-items-center bg-[#eaf8fc] p-8 text-center text-sm text-[#667085]">
          Imagen 1200 × 1200 px
        </div>
        <div className="flex flex-col justify-center p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
            {section}
          </p>
          <RichPreview
            className="rich-preview mt-3 text-2xl font-bold"
            html={content.title}
          />
          <RichPreview
            className="rich-preview mt-3 text-sm text-[#34466f]"
            html={content.subtitle}
          />
          <RichPreview
            className="rich-preview mt-4 text-sm leading-6 text-[#667085]"
            html={content.content}
          />
          <button
            className="mt-6 w-fit rounded-lg bg-[#213255] px-5 py-3 text-sm font-bold text-white"
            type="button"
          >
            Botón principal
          </button>
        </div>
      </div>
    </div>
  );
}
