"use client";

import { useEffect, useRef, useState } from "react";
import type { PreviewContent } from "@/components/admin/ClientPagePreview";

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
    "Hero principal": "[data-editor-section='hero']",
    "Misión y visión": "[data-editor-section='mision-vision']",
    Valores: "[data-editor-section='valores']",
    "Llamado a servicios": "[data-editor-section='cta-servicios']",
  },
  servicios: {
    "Hero principal": "[data-editor-section='hero']",
    "Servicios técnicos": "[data-editor-section='servicios']",
    "Método de trabajo": "[data-editor-section='metodo']",
    "Llamado a contacto": "[data-editor-section='cta-contacto']",
  },
  blog: {
    "Hero principal": "[data-editor-section='hero']",
    "Listado de publicaciones": "[data-editor-section='publicaciones']",
  },
  "blog-vista": {
    "Título y fecha": "[data-editor-section='article-header']",
    "Breve reseña": "[data-editor-section='article-header']",
    "Imagen principal": "[data-editor-section='article-image']",
    Artículo: "[data-editor-section='article-body']",
    "Contenido relacionado": "[data-editor-section='article-body']",
  },
  catalogo: {
    "Hero principal": "[data-editor-section='hero']",
    "Navegación de líneas": "[data-editor-section='catalogo']",
    "Línea 01": "[data-editor-section='linea-01']",
    "Línea 02": "[data-editor-section='linea-02']",
    "Línea 03": "[data-editor-section='linea-03']",
    "Línea 04": "[data-editor-section='linea-04']",
  },
  "catalogo-lineas-vista": {
    "Título de línea": "[data-editor-section='catalogo']",
    Descripción: "[data-editor-section='catalogo']",
    "Resumen técnico": "[data-editor-section='catalogo']",
    "Grilla de productos": "[data-editor-section='catalogo']",
  },
  "catalogo-productos-vista": {
    Galería: "[data-editor-section='product-gallery']",
    "Información técnica": "[data-editor-section='product-info']",
    Descripción: "[data-editor-section='product-description']",
    Documentación: "[data-editor-section='product-docs']",
    "Productos relacionados": "[data-editor-section='product-related']",
  },
  contacto: {
    "Hero principal": "[data-editor-section='contacto-hero']",
    "Información de contacto": "[data-editor-section='contacto-info']",
    Formulario: "[data-editor-section='formulario']",
  },
};

