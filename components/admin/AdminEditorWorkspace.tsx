"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/admin/AdminDashboard";
import type { PreviewContent } from "@/components/admin/ClientPagePreview";
import { LiveClientPreview } from "@/components/admin/LiveClientPreview";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type EditorWorkspaceProps = {
  contentKey: string;
  title: string;
  description: string;
  sections: string[];
  previewType?: "page" | "popup";
};

type EditableField = "eyebrow" | "title" | "subtitle" | "content";

type SectionContent = PreviewContent & {
  editableFields?: EditableField[];
  allowItems?: boolean;
  allowButtons?: boolean;
  allowUpload?: boolean;
};

const homeDefaults: Record<string, Partial<SectionContent>> = {
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

const pageDefaults: Record<string, Record<string, Partial<SectionContent>>> = {
  inicio: homeDefaults,
  nosotros: {
    "Hero principal": {
      eyebrow: "Nosotros",
      title: "Equipo técnico dedicado a mantener equipos médicos operativos.",
      content:
        "VaicMedical trabaja en mantención y reparación de equipamiento médico, con foco en continuidad, diagnóstico claro y respuesta técnica para entornos de alta exigencia.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
    },
    "Contenedor interno": {
      eyebrow: "Valores",
      title: "VAIC como forma de trabajo.",
      content:
        "Nuestros valores ordenan la manera en que atendemos cada requerimiento técnico.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
      items: [
        createCard("mision", "Misión", "Recuperar y mantener equipos médicos críticos con respuesta técnica clara, trazable y orientada a la continuidad de la atención."),
        createCard("vision", "Visión", "Ser un aliado confiable para instituciones que necesitan equipos disponibles, procesos ordenados y soporte técnico oportuno."),
        createCard("vida", "Vida", "Trabajamos para preservar lo más valioso: la vida."),
        createCard("atencion", "Atención", "Escuchamos, entendemos y respondemos con excelencia."),
        createCard("innovacion", "Innovación", "Innovamos para anticipar y servir mejor."),
        createCard("cuidado", "Cuidado", "Cada detalle importa; cuidamos personas, procesos y equipos."),
      ],
    },
    "Llamado a servicios": {
      editableFields: [],
      buttons: [{ id: "services", label: "Conocer servicios", href: "/servicios", visible: true }],
    },
  },
  servicios: {
    "Hero principal": {
      eyebrow: "Servicios",
      title: "Mantención y reparación para equipos médicos de uso intensivo.",
      content:
        "Atendemos equipos esenciales para la operación diaria, con un enfoque práctico: diagnosticar, reparar, documentar y mantener continuidad.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
    },
    "Servicios técnicos": {
      editableFields: [],
      buttons: [],
      items: [
        createCard("preventiva", "Mantención preventiva", "Revisión programada, ajustes, limpieza técnica y control de condiciones para reducir fallas futuras."),
        createCard("correctiva", "Reparación correctiva", "Diagnóstico y reparación de camas clínicas, camillas, mesas quirúrgicas, lámparas y otros equipos."),
        createCard("soporte", "Soporte técnico", "Respuesta en terreno, evaluación de fallas, informes técnicos y coordinación de requerimientos."),
        createCard("monitores", "Monitores multiparámetros", "Revisión técnica, detección de fallas, recuperación operativa y recomendaciones de continuidad."),
        createCard("pabellon", "Equipos de pabellón", "Trabajo sobre mesas quirúrgicas, lámparas y componentes asociados a espacios de procedimiento."),
        createCard("gestion", "Gestión de requerimientos", "Ordenamiento de solicitudes, priorización por criticidad y seguimiento del estado de atención."),
      ],
    },
    "Método de trabajo": {
      eyebrow: "Método de trabajo",
      title: "Diagnóstico, ejecución y trazabilidad técnica.",
      editableFields: ["eyebrow", "title"],
      buttons: [],
      items: [
        createCard("solicitud", "Recibimos el requerimiento", "Clasificamos la criticidad.", ""),
        createCard("evaluacion", "Evaluamos el equipo", "Revisamos la falla y condiciones de operación.", ""),
        createCard("ejecucion", "Ejecutamos el trabajo", "Reparamos o mantenemos con informe de respaldo.", ""),
      ].map((item, index) => ({ ...item, number: `0${index + 1}` })),
    },
    "Llamado a contacto": {
      editableFields: [],
      buttons: [{ id: "contact", label: "Solicitar soporte", href: "/contacto", visible: true }],
    },
  },
  blog: {
    "Hero principal": {
      eyebrow: "Blog",
      title: "Noticias, criterios técnicos y recomendaciones de continuidad.",
      content:
        "Contenido para orientar la mantención, reparación y cuidado de equipos médicos de uso intensivo.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
    },
    "Listado de publicaciones": {
      editableFields: [],
      buttons: [],
      items: [
        createCard("post-1", "Señales de desgaste en camas clínicas", "Indicadores que conviene detectar antes de una falla crítica.", "/blog-article.svg"),
        createCard("post-2", "Mantención preventiva en camillas", "Puntos esenciales que conviene revisar.", "/blog-article.svg"),
        createCard("post-3", "Cómo documentar reparaciones", "Información útil para mejorar continuidad técnica.", "/blog-article.svg"),
      ],
    },
  },
  catalogo: {
    "Hero principal": {
      eyebrow: "Catálogo",
      title: "Líneas y productos para organizar solicitudes técnicas.",
      content:
        "Una vista inicial para ordenar equipos, repuestos y servicios por línea.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
    },
    "Navegación de líneas": {
      editableFields: [],
      buttons: [],
      items: [
        createCard("linea-1", "Camas clínicas y camillas", "Equipos de traslado y hospitalización."),
        createCard("linea-2", "Pabellón y procedimientos", "Equipos utilizados en pabellón."),
        createCard("linea-3", "Monitoreo y equipos clínicos", "Equipos de monitoreo y apoyo clínico."),
        createCard("linea-4", "Componentes y accesorios", "Repuestos y componentes para continuidad técnica."),
      ],
    },
    "Línea 01": {
      eyebrow: "Línea 01",
      title: "Camas clínicas y camillas",
      content: "Equipos de traslado y hospitalización.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
      items: [
        createCard("producto-1", "Camas clínicas eléctricas", "Revisión de actuadores, controles y estructura."),
        createCard("producto-2", "Camillas de traslado", "Mantención de ruedas, frenos y barandas."),
        createCard("producto-3", "Barandas y accesorios", "Componentes asociados a seguridad y operación."),
      ],
    },
    "Línea 02": {
      eyebrow: "Línea 02",
      title: "Pabellón y procedimientos",
      content: "Equipos utilizados en pabellón y espacios de procedimiento.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
      items: [
        createCard("producto-1", "Mesas quirúrgicas", "Diagnóstico de movimientos, bases y módulos."),
        createCard("producto-2", "Lámparas clínicas", "Revisión de iluminación, brazos y fijaciones."),
      ],
    },
    "Línea 03": {
      eyebrow: "Línea 03",
      title: "Monitoreo y equipos clínicos",
      content: "Equipos de monitoreo y apoyo clínico.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
      items: [
        createCard("producto-1", "Monitores multiparámetros", "Evaluación de funcionamiento y accesorios."),
        createCard("producto-2", "Módulos y cables", "Revisión de conectividad y componentes asociados."),
      ],
    },
    "Línea 04": {
      eyebrow: "Línea 04",
      title: "Componentes y accesorios",
      content: "Repuestos y componentes para continuidad técnica.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
      items: [
        createCard("producto-1", "Actuadores y motores", "Componentes para movimientos eléctricos."),
        createCard("producto-2", "Controles y fuentes", "Elementos de control y alimentación."),
      ],
    },
  },
  contacto: {
    "Hero principal": {
      eyebrow: "Contacto",
      title: "Coordinemos una evaluación técnica para tus equipos.",
      content:
        "Puedes solicitar una visita, coordinar una reparación o consultar por mantenciones programadas.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
    },
    "Información de contacto": {
      editableFields: [],
      buttons: [],
      items: [
        createCard("correo", "Correo", "contacto@vaicmedical.cl"),
        createCard("cobertura", "Cobertura", "Atención en terreno según coordinación."),
        createCard("respuesta", "Respuesta", "Priorización según criticidad del equipo."),
        createCard("especialidad", "Especialidad", "Mantención y reparación de equipos médicos."),
      ],
    },
    Formulario: {
      title: "Formulario de contacto",
      content:
        "Campos para nombre, correo, teléfono, institución, mensaje y envío de solicitud.",
      editableFields: ["title", "content"],
      buttons: [{ id: "send", label: "Enviar solicitud", href: "/contacto", visible: true }],
    },
  },
};

const defaultSteps = [
  {
    id: "solicitud",
    number: "01",
    title: "Solicitud",
    text: "Recibimos el requerimiento y clasificamos la criticidad.",
    visible: true,
    backgroundColor: "#213255",
    borderColor: "#213255",
    textColor: "#ffffff",
    image: "",
  },
  {
    id: "diagnostico",
    number: "02",
    title: "Diagnóstico",
    text: "Evaluamos la falla, el estado del equipo y sus condiciones de uso.",
    visible: true,
    backgroundColor: "#213255",
    borderColor: "#213255",
    textColor: "#ffffff",
    image: "",
  },
  {
    id: "reparacion",
    number: "03",
    title: "Reparación",
    text: "Ejecutamos mantención o reparación con criterio técnico.",
    visible: true,
    backgroundColor: "#213255",
    borderColor: "#213255",
    textColor: "#ffffff",
    image: "",
  },
  {
    id: "informe",
    number: "04",
    title: "Informe",
    text: "Documentamos el trabajo realizado y las recomendaciones.",
    visible: true,
    backgroundColor: "#213255",
    borderColor: "#213255",
    textColor: "#ffffff",
    image: "",
  },
];

const repeatableDefaults: Record<string, SectionContent["items"]> = {
  Nosotros: [
    createCard("mision", "Misión", "Recuperar y mantener equipos médicos críticos con respuesta técnica clara y trazable."),
    createCard("vision", "Visión", "Ser un aliado confiable para instituciones que necesitan continuidad operativa."),
    createCard("valores", "Valores", "Rigor técnico, responsabilidad, orden documental y compromiso."),
  ],
  "Productos destacados": [
    createCard("camas", "Camas clínicas", "Mantención y reparación de equipos clínicos.", "/service-maintenance.svg"),
    createCard("mesas", "Mesas quirúrgicas", "Diagnóstico y recuperación operativa.", "/service-maintenance.svg"),
    createCard("monitores", "Monitores multiparámetros", "Revisión técnica y reparación.", "/medical-dashboard.svg"),
    createCard("actuadores", "Actuadores y motores", "Componentes y soporte técnico.", "/service-maintenance.svg"),
  ],
  "Noticias destacadas": [
    createCard("noticia-1", "Señales de desgaste en camas clínicas", "Indicadores que conviene detectar antes de una falla crítica.", "/blog-article.svg"),
    createCard("noticia-2", "Mantención preventiva en camillas", "Puntos esenciales que conviene revisar.", "/blog-article.svg"),
    createCard("noticia-3", "Cómo documentar reparaciones", "Información útil para mejorar continuidad técnica.", "/blog-article.svg"),
  ],
  Misión: [createCard("mision", "Misión", "Recuperar y mantener equipos médicos críticos con respuesta técnica clara y trazable.")],
  Visión: [createCard("vision", "Visión", "Ser un aliado confiable para instituciones que necesitan continuidad operativa.")],
  "Valores VAIC": [
    createCard("vida", "Vida", "Trabajamos para preservar lo más valioso: la vida."),
    createCard("atencion", "Atención", "Escuchamos, entendemos y respondemos con excelencia."),
    createCard("innovacion", "Innovación", "Innovamos para anticipar y servir mejor."),
    createCard("cuidado", "Cuidado", "Cada detalle importa; cuidamos personas, procesos y equipos."),
  ],
  "Mantención preventiva": [createCard("preventiva", "Mantención preventiva", "Revisión programada, ajustes, limpieza técnica y control de condiciones.")],
  "Reparación correctiva": [createCard("correctiva", "Reparación correctiva", "Diagnóstico y reparación de equipos médicos.")],
  "Soporte técnico": [createCard("soporte", "Soporte técnico", "Respuesta en terreno, evaluación de fallas e informes técnicos.")],
  "Listado de publicaciones": [
    createCard("post-1", "Publicación técnica", "Breve reseña de la publicación.", "/blog-article.svg"),
    createCard("post-2", "Noticia VaicMedical", "Breve reseña de la noticia.", "/blog-article.svg"),
    createCard("post-3", "Artículo especializado", "Breve reseña del artículo.", "/blog-article.svg"),
  ],
  "Navegación de líneas": [
    createCard("linea-1", "Camas clínicas y camillas", "Equipos de traslado y hospitalización."),
    createCard("linea-2", "Pabellón y procedimientos", "Equipos utilizados en pabellón."),
    createCard("linea-3", "Monitoreo y equipos clínicos", "Equipos de monitoreo y apoyo clínico."),
  ],
  "Bloques de líneas": [
    createCard("linea-1", "Camas clínicas y camillas", "Equipos de traslado y hospitalización."),
    createCard("linea-2", "Pabellón y procedimientos", "Equipos utilizados en pabellón."),
  ],
  "Tarjetas de productos": [
    createCard("producto-1", "Camas clínicas eléctricas", "Revisión de actuadores y controles.", "/service-maintenance.svg"),
    createCard("producto-2", "Mesas quirúrgicas", "Diagnóstico de movimientos y módulos.", "/service-maintenance.svg"),
    createCard("producto-3", "Monitores multiparámetros", "Evaluación de funcionamiento y accesorios.", "/medical-dashboard.svg"),
  ],
  "Grilla de productos": [
    createCard("producto-1", "Producto de la línea", "Descripción corta del producto.", "/service-maintenance.svg"),
    createCard("producto-2", "Producto de la línea", "Descripción corta del producto.", "/service-maintenance.svg"),
  ],
  "Productos relacionados": [
    createCard("relacionado-1", "Producto relacionado", "Modelo según equipo.", "/service-maintenance.svg"),
    createCard("relacionado-2", "Producto relacionado", "Modelo según equipo.", "/service-maintenance.svg"),
  ],
};

function createCard(id: string, title: string, text: string, image = "") {
  return {
    id,
    number: "",
    title,
    text,
    visible: true,
    backgroundColor: "#ffffff",
    borderColor: "#d7e9ef",
    textColor: "#213255",
    image,
  };
}

function completeSection(section: string, value: Partial<SectionContent>): SectionContent {
  const isMethod = section === "Método de trabajo";
  const editableFields = value.editableFields ?? ["title", "subtitle", "content"];
  return {
    title: value.title || `<strong>${section}</strong>`,
    subtitle: value.subtitle || "Texto secundario de la sección",
    content: value.content || "Contenido editable de esta sección.",
    visible: value.visible ?? true,
    eyebrow: value.eyebrow ?? (isMethod ? "" : section),
    shape: value.shape || (isMethod ? "arrow" : "rounded"),
    customShapeImage: value.customShapeImage || "",
    backgroundColor: value.backgroundColor || "#f6fbfd",
    itemColor: value.itemColor || "#213255",
    accentColor: value.accentColor || "#58c3de",
    textColor: value.textColor || "#ffffff",
    columns: value.columns || 4,
    buttons:
      value.buttons ??
      (isMethod
        ? []
        : [
            { id: "primary", label: "Botón principal", href: "/", visible: true },
            { id: "secondary", label: "Botón secundario", href: "/", visible: true },
          ]),
    items: normalizeItems(
      value.items || (isMethod ? defaultSteps : repeatableDefaults[section] || []),
    ),
    editableFields,
    allowItems: value.allowItems ?? true,
    allowButtons: value.allowButtons ?? true,
    allowUpload: value.allowUpload ?? true,
  };
}

function normalizeItems(items: SectionContent["items"]) {
  return items.map((item) => ({
    ...item,
    backgroundColor: item.backgroundColor || "#ffffff",
    borderColor: item.borderColor || "#d7e9ef",
    textColor: item.textColor || "#213255",
    image: item.image || "",
  }));
}

function createInitialContent(contentKey: string, sections: string[]) {
  const defaults = pageDefaults[contentKey] || {};
  return Object.fromEntries(
    sections.map((section) => [
      section,
      completeSection(
        section,
        defaults[section]
          ? {
              ...defaults[section],
              eyebrow:
                defaults[section].eyebrow ??
                (section === "Método de trabajo"
                  ? ""
                  : section === "Productos destacados"
                  ? "Catálogo"
                  : section === "Noticias destacadas"
                    ? "Blog"
                    : section),
              buttons:
                defaults[section].buttons ??
                (section === "Método de trabajo"
                  ? []
                  : section === "Hero principal"
                  ? [
                      { id: "support", label: "Solicitar soporte", href: "/contacto", visible: true },
                      { id: "services", label: "Ver servicios", href: "/servicios", visible: true },
                    ]
                  : [
                      { id: "primary", label: section === "Servicios" ? "Ver servicios" : "Conocer más", href: "/", visible: true },
                    ]),
            }
          : {
            title: `<strong>${section}</strong>`,
            subtitle: "Texto secundario de la sección",
            content:
              "Contenido editable de esta sección. Los cambios y formatos aparecen inmediatamente en la vista previa.",
          },
      ),
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
          setContent((current) => {
            const stored = result.content as Record<string, Partial<SectionContent>>;
            return Object.fromEntries(
              sections.map((section) => [
                section,
                completeSection(section, { ...current[section], ...stored[section] }),
              ]),
            );
          });
        }
      })
      .catch(() => undefined);
  }, [contentKey, sections]);

  const selectedContent = content[selected];

  function updateField(field: EditableField, value: string) {
    setContent((current) => ({
      ...current,
      [selected]: { ...current[selected], [field]: value },
    }));
    setSaveStatus("Cambios sin guardar");
  }

  function updateSection(changes: Partial<SectionContent>) {
    setContent((current) => ({
      ...current,
      [selected]: { ...current[selected], ...changes },
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
                onUpdate={updateSection}
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
              <LiveClientPreview
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
  onUpdate,
  onDiscard,
  onSave,
}: {
  content: SectionContent;
  previewType: "page" | "popup";
  onChange: (field: EditableField, value: string) => void;
  onUpdate: (changes: Partial<SectionContent>) => void;
  onDiscard: () => void;
  onSave: () => void;
}) {
  const isWorkflow =
    content.items.length > 0 && content.items.every((item) => Boolean(item.number));
  const fields = content.editableFields ?? ["title", "subtitle", "content"];

  return (
    <div className="grid gap-5 p-5">
      <VisibilityControl content={content} onUpdate={onUpdate} />
      {fields.length > 0 && (
        <>
          {fields.includes("eyebrow") && (
            <RichTextEditor
              label="Etiqueta"
              minHeight="62px"
              onChange={(value) => onChange("eyebrow", value)}
              value={content.eyebrow}
            />
          )}
          {fields.includes("title") && (
            <RichTextEditor
              label="Título"
              minHeight="76px"
              onChange={(value) => onChange("title", value)}
              value={content.title}
            />
          )}
          {fields.includes("subtitle") && (
            <RichTextEditor
              label="Subtítulo"
              minHeight="86px"
              onChange={(value) => onChange("subtitle", value)}
              value={content.subtitle}
            />
          )}
          {fields.includes("content") && (
            <RichTextEditor
              label="Texto"
              minHeight="140px"
              onChange={(value) => onChange("content", value)}
              value={content.content}
            />
          )}
        </>
      )}
      <AppearanceControls content={content} onUpdate={onUpdate} />
      {content.allowItems !== false && content.items.length > 0 && (
        <RepeatableItemsEditor content={content} onUpdate={onUpdate} />
      )}
      {content.allowButtons !== false && content.buttons.length > 0 && (
        <ButtonsEditor content={content} onUpdate={onUpdate} />
      )}
      {content.allowUpload !== false && !isWorkflow && (
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
      )}
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

function VisibilityControl({
  content,
  onUpdate,
}: {
  content: SectionContent;
  onUpdate: (changes: Partial<SectionContent>) => void;
}) {
  return (
    <div className="rounded-lg border border-[#d7e9ef] bg-[#f7fafb] p-4">
      <label className="flex items-center justify-between gap-3 text-xs font-semibold">
        Mostrar sección al cliente
        <input
          checked={content.visible}
          className="h-4 w-4 accent-[#58c3de]"
          onChange={(event) => onUpdate({ visible: event.target.checked })}
          type="checkbox"
        />
      </label>
    </div>
  );
}

function AppearanceControls({
  content,
  onUpdate,
}: {
  content: SectionContent;
  onUpdate: (changes: Partial<SectionContent>) => void;
}) {
  return (
    <div className="grid gap-4 rounded-lg border border-[#d7e9ef] bg-[#f7fafb] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#58c3de]">
        Apariencia
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ColorInput label="Fondo" value={content.backgroundColor} onChange={(backgroundColor) => onUpdate({ backgroundColor })} />
        <ColorInput label="Acento" value={content.accentColor} onChange={(accentColor) => onUpdate({ accentColor })} />
      </div>
      {content.items.length > 0 && (
        <>
          <label className="text-xs font-semibold text-[#34466f]">
            Forma de los elementos
            <select
              className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3"
              onChange={(event) => onUpdate({ shape: event.target.value as SectionContent["shape"] })}
              value={content.shape}
            >
              <option value="arrow">Flechas de proyecto</option>
              <option value="rectangle">Rectángulos</option>
              <option value="rounded">Tarjetas redondeadas</option>
              <option value="circle">Círculos</option>
              <option value="hexagon">Hexágonos</option>
              <option value="custom">Cargar figura</option>
            </select>
          </label>
          {content.shape === "custom" && (
            <label className="rounded-lg border border-dashed border-[#9eddea] bg-white p-3 text-xs font-semibold text-[#34466f]">
              Figura personalizada
              <span className="mt-1 block font-normal text-[#667085]">
                PNG, WEBP o SVG transparente · 800 × 800 px · máximo 2 MB
              </span>
              <input
                accept="image/png,image/webp,image/svg+xml"
                className="mt-3 block w-full text-xs"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () =>
                    onUpdate({ customShapeImage: String(reader.result || "") });
                  reader.readAsDataURL(file);
                }}
                type="file"
              />
            </label>
          )}
          <div className="grid grid-cols-2 gap-3">
            <ColorInput label="Color forma" value={content.itemColor} onChange={(itemColor) => onUpdate({ itemColor })} />
            <ColorInput label="Color texto" value={content.textColor} onChange={(textColor) => onUpdate({ textColor })} />
          </div>
          <label className="text-xs font-semibold text-[#34466f]">
            Columnas
            <input
              className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] px-3"
              max={6}
              min={1}
              onChange={(event) => onUpdate({ columns: Number(event.target.value) })}
              type="number"
              value={content.columns}
            />
          </label>
        </>
      )}
    </div>
  );
}

function RepeatableItemsEditor({
  content,
  onUpdate,
}: {
  content: SectionContent;
  onUpdate: (changes: Partial<SectionContent>) => void;
}) {
  function updateItem(index: number, changes: Partial<SectionContent["items"][number]>) {
    onUpdate({
      items: content.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item,
      ),
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= content.items.length) return;
    const items = [...content.items];
    [items[index], items[target]] = [items[target], items[index]];
    onUpdate({ items });
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#58c3de]">
          Elementos de la sección
        </p>
        <button
          className="rounded-md bg-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]"
          onClick={() =>
            onUpdate({
              items: [
                ...content.items,
                {
                  id: `item-${Date.now()}`,
                  number: String(content.items.length + 1).padStart(2, "0"),
                  title: "Nuevo paso",
                  text: "Descripción del nuevo paso.",
                  visible: true,
                  backgroundColor: content.itemColor,
                  borderColor: content.accentColor,
                  textColor: content.textColor,
                  image: "",
                },
              ],
            })
          }
          type="button"
        >
          Agregar elemento
        </button>
      </div>
      {content.items.map((item, index) => (
        <details className="rounded-lg border border-[#d7e9ef] p-3" key={item.id} open={index === 0}>
          <summary className="cursor-pointer text-sm font-semibold">
            {item.number} · {stripHtml(item.title)}
          </summary>
          <div className="mt-4 grid gap-4">
            <div className="flex gap-2">
              <button className="rounded border px-2 py-1 text-xs" onClick={() => move(index, -1)} type="button">Subir</button>
              <button className="rounded border px-2 py-1 text-xs" onClick={() => move(index, 1)} type="button">Bajar</button>
              <button
                className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                onClick={() => onUpdate({ items: content.items.filter((_, itemIndex) => itemIndex !== index) })}
                type="button"
              >
                Eliminar
              </button>
              <label className="ml-auto flex items-center gap-2 text-xs">
                Visible
                <input checked={item.visible} onChange={(event) => updateItem(index, { visible: event.target.checked })} type="checkbox" />
              </label>
            </div>
            <TextInput label="Número" value={item.number} onChange={(number) => updateItem(index, { number })} />
            <RichTextEditor label="Título del elemento" minHeight="65px" value={item.title} onChange={(title) => updateItem(index, { title })} />
            <RichTextEditor label="Texto del elemento" minHeight="90px" value={item.text} onChange={(text) => updateItem(index, { text })} />
            <div className="grid grid-cols-3 gap-2">
              <ColorInput label="Fondo caja" value={item.backgroundColor} onChange={(backgroundColor) => updateItem(index, { backgroundColor })} />
              <ColorInput label="Borde caja" value={item.borderColor} onChange={(borderColor) => updateItem(index, { borderColor })} />
              <ColorInput label="Texto caja" value={item.textColor} onChange={(textColor) => updateItem(index, { textColor })} />
            </div>
            <label className="text-xs font-semibold text-[#34466f]">
              Imagen de la caja
              <input
                accept="image/*"
                className="mt-2 block w-full text-xs"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => updateItem(index, { image: String(reader.result || "") });
                  reader.readAsDataURL(file);
                }}
                type="file"
              />
            </label>
          </div>
        </details>
      ))}
    </div>
  );
}

