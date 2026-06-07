"use client";

import { useEffect, useRef } from "react";

const pagePaths: Record<string, string> = {
  inicio: "/",
  nosotros: "/nosotros",
  servicios: "/servicios",
  blog: "/blog",
  "blog-vista": "/blog/senales-desgaste-camas-clinicas",
  catalogo: "/catalogo",
  "catalogo-lineas-vista": "/catalogo",
  "catalogo-productos-vista": "/catalogo/camas-clinicas-electricas",
  contacto: "/contacto",
};

const sectionSelectors: Record<string, Record<string, string>> = {
  inicio: {
    "Hero principal": "[data-editor-section='hero']",
    "Método de trabajo": "[data-editor-section='metodo']",
    Nosotros: "[data-editor-section='nosotros']",
    Servicios: "[data-editor-section='servicios']",
    "Productos destacados": "[data-editor-section='catalogo']",
    "Noticias destacadas": "[data-editor-section='blog']",
    Contacto: "[data-editor-section='contacto']",
  },
  nosotros: {
    Hero: "[data-editor-section='hero']",
    Presentación: "[data-editor-section='hero']",
    Misión: "[data-editor-section='mision-vision']",
    Visión: "[data-editor-section='mision-vision']",
    "Valores VAIC": "[data-editor-section='valores']",
  },
  servicios: {
    Hero: "[data-editor-section='hero']",
    "Mantención preventiva": "[data-editor-section='servicios']",
    "Reparación correctiva": "[data-editor-section='servicios']",
    "Soporte técnico": "[data-editor-section='servicios']",
    "Llamado a contacto": "[data-editor-section='metodo']",
  },
  blog: {
    Encabezado: "[data-editor-section='hero']",
    "Noticias destacadas": "[data-editor-section='publicaciones']",
    "Listado de publicaciones": "[data-editor-section='publicaciones']",
  },
  catalogo: {
    Encabezado: "[data-editor-section='hero']",
    "Navegación de líneas": "[data-editor-section='catalogo']",
    "Bloques de líneas": "[data-editor-section='catalogo']",
    "Tarjetas de productos": "[data-editor-section='catalogo']",
  },
  contacto: {
    Encabezado: "[data-editor-section='hero']",
    "Información de contacto": "[data-editor-section='contacto']",
    Formulario: "[data-editor-section='contacto']",
    "Mensaje posterior al envío": "[data-editor-section='contacto']",
  },
};

export function LiveClientPreview({
  contentKey,
  section,
}: {
  contentKey: string;
  section: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const path = pagePaths[contentKey] || "/";
  const selector = sectionSelectors[contentKey]?.[section];

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    function focusSection() {
      const document = iframe?.contentDocument;
      if (!document) return;

      document.documentElement.style.scrollBehavior = "auto";
      document.querySelectorAll("[data-admin-preview-active]").forEach((element) => {
        element.removeAttribute("data-admin-preview-active");
      });

      const target = selector ? document.querySelector(selector) : null;
      if (target instanceof HTMLElement) {
        target.dataset.adminPreviewActive = "true";
        target.scrollIntoView({ block: "start" });
      }
    }

    iframe.addEventListener("load", focusSection);
    focusSection();
    return () => iframe.removeEventListener("load", focusSection);
  }, [selector]);

  return (
    <div className="overflow-hidden rounded-lg border border-[#d7e9ef] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#d7e9ef] bg-white px-4 py-3">
        <p className="text-xs text-[#667085]">
          Vista pública real · {path}
        </p>
        <a
          className="text-xs font-semibold text-[#258aa5]"
          href={path}
          rel="noreferrer"
          target="_blank"
        >
          Abrir página
        </a>
      </div>
      <iframe
        className="h-[650px] w-full bg-white"
        ref={iframeRef}
        src={`${path}${path.includes("?") ? "&" : "?"}admin-preview=1`}
        title={`Vista pública real de ${section}`}
      />
    </div>
  );
}