export function LiveClientPreview({
  contentKey,
  section,
  content,
}: {
  contentKey: string;
  section: string;
  content: PreviewContent;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const latestContentRef = useRef(content);
  const [status, setStatus] = useState("Cargando sección...");
  const path = pagePaths[contentKey] || "/";
  const selector = sectionSelectors[contentKey]?.[section];

  useEffect(() => {
    latestContentRef.current = content;
  }, [content]);

  useEffect(() => {
    let cancelled = false;

    async function renderIsolatedSection() {
      const iframe = iframeRef.current;
      if (!iframe || !selector) return;

      setStatus("Cargando sección...");

      try {
        const response = await fetch(`${path}${path.includes("?") ? "&" : "?"}admin-preview=1`);
        const html = await response.text();
        if (cancelled) return;

        const sourceDocument = new DOMParser().parseFromString(html, "text/html");
        const sourceTarget = sourceDocument.querySelector(selector);

        if (!(sourceTarget instanceof HTMLElement)) {
          writeIframeDocument(
            iframe,
            `<div class="admin-preview-empty">No se encontró esta sección en la página pública.</div>`,
            "",
          );
          setStatus("Sección no encontrada");
          return;
        }

        const assets = Array.from(
          sourceDocument.head.querySelectorAll("link[rel='stylesheet'], style"),
        )
          .map((element) => element.outerHTML)
          .join("\n");

        writeIframeDocument(iframe, sourceTarget.outerHTML, assets);

        const previewDocument = iframe.contentDocument;
        const target = previewDocument?.querySelector(selector);
        if (target instanceof HTMLElement) {
          target.dataset.adminPreviewActive = "true";
          applyContentToTarget(target, latestContentRef.current);
          setStatus("Mostrando solo esta sección");
        }
      } catch {
        if (!cancelled) {
          const iframe = iframeRef.current;
          if (iframe) {
            writeIframeDocument(
              iframe,
              `<div class="admin-preview-empty">No se pudo cargar la vista previa.</div>`,
              "",
            );
          }
          setStatus("Error al cargar");
        }
      }
    }

    renderIsolatedSection();
    return () => {
      cancelled = true;
    };
  }, [path, selector]);

  useEffect(() => {
    const iframe = iframeRef.current;
    const previewDocument = iframe?.contentDocument;
    if (!previewDocument || !selector) return;

    const target = previewDocument.querySelector(selector);
    if (target instanceof HTMLElement) {
      applyContentToTarget(target, content);
    }
  }, [content, selector]);

  return (
    <div className="overflow-hidden rounded-lg border border-[#d7e9ef] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#d7e9ef] bg-white px-4 py-3">
        <p className="text-xs text-[#667085]">
          Vista pública real · {status}
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
        title={`Vista pública real de ${section}`}
      />
    </div>
  );
}

function writeIframeDocument(
  iframe: HTMLIFrameElement,
  sectionHtml: string,
  assets: string,
) {
  const document = iframe.contentDocument;
  if (!document) return;

  document.open();
  document.write(`<!doctype html>
    <html>
      <head>
        <base href="${window.location.origin}">
        ${assets}
        <style>
          html { scroll-behavior: auto !important; }
          body {
            margin: 0;
            background: #ffffff;
            color: #213255;
            overflow-x: hidden;
          }
          .admin-preview-shell {
            min-height: 100vh;
            background: #ffffff;
          }
          .admin-preview-shell > [data-editor-section] {
            width: 100% !important;
            max-width: none;
          }
          .admin-preview-empty {
            display: grid;
            min-height: 420px;
            place-items: center;
            padding: 32px;
            color: #667085;
            font: 600 14px system-ui, sans-serif;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <main class="admin-preview-shell">${sectionHtml}</main>
      </body>
    </html>`);
  document.close();
}

function applyContentToTarget(target: HTMLElement, content: PreviewContent) {
  target.style.display = content.visible ? "" : "none";
  target.style.backgroundColor = content.backgroundColor || "";

  const sectionEyebrow = target.querySelector("[data-editor-field='section-eyebrow']");
  if (sectionEyebrow instanceof HTMLElement && content.eyebrow) {
    sectionEyebrow.innerHTML = content.eyebrow;
    sectionEyebrow.style.color = content.accentColor || "";
  }

  const sectionTitle = target.querySelector("[data-editor-field='section-title']");
  if (sectionTitle instanceof HTMLElement) {
    sectionTitle.innerHTML = content.title;
  }

  const sectionIntro = target.querySelector("[data-editor-field='section-intro']");
  if (sectionIntro instanceof HTMLElement) {
    sectionIntro.innerHTML = content.content;
  }

  const eyebrow = first(target, [
    "p.text-sm.font-semibold.uppercase",
    "p.text-xs.font-semibold.uppercase",
    "p.font-mono",
  ]);
  if (eyebrow && !sectionEyebrow && content.eyebrow) eyebrow.innerHTML = content.eyebrow;

  const heading = first(target, ["h1", "h2"]);
  if (heading && !sectionTitle) heading.innerHTML = content.title;

  const paragraphs = Array.from(target.querySelectorAll("p")).filter(
    (item) =>
      !item.className.includes("uppercase") &&
      !item.className.includes("font-mono") &&
      !item.closest("nav"),
  );
  if (!sectionIntro) {
    if (paragraphs[0]) paragraphs[0].innerHTML = content.subtitle || content.content;
    if (paragraphs[1]) paragraphs[1].innerHTML = content.content;
  }

  const buttons = Array.from(target.querySelectorAll("a, button")).filter(
    (item) => !item.closest("nav"),
  );
  content.buttons.forEach((button, index) => {
    const element = buttons[index];
    if (!element) return;
    if (element instanceof HTMLElement) {
      element.style.display = button.visible ? "" : "none";
      element.innerHTML = button.label;
    }
    if (element instanceof HTMLAnchorElement) {
      element.href = button.href;
    }
  });

  if (content.items.length) {
    const cards = findCards(target);
    content.items.forEach((item, index) => {
      const card = cards[index];
      if (!card) return;
      card.style.display = item.visible ? "" : "none";
      card.style.backgroundColor = item.backgroundColor || "";
      card.style.borderColor = item.borderColor || "";
      card.style.color = item.textColor || "";

      const accent = Array.from(card.children).find(
        (child) =>
          child instanceof HTMLElement &&
          child.className.includes("h-2") &&
          child.className.includes("rounded-full"),
      );
      if (accent instanceof HTMLElement) {
        accent.style.backgroundColor = item.borderColor || content.accentColor || "";
      }

      const cardNumber = first(card, ["span"]);
      if (cardNumber && item.number) cardNumber.innerHTML = item.number;

      const cardTitle = first(card, ["h2", "h3", "p.uppercase", ".font-semibold"]);
      if (cardTitle) cardTitle.innerHTML = item.title;

      const cardParagraph = Array.from(card.querySelectorAll("p")).find(
        (paragraph) =>
          paragraph instanceof HTMLElement &&
          paragraph !== cardTitle &&
          !paragraph.className.includes("uppercase"),
      );
      if (cardParagraph instanceof HTMLElement) cardParagraph.innerHTML = item.text;
    });
  }
}

function first(root: Element, selectors: string[]) {
  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (element instanceof HTMLElement) return element;
  }
  return null;
}

function findCards(target: HTMLElement) {
  const candidates = Array.from(
    target.querySelectorAll("article, [class*='rounded-3xl'], [class*='rounded-[22px]'], [class*='rounded-[26px]']"),
  ).filter((element): element is HTMLElement => element instanceof HTMLElement);

  if (candidates.length) return candidates;

  return Array.from(target.children).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );
}
