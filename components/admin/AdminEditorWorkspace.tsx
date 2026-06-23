"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/admin/AdminDashboard";
import type { PreviewContent } from "@/components/admin/ClientPagePreview";
import { LiveClientPreview } from "@/components/admin/LiveClientPreview";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { uploadAdminImage } from "@/components/admin/upload-image";
import { useVisualPalette } from "@/components/admin/use-visual-palette";

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
  allowElementAppearance?: boolean;
  allowButtons?: boolean;
  allowUpload?: boolean;
};

const homeDefaults: Record<string, Partial<SectionContent>> = {
  "Hero principal": {
    title: "Soporte tÃ©cnico para mantener operativa la atenciÃ³n en salud.",
    subtitle: "MantenciÃ³n y reparaciÃ³n de equipos mÃ©dicos",
    content:
      "Reparamos y mantenemos camas clÃ­nicas, camillas, mesas quirÃºrgicas, lÃ¡mparas, monitores multiparÃ¡metros y otros equipos esenciales para la continuidad asistencial.",
  },
  "MÃ©todo de trabajo": {
    title: "Solicitud, diagnÃ³stico, reparaciÃ³n e informe.",
    subtitle: "MÃ©todo de trabajo",
    content:
      "Recibimos el requerimiento y clasificamos la criticidad para iniciar una atenciÃ³n tÃ©cnica ordenada.",
  },
  Nosotros: {
    title: "Trabajo tÃ©cnico para equipos que no pueden quedar fuera de servicio.",
    subtitle:
      "Recuperar y mantener equipos mÃ©dicos crÃ­ticos con respuesta tÃ©cnica clara y trazable.",
    content:
      "VaicMedical se enfoca en diagnosticar, reparar y mantener equipos mÃ©dicos de uso intensivo. Nuestro trabajo combina coordinaciÃ³n, criterio tÃ©cnico y documentaciÃ³n.",
  },
  Servicios: {
    title:
      "MantenciÃ³n preventiva, reparaciÃ³n correctiva y soporte en terreno.",
    subtitle: "Servicios",
    content:
      "Atendemos equipos esenciales para la operaciÃ³n diaria, con foco en recuperar disponibilidad y reducir tiempos fuera de servicio.",
  },
  "Productos destacados": {
    title: "CategorÃ­as para ordenar equipos, repuestos y solicitudes tÃ©cnicas.",
    subtitle: "Productos y lÃ­neas destacadas",
    content:
      "Revisa una selecciÃ³n de equipos, componentes y servicios tÃ©cnicos. Cada producto cuenta con informaciÃ³n, galerÃ­a y acceso directo para realizar consultas.",
    allowItems: false,
    items: [],
  },
  "Noticias destacadas": {
    title: "Criterios tÃ©cnicos para cuidar equipos mÃ©dicos.",
    subtitle: "Noticias y artÃ­culos tÃ©cnicos",
    content:
      "Publicaciones sobre mantenciÃ³n, reparaciÃ³n y continuidad tÃ©cnica de equipos mÃ©dicos.",
    editableFields: ["title"],
    allowItems: false,
    items: [],
  },
  Contacto: {
    title: "Coordinemos una evaluaciÃ³n tÃ©cnica para tus equipos.",
    subtitle: "Contacto",
    content:
      "Puedes solicitar una visita, coordinar una reparaciÃ³n o consultar por mantenciones programadas.",
    itemColor: "#213255",
    accentColor: "#58c3de",
    textColor: "#ffffff",
    columns: 4,
    buttons: [{ id: "support", label: "Solicitar soporte", href: "/contacto", visible: true }],
    items: [
      createCard("canal-directo", "Canal directo", "contacto@vaicmedical.cl"),
    ],
  },
};