function ButtonsEditor({ content, onUpdate }: { content: SectionContent; onUpdate: (changes: Partial<SectionContent>) => void }) {
  return (
    <div className="grid gap-3 rounded-lg border border-[#d7e9ef] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#58c3de]">Botones</p>
      {content.buttons.map((button, index) => (
        <div className="grid gap-3 rounded-lg bg-[#f7fafb] p-3" key={button.id}>
          <label className="flex justify-between text-xs font-semibold">
            Mostrar botón
            <input
              checked={button.visible}
              onChange={(event) => onUpdate({ buttons: content.buttons.map((item, itemIndex) => itemIndex === index ? { ...item, visible: event.target.checked } : item) })}
              type="checkbox"
            />
          </label>
          <TextInput label="Nombre del botón" value={button.label} onChange={(label) => onUpdate({ buttons: content.buttons.map((item, itemIndex) => itemIndex === index ? { ...item, label } : item) })} />
          <label className="text-xs font-semibold text-[#34466f]">
            Enlace del botón
            <select
              className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3"
              onChange={(event) => onUpdate({ buttons: content.buttons.map((item, itemIndex) => itemIndex === index ? { ...item, href: event.target.value } : item) })}
              value={button.href}
            >
              {linkOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ))}
    </div>
  );
}

const linkOptions = [
  { label: "Inicio", value: "/" },
  { label: "Inicio · Hero principal", value: "/#hero" },
  { label: "Inicio · Método de trabajo", value: "/#metodo" },
  { label: "Inicio · Nosotros", value: "/#nosotros" },
  { label: "Inicio · Servicios", value: "/#servicios" },
  { label: "Inicio · Productos destacados", value: "/#catalogo" },
  { label: "Inicio · Noticias destacadas", value: "/#blog" },
  { label: "Inicio · Contacto", value: "/#contacto" },
  { label: "Página Nosotros", value: "/nosotros" },
  { label: "Página Servicios", value: "/servicios" },
  { label: "Página Blog", value: "/blog" },
  { label: "Página Catálogo", value: "/catalogo" },
  { label: "Página Contacto", value: "/contacto" },
];

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-semibold text-[#34466f]">
      {label}
      <input className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3" onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-semibold text-[#34466f]">
      {label}
      <select
        className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3"
        onChange={(event) => onChange(event.target.value)}
        value={vaicColorOptions.some((option) => option.value === value) ? value : "#213255"}
      >
        {vaicColorOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const vaicColorOptions = [
  { label: "Azul VaicMedical", value: "#213255" },
  { label: "Azul medio", value: "#34466f" },
  { label: "Azul profundo", value: "#17243f" },
  { label: "Celeste VaicMedical", value: "#58c3de" },
  { label: "Celeste suave", value: "#eaf8fc" },
  { label: "Celeste muy suave", value: "#f6fbfd" },
  { label: "Borde celeste", value: "#d7e9ef" },
  { label: "Blanco de soporte", value: "#ffffff" },
];

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "");
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