const pageDefaults: Record<string, Record<string, Partial<SectionContent>>> = {
  inicio: homeDefaults,
  nosotros: {
    "Hero principal": {
      eyebrow: "Nosotros",
      title: "Equipo tÃ©cnico dedicado a mantener equipos mÃ©dicos operativos.",
      content:
        "VaicMedical trabaja en mantenciÃ³n y reparaciÃ³n de equipamiento mÃ©dico, con foco en continuidad, diagnÃ³stico claro y respuesta tÃ©cnica para entornos de alta exigencia.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
    },
    "MisiÃ³n": {
      editableFields: [],
      buttons: [],
      items: [
        createCard("mision", "MisiÃ³n", "Recuperar y mantener equipos mÃ©dicos crÃ­ticos con respuesta tÃ©cnica clara, trazable y orientada a la continuidad de la atenciÃ³n."),
      ],
    },
    "VisiÃ³n": {
      editableFields: [],
      buttons: [],
      items: [
        createCard("vision", "VisiÃ³n", "Ser un aliado confiable para instituciones que necesitan equipos disponibles, procesos ordenados y soporte tÃ©cnico oportuno."),
      ],
    },
    Valores: {
      eyebrow: "Valores",
      title: "VAIC como forma de trabajo.",
      content:
        "Nuestros valores ordenan la manera en que atendemos cada requerimiento tÃ©cnico.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
      items: [
        createCard("vida", "Vida", "Trabajamos para preservar lo mÃ¡s valioso: la vida."),
        createCard("atencion", "AtenciÃ³n", "Escuchamos, entendemos y respondemos con excelencia."),
        createCard("innovacion", "InnovaciÃ³n", "Innovamos para anticipar y servir mejor."),
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
      title: "MantenciÃ³n y reparaciÃ³n para equipos mÃ©dicos de uso intensivo.",
      content:
        "Atendemos equipos esenciales para la operaciÃ³n diaria, con un enfoque prÃ¡ctico: diagnosticar, reparar, documentar y mantener continuidad.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
    },
    "Servicios tÃ©cnicos": {
      editableFields: [],
      buttons: [],
      items: [
        createCard("preventiva", "MantenciÃ³n preventiva", "RevisiÃ³n programada, ajustes, limpieza tÃ©cnica y control de condiciones para reducir fallas futuras."),
        createCard("correctiva", "ReparaciÃ³n correctiva", "DiagnÃ³stico y reparaciÃ³n de camas clÃ­nicas, camillas, mesas quirÃºrgicas, lÃ¡mparas y otros equipos."),
        createCard("soporte", "Soporte tÃ©cnico", "Respuesta en terreno, evaluaciÃ³n de fallas, informes tÃ©cnicos y coordinaciÃ³n de requerimientos."),
        createCard("monitores", "Monitores multiparÃ¡metros", "RevisiÃ³n tÃ©cnica, detecciÃ³n de fallas, recuperaciÃ³n operativa y recomendaciones de continuidad."),
        createCard("pabellon", "Equipos de pabellÃ³n", "Trabajo sobre mesas quirÃºrgicas, lÃ¡mparas y componentes asociados a espacios de procedimiento."),
        createCard("gestion", "GestiÃ³n de requerimientos", "Ordenamiento de solicitudes, priorizaciÃ³n por criticidad y seguimiento del estado de atenciÃ³n."),
      ],
    },
    "MÃ©todo de trabajo": {
      eyebrow: "MÃ©todo de trabajo",
      title: "DiagnÃ³stico, ejecuciÃ³n y trazabilidad tÃ©cnica.",
      editableFields: ["eyebrow", "title"],
      buttons: [],
      items: [
        createCard("solicitud", "Recibimos el requerimiento", "Clasificamos la criticidad.", ""),
        createCard("evaluacion", "Evaluamos el equipo", "Revisamos la falla y condiciones de operaciÃ³n.", ""),
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
      title: "Noticias, criterios tÃ©cnicos y recomendaciones de continuidad.",
      content:
        "Contenido para orientar la mantenciÃ³n, reparaciÃ³n y cuidado de equipos mÃ©dicos de uso intensivo.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
    },
    "Listado de publicaciones": {
      editableFields: [],
      allowItems: false,
      buttons: [],
      items: [],
    },
  },
  catalogo: {
    "Hero principal": {
      eyebrow: "CatÃ¡logo",
      title: "LÃ­neas y productos para organizar solicitudes tÃ©cnicas.",
      content:
        "Una vista inicial para ordenar equipos, repuestos y servicios por lÃ­nea.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
    },
    "NavegaciÃ³n de lÃ­neas": {
      title: "Líneas de productos",
      editableFields: ["title"],
      allowElementAppearance: true,
      buttons: [],
      backgroundColor: "#ffffff",
      itemColor: "#ffffff",
      accentColor: "#58c3de",
      textColor: "#213255",
      items: [
        createCard("linea-1", "Camas clÃ­nicas y camillas", "Equipos de traslado y hospitalizaciÃ³n."),
        createCard("linea-2", "PabellÃ³n y procedimientos", "Equipos utilizados en pabellÃ³n."),
        createCard("linea-3", "Monitoreo y equipos clÃ­nicos", "Equipos de monitoreo y apoyo clÃ­nico."),
        createCard("linea-4", "Componentes y accesorios", "Repuestos y componentes para continuidad tÃ©cnica."),
      ],
    },
    "Vista de lÃ­nea": {
      eyebrow: "Línea seleccionada",
      title: "Camas clínicas y camillas",
      content: "Equipos de traslado y hospitalización.",
      editableFields: ["eyebrow"],
      allowElementAppearance: true,
      buttons: [],
      backgroundColor: "transparent",
      itemColor: "#ffffff",
      accentColor: "#d7e9ef",
      textColor: "#213255",
      items: [
        createCard("producto-1", "Camas clÃ­nicas elÃ©ctricas", "RevisiÃ³n de actuadores, controles y estructura."),
        createCard("producto-2", "Camillas de traslado", "MantenciÃ³n de ruedas, frenos y barandas."),
        createCard("producto-3", "Barandas y accesorios", "Componentes asociados a seguridad y operaciÃ³n."),
      ],
    },
  },
  contacto: {
    "Hero principal": {
      eyebrow: "Contacto",
      title: "Coordinemos una evaluaciÃ³n tÃ©cnica para tus equipos.",
      content:
        "Puedes solicitar una visita, coordinar una reparaciÃ³n o consultar por mantenciones programadas.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [],
    },
    "InformaciÃ³n de contacto": {
      editableFields: [],
      buttons: [],
      items: [
        createCard("correo", "Correo", "contacto@vaicmedical.cl"),
        createCard("cobertura", "Cobertura", "AtenciÃ³n en terreno segÃºn coordinaciÃ³n."),
        createCard("respuesta", "Respuesta", "PriorizaciÃ³n segÃºn criticidad del equipo."),
        createCard("especialidad", "Especialidad", "MantenciÃ³n y reparaciÃ³n de equipos mÃ©dicos."),
      ],
    },
    Formulario: {
      title: "Formulario de contacto",
      content:
        "Completa los datos para coordinar tu solicitud.",
      editableFields: ["title", "content"],
      buttons: [{ id: "send", label: "Enviar solicitud", href: "/contacto", visible: true }],
      items: [
        createCard("nombre", "Nombre", "Nombre completo"),
        createCard("correo", "Correo", "correo@institucion.cl"),
        createCard("telefono", "TelÃ©fono", "+56 9..."),
        createCard("institucion", "InstituciÃ³n", "Hospital, clÃ­nica o empresa"),
        createCard("asunto", "Asunto", "Ej: ReparaciÃ³n de cama clÃ­nica"),
        createCard("tipo", "Tipo de solicitud", "Seleccionar"),
        createCard("mensaje", "Mensaje", "Describe la falla, mantenciÃ³n requerida o antecedentes relevantes."),
      ],
    },
  },
  "catalogo-productos-vista": {
    "GalerÃ­a": { editableFields: [], allowItems: false, allowElementAppearance: true, allowButtons: false, allowUpload: false },
    "InformaciÃ³n tÃ©cnica": {
      content: "La disponibilidad y alcance del producto se confirman despu\u00e9s de revisar el requerimiento y la documentaci\u00f3n disponible.",
      editableFields: ["content"],
      allowItems: false,
      allowElementAppearance: true,
      allowButtons: false,
      allowUpload: false,
    },
    "DescripciÃ³n": { editableFields: [], allowItems: false, allowElementAppearance: true, allowButtons: false, allowUpload: false },
    "DocumentaciÃ³n": { editableFields: [], allowItems: false, allowElementAppearance: true, allowButtons: false, allowUpload: false },
    "Productos relacionados": {
      title: "Productos relacionados",
      content: "Productos de la misma línea.",
      editableFields: ["title", "content"],
      allowItems: true,
      allowElementAppearance: true,
      allowButtons: false,
      allowUpload: false,
      backgroundColor: "transparent",
      itemColor: "#ffffff",
      accentColor: "#d7e9ef",
      textColor: "#213255",
      columns: 3,
    },
  },
  "ventana-emergente": {
    "ConfiguraciÃ³n": {
      eyebrow: "Soporte t\u00e9cnico VaicMedical",
      title: "\u00bfNecesitas evaluar o reparar un equipo m\u00e9dico?",
      content: "Coordinamos diagn\u00f3stico, mantenci\u00f3n y reparaci\u00f3n de equipos cl\u00ednicos, con seguimiento t\u00e9cnico y documentaci\u00f3n de cada intervenci\u00f3n.",
      editableFields: ["eyebrow", "title", "content"],
      buttons: [{ id: "popup-main", label: "Solicitar evaluaci\u00f3n", href: "/contacto", visible: true }],
      allowItems: false,
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
    numberColor: "#58c3de",
    image: "",
  },
  {
    id: "diagnostico",
    number: "02",
    title: "DiagnÃ³stico",
    text: "Evaluamos la falla, el estado del equipo y sus condiciones de uso.",
    visible: true,
    backgroundColor: "#213255",
    borderColor: "#213255",
    textColor: "#ffffff",
    numberColor: "#58c3de",
    image: "",
  },
  {
    id: "reparacion",
    number: "03",
    title: "ReparaciÃ³n",
    text: "Ejecutamos mantenciÃ³n o reparaciÃ³n con criterio tÃ©cnico.",
    visible: true,
    backgroundColor: "#213255",
    borderColor: "#213255",
    textColor: "#ffffff",
    numberColor: "#58c3de",
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
    numberColor: "#58c3de",
    image: "",
  },
];

const repeatableDefaults: Record<string, SectionContent["items"]> = {
  Nosotros: [
    createCard("mision", "MisiÃ³n", "Recuperar y mantener equipos mÃ©dicos crÃ­ticos con respuesta tÃ©cnica clara y trazable."),
    createCard("vision", "VisiÃ³n", "Ser un aliado confiable para instituciones que necesitan continuidad operativa."),
    createCard("valores", "Valores", "Rigor tÃ©cnico, responsabilidad, orden documental y compromiso."),
  ],
  "Productos destacados": [
    createCard("camas", "Camas clÃ­nicas", "MantenciÃ³n y reparaciÃ³n de equipos clÃ­nicos.", "/service-maintenance.svg"),
    createCard("mesas", "Mesas quirÃºrgicas", "DiagnÃ³stico y recuperaciÃ³n operativa.", "/service-maintenance.svg"),
    createCard("monitores", "Monitores multiparÃ¡metros", "RevisiÃ³n tÃ©cnica y reparaciÃ³n.", "/medical-dashboard.svg"),
    createCard("actuadores", "Actuadores y motores", "Componentes y soporte tÃ©cnico.", "/service-maintenance.svg"),
  ],
  "Noticias destacadas": [
    createCard("noticia-1", "SeÃ±ales de desgaste en camas clÃ­nicas", "Indicadores que conviene detectar antes de una falla crÃ­tica.", "/blog-article.svg"),
    createCard("noticia-2", "MantenciÃ³n preventiva en camillas", "Puntos esenciales que conviene revisar.", "/blog-article.svg"),
    createCard("noticia-3", "CÃ³mo documentar reparaciones", "InformaciÃ³n Ãºtil para mejorar continuidad tÃ©cnica.", "/blog-article.svg"),
  ],
  "MisiÃ³n": [createCard("mision", "MisiÃ³n", "Recuperar y mantener equipos mÃ©dicos crÃ­ticos con respuesta tÃ©cnica clara y trazable.")],
  "VisiÃ³n": [createCard("vision", "VisiÃ³n", "Ser un aliado confiable para instituciones que necesitan continuidad operativa.")],
  "Valores VAIC": [
    createCard("vida", "Vida", "Trabajamos para preservar lo mÃ¡s valioso: la vida."),
    createCard("atencion", "AtenciÃ³n", "Escuchamos, entendemos y respondemos con excelencia."),
    createCard("innovacion", "InnovaciÃ³n", "Innovamos para anticipar y servir mejor."),
    createCard("cuidado", "Cuidado", "Cada detalle importa; cuidamos personas, procesos y equipos."),
  ],
  "MantenciÃ³n preventiva": [createCard("preventiva", "MantenciÃ³n preventiva", "RevisiÃ³n programada, ajustes, limpieza tÃ©cnica y control de condiciones.")],
  "ReparaciÃ³n correctiva": [createCard("correctiva", "ReparaciÃ³n correctiva", "DiagnÃ³stico y reparaciÃ³n de equipos mÃ©dicos.")],
  "Soporte tÃ©cnico": [createCard("soporte", "Soporte tÃ©cnico", "Respuesta en terreno, evaluaciÃ³n de fallas e informes tÃ©cnicos.")],
  "Listado de publicaciones": [],
  "NavegaciÃ³n de lÃ­neas": [
    createCard("linea-1", "Camas clÃ­nicas y camillas", "Equipos de traslado y hospitalizaciÃ³n."),
    createCard("linea-2", "PabellÃ³n y procedimientos", "Equipos utilizados en pabellÃ³n."),
    createCard("linea-3", "Monitoreo y equipos clÃ­nicos", "Equipos de monitoreo y apoyo clÃ­nico."),
  ],
  "Bloques de lÃ­neas": [
    createCard("linea-1", "Camas clÃ­nicas y camillas", "Equipos de traslado y hospitalizaciÃ³n."),
    createCard("linea-2", "PabellÃ³n y procedimientos", "Equipos utilizados en pabellÃ³n."),
  ],
  "Tarjetas de productos": [
    createCard("producto-1", "Camas clÃ­nicas elÃ©ctricas", "RevisiÃ³n de actuadores y controles.", "/service-maintenance.svg"),
    createCard("producto-2", "Mesas quirÃºrgicas", "DiagnÃ³stico de movimientos y mÃ³dulos.", "/service-maintenance.svg"),
    createCard("producto-3", "Monitores multiparÃ¡metros", "EvaluaciÃ³n de funcionamiento y accesorios.", "/medical-dashboard.svg"),
  ],
  "Grilla de productos": [
    createCard("producto-1", "Producto de la lÃ­nea", "DescripciÃ³n corta del producto.", "/service-maintenance.svg"),
    createCard("producto-2", "Producto de la lÃ­nea", "DescripciÃ³n corta del producto.", "/service-maintenance.svg"),
  ],
  "Productos relacionados": [
    createCard("relacionado-1", "Producto relacionado", "Modelo segÃºn equipo.", "/service-maintenance.svg"),
    createCard("relacionado-2", "Producto relacionado", "Modelo segÃºn equipo.", "/service-maintenance.svg"),
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
    numberColor: "#58c3de",
    image,
  };
}

function completeSection(section: string, value: Partial<SectionContent>): SectionContent {
  const isMethod = section === "MÃ©todo de trabajo";
  const normalizedSection = normalizeLabel(section);
  const isCatalogNavigation = normalizedSection.includes("navegaci");
  const isCatalogLineView = normalizedSection.includes("vista de l");
  const isRelatedProducts = normalizedSection.includes("productos relacionados");
  const editableFields: EditableField[] = isCatalogNavigation
    ? ["title"]
    : isCatalogLineView
      ? ["eyebrow"]
      : isRelatedProducts
        ? ["title", "content"]
        : value.editableFields ?? ["title", "subtitle", "content"];
  return {
    title: value.title ?? `<strong>${section}</strong>`,
    subtitle: value.subtitle ?? "Texto secundario de la secciÃ³n",
    content: value.content ?? "Contenido editable de esta secciÃ³n.",
    visible: value.visible ?? true,
    eyebrow: value.eyebrow ?? (isMethod ? "" : section),
    shape: value.shape ?? (isMethod ? "arrow" : "rounded"),
    customShapeImage: value.customShapeImage ?? "",
    backgroundColor: value.backgroundColor ?? "#f6fbfd",
    itemColor: value.itemColor ?? "#213255",
    accentColor: value.accentColor ?? "#58c3de",
    textColor: value.textColor ?? "#ffffff",
    sectionImage: value.sectionImage ?? "",
    sectionImages: value.sectionImages ?? (value.sectionImage ? [value.sectionImage] : []),
    columns: value.columns ?? 4,
    buttons: normalizeButtons(value.buttons ?? []),
    items: normalizeItems(
      value.items ?? (isMethod ? defaultSteps : repeatableDefaults[section] ?? []),
    ),
    editableFields,
    allowItems: isRelatedProducts ? true : value.allowItems ?? true,
    allowElementAppearance:
      isCatalogNavigation || isCatalogLineView || isRelatedProducts
        ? true
        : value.allowElementAppearance ?? false,
    allowButtons: value.allowButtons ?? true,
    allowUpload: value.allowUpload ?? true,
  };
}

function normalizeButtons(buttons: SectionContent["buttons"]) {
  return buttons.map((button, index) => ({
    ...button,
    backgroundColor: button.backgroundColor ?? (index === 0 ? "#213255" : "#ffffff"),
    borderColor: button.borderColor ?? (index === 0 ? "#213255" : "#58c3de"),
    textColor: button.textColor ?? (index === 0 ? "#ffffff" : "#213255"),
  }));
}

function normalizeItems(items: SectionContent["items"]) {
  return items.map((item) => ({
    ...item,
    backgroundColor: item.backgroundColor ?? "#ffffff",
    borderColor: item.borderColor ?? "#d7e9ef",
    textColor: item.textColor ?? "#213255",
    numberColor: item.numberColor ?? "#58c3de",
    image: item.image ?? "",
  }));
}

function normalizeLabel(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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
                (section === "MÃ©todo de trabajo"
                  ? ""
                  : section === "Productos destacados"
                  ? "CatÃ¡logo"
                  : section === "Noticias destacadas"
                    ? "Blog"
                    : section),
              buttons:
                defaults[section].buttons ??
                (section === "MÃ©todo de trabajo"
                  ? []
                  : section === "Hero principal"
                  ? [
                      { id: "support", label: "Solicitar soporte", href: "/contacto", visible: true },
                      { id: "services", label: "Ver servicios", href: "/servicios", visible: true },
                    ]
                  : [
                      { id: "primary", label: section === "Servicios" ? "Ver servicios" : "Conocer mÃ¡s", href: "/", visible: true },
                    ]),
            }
          : {
            title: `<strong>${section}</strong>`,
            subtitle: "Texto secundario de la secciÃ³n",
            content:
              "Contenido editable de esta secciÃ³n. Los cambios y formatos aparecen inmediatamente en la vista previa.",
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
  const [lastSavedContent, setLastSavedContent] = useState(() =>
    createInitialContent(contentKey, sections),
  );
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/content?pageKey=${encodeURIComponent(contentKey)}`)
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((result) => {
        if (result?.content) {
          const stored = result.content as Record<string, Partial<SectionContent>>;
          const defaults = pageDefaults[contentKey] || {};
          const storedContent = Object.fromEntries(
            sections.map((section) => {
              const defaultSection = defaults[section] || {};
              const storedSection = stored[section] || {};
              const needsContactCard =
                contentKey === "inicio" &&
                section === "Contacto" &&
                !storedSection.items?.length;

              return [
                section,
                completeSection(section, {
                  ...defaultSection,
                  ...storedSection,
                  items: needsContactCard
                    ? defaultSection.items
                    : storedSection.items ?? defaultSection.items,
                }),
              ];
            }),
          ) as Record<string, SectionContent>;
          setContent(storedContent);
          setLastSavedContent(storedContent);
          return;
        }
        const initialContent = createInitialContent(contentKey, sections);
        setContent(initialContent);
        setLastSavedContent(initialContent);
        fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageKey: contentKey, content: initialContent }),
        }).catch(() => undefined);
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
    if (isSaving) return;
    setIsSaving(true);
    setSaveStatus("Guardando...");
    try {
      const contentToSave = await uploadEmbeddedImages(content);
      setContent(contentToSave);
      setLastSavedContent(contentToSave);
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey: contentKey, content: contentToSave }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setSaveStatus(
          response.status === 413
            ? "No se pudo guardar: una imagen o archivo es demasiado pesado"
            : result?.error || "No se pudieron guardar los cambios",
        );
        return;
      }
      setSaveStatus("Cambios guardados correctamente");
      localStorage.setItem(
        "vaicmedical:content-updated",
        `${contentKey}:${Date.now()}`,
      );
      window.dispatchEvent(new Event("vaicmedical:content-updated"));
    } catch {
      setSaveStatus("No se pudo conectar con el servidor para guardar");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeading eyebrow="Editor de pÃ¡gina" title={title} text={description} />

      <div className="mt-7 min-h-[760px] overflow-hidden rounded-xl border border-[#d7e9ef] bg-white shadow-sm">
        <section className="border-b border-[#d7e9ef] bg-white">
          <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="shrink-0">
              <h2 className="font-bold">Secciones</h2>
              <p className="mt-1 text-xs text-[#667085]">
                Selecciona una secciÃ³n para editarla y verla en la vista previa.
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
                  Editando secciÃ³n
                </p>
                <h2 className="mt-1 font-bold">{selected}</h2>
              </div>
              <span className="text-right text-xs font-semibold text-[#34466f]" role="status">
                {saveStatus}
              </span>
            </div>
            <div className="max-h-[calc(100vh-245px)] overflow-y-auto">
              <EditorFields
                content={selectedContent}
                section={selected}
                onChange={updateField}
                onUpdate={updateSection}
                onDiscard={() => {
                  setContent(structuredClone(lastSavedContent));
                  setSaveStatus("Cambios descartados");
                }}
                onSave={saveChanges}
                isSaving={isSaving}
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

async function uploadEmbeddedImages(content: Record<string, SectionContent>) {
  const entries = await Promise.all(
    Object.entries(content).map(async ([section, value]) => {
      const sectionImages = await Promise.all(
        value.sectionImages.map((image, index) =>
          uploadDataUrl(image, `${section}-imagen-${index + 1}`),
        ),
      );
      const customShapeImage = await uploadDataUrl(
        value.customShapeImage,
        `${section}-figura`,
      );
      const items = await Promise.all(
        value.items.map(async (item, index) => ({
          ...item,
          image: await uploadDataUrl(item.image, `${section}-elemento-${index + 1}`),
        })),
      );
      return [
        section,
        {
          ...value,
          sectionImages,
          sectionImage: sectionImages[0] || "",
          customShapeImage,
          items,
        },
      ] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<string, SectionContent>;
}

async function uploadDataUrl(value: string, name: string) {
  if (!value.startsWith("data:")) return value;
  const response = await fetch(value);
  const blob = await response.blob();
  const extension = blob.type.split("/")[1]?.replace("svg+xml", "svg") || "png";
  return uploadAdminImage(
    new File([blob], `${name}.${extension}`, { type: blob.type }),
  );
}

function EditorFields({
  content,
  section,
  previewType,
  onChange,
  onUpdate,
  onDiscard,
  onSave,
  isSaving,
}: {
  content: SectionContent;
  section: string;
  previewType: "page" | "popup";
  onChange: (field: EditableField, value: string) => void;
  onUpdate: (changes: Partial<SectionContent>) => void;
  onDiscard: () => void;
  onSave: () => void;
  isSaving: boolean;
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
              label="TÃ­tulo"
              minHeight="76px"
              onChange={(value) => onChange("title", value)}
              value={content.title}
            />
          )}
          {fields.includes("subtitle") && (
            <RichTextEditor
              label="SubtÃ­tulo"
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
      {content.allowItems !== false && (
        <RepeatableItemsEditor content={content} formMode={section === "Formulario"} onUpdate={onUpdate} />
      )}
      {content.allowButtons !== false && content.buttons.length > 0 && (
        <ButtonsEditor content={content} onUpdate={onUpdate} />
      )}
      {content.allowUpload !== false && !isWorkflow && (
        <ImageGalleryEditor
          images={content.sectionImages}
          onChange={(sectionImages) =>
            onUpdate({ sectionImages, sectionImage: sectionImages[0] || "" })
          }
          formats="JPG, PNG, WEBP"
          maxSize="MÃ¡ximo 20 MB"
          recommended={
            previewType === "popup"
              ? "Recomendado: 1200 Ã— 1200 px"
              : "Recomendado: 1920 Ã— 1080 px"
          }
          title="Imagen de la secciÃ³n"
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
          className="rounded-lg bg-[#213255] px-4 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
          disabled={isSaving}
          onClick={onSave}
          type="button"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
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
        Mostrar secciÃ³n al cliente
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
    <div className="grid gap-4">
      <div className="grid gap-4 rounded-lg border border-[#d7e9ef] bg-[#f7fafb] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#58c3de]">
          Apariencia de la secciÃ³n
        </p>
        <div className="grid grid-cols-2 gap-3">
          <ColorInput label="Fondo" value={content.backgroundColor} onChange={(backgroundColor) => onUpdate({ backgroundColor })} />
          <ColorInput label="Acento" value={content.accentColor} onChange={(accentColor) => onUpdate({ accentColor })} />
        </div>
        <p className="text-xs leading-5 text-[#667085]">
          El acento modifica etiquetas, barras, lÃ­neas, nÃºmeros e iconos decorativos.
        </p>
      </div>
      {(content.allowItems !== false || content.allowElementAppearance) && (
        <div className="grid gap-4 rounded-lg border border-[#d7e9ef] bg-[#f7fafb] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#58c3de]">
            Apariencia de los elementos
          </p>
        <>
          <label className="text-xs font-semibold text-[#34466f]">
            Forma de los elementos
            <select
              className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3"
              onChange={(event) => onUpdate({ shape: event.target.value as SectionContent["shape"] })}
              value={content.shape}
            >
              <option value="arrow">Flechas de proyecto</option>
              <option value="rectangle">RectÃ¡ngulos</option>
              <option value="rounded">Tarjetas redondeadas</option>
              <option value="circle">CÃ­rculos</option>
              <option value="hexagon">HexÃ¡gonos</option>
              <option value="custom">Cargar figura</option>
            </select>
          </label>
          {content.shape === "custom" && (
            <label className="rounded-lg border border-dashed border-[#9eddea] bg-white p-3 text-xs font-semibold text-[#34466f]">
              Figura personalizada
              <span className="mt-1 block font-normal text-[#667085]">
                PNG o WEBP transparente Â· 800 Ã— 800 px Â· mÃ¡ximo 20 MB
              </span>
              <input
                accept="image/png,image/webp"
                className="mt-3 block w-full text-xs"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    onUpdate({ customShapeImage: await uploadAdminImage(file) });
                  } catch (error) {
                    window.alert(error instanceof Error ? error.message : "No se pudo subir la imagen");
                  }
                }}
                type="file"
              />
            </label>
          )}
          <div className="grid grid-cols-2 gap-3">
            <ColorInput label="Color forma" value={content.itemColor} onChange={(itemColor) => onUpdate({ itemColor, items: content.items.map((item) => ({ ...item, backgroundColor: itemColor })) })} />
            <ColorInput label="Color texto" value={content.textColor} onChange={(textColor) => onUpdate({ textColor, items: content.items.map((item) => ({ ...item, textColor })) })} />
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
        </div>
      )}
    </div>
  );
}

function RepeatableItemsEditor({
  content,
  formMode,
  onUpdate,
}: {
  content: SectionContent;
  formMode: boolean;
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
          Elementos de la secciÃ³n
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
                  text: "DescripciÃ³n del nuevo paso.",
                  visible: true,
                  backgroundColor: content.itemColor,
                  borderColor: content.accentColor,
                  textColor: content.textColor,
                  numberColor: content.accentColor,
                  image: "",
                  fieldType: formMode ? "text" : undefined,
                  required: false,
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
            {item.number} Â· {stripHtml(item.title)}
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
            <TextInput label="NÃºmero" value={item.number} onChange={(number) => updateItem(index, { number })} />
            <RichTextEditor label="TÃ­tulo del elemento" minHeight="65px" value={item.title} onChange={(title) => updateItem(index, { title })} />
            <RichTextEditor label="Texto del elemento" minHeight="90px" value={item.text} onChange={(text) => updateItem(index, { text })} />
            {formMode && (
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-[#34466f]">
                  Tipo de campo
                  <select className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3" onChange={(event) => updateItem(index, { fieldType: event.target.value as NonNullable<typeof item.fieldType> })} value={item.fieldType || "text"}>
                    <option value="text">Texto</option>
                    <option value="email">Correo</option>
                    <option value="tel">TelÃ©fono</option>
                    <option value="textarea">Texto largo</option>
                    <option value="select">Lista desplegable</option>
                  </select>
                </label>
                <label className="mt-7 flex h-11 items-center justify-between rounded-lg border border-[#d7e9ef] bg-white px-3 text-xs font-semibold text-[#34466f]">
                  Campo obligatorio
                  <input checked={item.required ?? false} onChange={(event) => updateItem(index, { required: event.target.checked })} type="checkbox" />
                </label>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <ColorInput label="Fondo caja" value={item.backgroundColor} onChange={(backgroundColor) => updateItem(index, { backgroundColor })} />
              <ColorInput label="Borde caja" value={item.borderColor} onChange={(borderColor) => updateItem(index, { borderColor })} />
              <ColorInput label="Texto caja" value={item.textColor} onChange={(textColor) => updateItem(index, { textColor })} />
              <ColorInput label="NÃºmero/icono" value={item.numberColor} onChange={(numberColor) => updateItem(index, { numberColor })} />
            </div>
            <label className="text-xs font-semibold text-[#34466f]">
              Imagen de la caja
              <input
                accept="image/jpeg,image/png,image/webp"
                className="mt-2 block w-full text-xs"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    updateItem(index, { image: await uploadAdminImage(file) });
                  } catch (error) {
                    window.alert(error instanceof Error ? error.message : "No se pudo subir la imagen");
                  }
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
            Mostrar botÃ³n
            <input
              checked={button.visible}
              onChange={(event) => onUpdate({ buttons: content.buttons.map((item, itemIndex) => itemIndex === index ? { ...item, visible: event.target.checked } : item) })}
              type="checkbox"
            />
          </label>
          <TextInput label="Nombre del botÃ³n" value={button.label} onChange={(label) => onUpdate({ buttons: content.buttons.map((item, itemIndex) => itemIndex === index ? { ...item, label } : item) })} />
          <div className="grid grid-cols-3 gap-2">
            <ColorInput label="Fondo" value={button.backgroundColor || "#213255"} onChange={(backgroundColor) => onUpdate({ buttons: content.buttons.map((item, itemIndex) => itemIndex === index ? { ...item, backgroundColor } : item) })} />
            <ColorInput label="Borde" value={button.borderColor || "#213255"} onChange={(borderColor) => onUpdate({ buttons: content.buttons.map((item, itemIndex) => itemIndex === index ? { ...item, borderColor } : item) })} />
            <ColorInput label="Texto" value={button.textColor || "#ffffff"} onChange={(textColor) => onUpdate({ buttons: content.buttons.map((item, itemIndex) => itemIndex === index ? { ...item, textColor } : item) })} />
          </div>
          <label className="text-xs font-semibold text-[#34466f]">
            Enlace del botÃ³n
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
  { label: "Inicio Â· Hero principal", value: "/#hero" },
  { label: "Inicio Â· MÃ©todo de trabajo", value: "/#metodo" },
  { label: "Inicio Â· Nosotros", value: "/#nosotros" },
  { label: "Inicio Â· Servicios", value: "/#servicios" },
  { label: "Inicio Â· Productos destacados", value: "/#catalogo" },
  { label: "Inicio Â· Noticias destacadas", value: "/#blog" },
  { label: "Inicio Â· Contacto", value: "/#contacto" },
  { label: "PÃ¡gina Nosotros", value: "/nosotros" },
  { label: "PÃ¡gina Servicios", value: "/servicios" },
  { label: "PÃ¡gina Blog", value: "/blog" },
  { label: "PÃ¡gina CatÃ¡logo", value: "/catalogo" },
  { label: "PÃ¡gina Contacto", value: "/contacto" },
];

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-semibold text-[#34466f]">
      {label}
      <input autoCorrect="on" lang="es" spellCheck className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3" onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const palette = useVisualPalette();
  const selected = palette.find(
    (option) => option.hex.toLowerCase() === value.toLowerCase(),
  );
  return (
    <label className="text-xs font-semibold text-[#34466f]">
      {label}
      <span className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-[#d7e9ef] bg-white px-3">
        <span
          className="h-5 w-5 shrink-0 rounded border border-[#d7e9ef]"
          style={{
            background:
              selected?.hex === "transparent"
                ? "linear-gradient(135deg, #fff 45%, #D7E9EF 46%, #D7E9EF 54%, #fff 55%)"
                : selected?.hex ?? value,
          }}
        />
        <select
          className="h-full min-w-0 flex-1 bg-transparent text-xs"
          onChange={(event) => onChange(event.target.value)}
          value={selected?.hex ?? "#213255"}
        >
          {palette.map((option) => (
            <option key={option.hex} value={option.hex}>
              {option.name} Â· {option.hex === "transparent" ? "Sin color" : option.hex}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "");
}

export function UploadGuide({
  title,
  recommended,
  maxSize,
  formats,
  onChange,
}: {
  title: string;
  recommended: string;
  maxSize: string;
  formats: string;
  onChange?: (image: string) => void;
}) {
  return (
    <label className="block cursor-pointer rounded-lg border border-dashed border-[#9eddea] bg-[#f4fbfd] p-4">
      <span className="text-sm font-bold text-[#213255]">{title}</span>
      <span className="mt-2 block text-xs text-[#34466f]">{recommended}</span>
      <span className="mt-1 block text-xs text-[#667085]">
        {formats} Â· {maxSize}
      </span>
      <span className="mt-4 inline-flex rounded-md bg-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]">
        Seleccionar archivo
      </span>
      <input
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file || !onChange) return;
          try {
            onChange(await uploadAdminImage(file));
          } catch (error) {
            window.alert(error instanceof Error ? error.message : "No se pudo subir la imagen");
          }
        }}
        type="file"
      />
    </label>
  );
}

function ImageGalleryEditor({
  title,
  recommended,
  maxSize,
  formats,
  images,
  onChange,
}: {
  title: string;
  recommended: string;
  maxSize: string;
  formats: string;
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploadStatus, setUploadStatus] = useState("");

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const availableSlots = Math.max(0, 3 - images.length);
    if (!availableSlots) return;
    const selectedFiles = Array.from(files).slice(0, availableSlots);
    setUploadStatus(`Subiendo ${selectedFiles.length} imagen${selectedFiles.length > 1 ? "es" : ""}...`);
    try {
      const uploaded = await Promise.all(selectedFiles.map(uploadAdminImage));
      onChange([...images, ...uploaded].slice(0, 3));
      setUploadStatus("ImÃ¡genes subidas. Presiona Guardar cambios.");
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : "No se pudieron subir las imÃ¡genes");
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-[#9eddea] bg-[#f4fbfd] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-sm font-bold text-[#213255]">{title}</span>
          <span className="mt-2 block text-xs text-[#34466f]">{recommended}</span>
          <span className="mt-1 block text-xs text-[#667085]">
            {formats} Â· {maxSize} Â· hasta 3 imÃ¡genes para carrusel
          </span>
          {uploadStatus && (
            <span className="mt-2 block text-xs font-semibold text-[#34466f]" role="status">
              {uploadStatus}
            </span>
          )}
        </div>
        <label className="inline-flex cursor-pointer rounded-md bg-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]">
          Agregar
          <input
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            multiple
            onChange={(event) => void addFiles(event.target.files)}
            type="file"
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {images.slice(0, 3).map((image, index) => (
            <div className="overflow-hidden rounded-lg border border-[#d7e9ef] bg-white shadow-sm" key={`${image}-${index}`}>
              <div
                className="h-28 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${image}")` }}
              />
              <div className="grid gap-2 px-3 py-3">
                <span className="text-xs font-semibold text-[#34466f]">
                  Imagen {index + 1}
                </span>
                <button
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                  onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}
                  type="button"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
  const popupImage = content.sectionImages[0] || content.sectionImage;

  return (
    <div className="grid min-h-[610px] place-items-center rounded-lg bg-[#213255]/65 p-7">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[24px] bg-white shadow-2xl md:grid-cols-[1.1fr_0.9fr]">
        <div
          className="grid aspect-square min-h-72 place-items-center bg-white bg-contain bg-center bg-no-repeat text-center text-sm text-[#667085]"
          style={{
            backgroundImage: popupImage
              ? `url("${popupImage}")`
              : undefined,
          }}
        >
          {!popupImage && "Imagen 1200 Ã— 1200 px"}
        </div>
        <div
          className="flex flex-col justify-center p-8"
          style={{ backgroundColor: content.backgroundColor }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
            {content.eyebrow || section}
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
          <div className="mt-6 flex flex-wrap gap-3">
            {content.buttons.filter((button) => button.visible).map((button) => (
              <button
                className="w-fit rounded-lg px-5 py-3 text-sm font-bold"
                key={button.id}
                style={{
                  backgroundColor: button.backgroundColor || "#213255",
                  border: `1px solid ${button.borderColor || "#213255"}`,
                  color: button.textColor || "#ffffff",
                }}
                type="button"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




