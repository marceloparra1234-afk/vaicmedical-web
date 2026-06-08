"use client";

import { useEffect, useState } from "react";
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
  const [status, setStatus] = useState("Cargando sección...");
  const [template, setTemplate] = useState<{
    assets: string;
    sectionHtml: string;
  } | null>(null);
  const path = pagePaths[contentKey] || "/";
  const selector = sectionSelectors[contentKey]?.[section];

  useEffect(() => {
    let cancelled = false;

    async function loadIsolatedSection() {
      if (!selector) return;

      setStatus("Cargando sección...");
      setTemplate(null);

      try {
        const response = await fetch(`${path}${path.includes("?") ? "&" : "?"}admin-preview=1`);
        const html = await response.text();
        if (cancelled) return;

        const sourceDocument = new DOMParser().parseFromString(html, "text/html");
        const sourceTarget = sourceDocument.querySelector(selector);

        if (!(sourceTarget instanceof HTMLElement)) {
          setTemplate({
            assets: "",
            sectionHtml:
              '<div class="admin-preview-empty">No se encontró esta sección en la página pública.</div>',
          });
          setStatus("Sección no encontrada");
          return;
        }

        const assets = Array.from(
          sourceDocument.head.querySelectorAll("link[rel='stylesheet'], style"),
        )
          .map((element) => element.outerHTML)
          .join("\n");

        setTemplate({ assets, sectionHtml: sourceTarget.outerHTML });
        setStatus("Mostrando solo esta sección");
      } catch {
        if (!cancelled) {
          setTemplate({
            assets: "",
            sectionHtml:
              '<div class="admin-preview-empty">No se pudo cargar la vista previa.</div>',
          });
          setStatus("Error al cargar");
        }
      }
    }

    loadIsolatedSection();
    return () => {
      cancelled = true;
    };
  }, [path, selector]);

  const srcDoc = template
    ? buildPreviewDocument(template.sectionHtml, template.assets, selector, content)
    : buildPreviewDocument(
        '<div class="admin-preview-empty">Cargando vista previa...</div>',
        "",
        selector,
        content,
      );

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
        srcDoc={srcDoc}
        title={`Vista pública real de ${section}`}
      />
    </div>
  );
}

function buildPreviewDocument(
  sectionHtml: string,
  assets: string,
  selector: string | undefined,
  content: PreviewContent,
) {
  const parser = new DOMParser();
  const sourceDocument = parser.parseFromString(
    `<main class="admin-preview-shell">${sectionHtml}</main>`,
    "text/html",
  );
  const target = selector ? sourceDocument.querySelector(selector) : null;

  if (target instanceof HTMLElement) {
    target.dataset.adminPreviewActive = "true";
    applyContentToTarget(target, content);
  }

  const renderedSection =
    sourceDocument.body.querySelector(".admin-preview-shell")?.innerHTML ||
    sectionHtml;

  return `<!doctype html>
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
        <main class="admin-preview-shell">${renderedSection}</main>
      </body>
    </html>`;
}

function applyContentToTarget(target: HTMLElement, content: PreviewContent) {
  target.style.display = content.visible ? "" : "none";
  target.style.backgroundColor = content.backgroundColor || "";
  target.style.color = content.textColor || "";

  applySectionImage(target, content);
  applyGridColumns(target, content);

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
      element.style.backgroundColor = index === 0 ? content.itemColor || content.accentColor : "";
      element.style.borderColor = content.accentColor || "";
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
      applyCardAppearance(card, item, content);
      applyItemImage(card, item);

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

function applySectionImage(target: HTMLElement, content: PreviewContent) {
  if (!content.sectionImage) return;

  const image = target.querySelector("img");
  if (image instanceof HTMLImageElement) {
    image.src = content.sectionImage;
    image.srcset = "";
    return;
  }

  const visual = Array.from(target.querySelectorAll("div, figure")).find(
    (element) =>
      element instanceof HTMLElement &&
      (element.className.includes("aspect-") ||
        element.className.includes("min-h") ||
        element.className.includes("h-44") ||
        element.className.includes("h-52")),
  );

  if (visual instanceof HTMLElement) {
    visual.style.backgroundImage = `url("${content.sectionImage}")`;
    visual.style.backgroundPosition = "center";
    visual.style.backgroundSize = "cover";
  }
}

function applyGridColumns(target: HTMLElement, content: PreviewContent) {
  if (!content.items.length || !content.columns) return;

  const cards = findCards(target);
  const grid = cards[0]?.parentElement;
  if (!grid) return;

  grid.style.gridTemplateColumns = `repeat(${content.columns}, minmax(0, 1fr))`;
}

function applyCardAppearance(
  card: HTMLElement,
  item: PreviewContent["items"][number],
  content: PreviewContent,
) {
  card.style.backgroundColor = item.backgroundColor || content.itemColor || "";
  card.style.borderColor = item.borderColor || content.accentColor || "";
  card.style.color = item.textColor || content.textColor || "";

  card.style.clipPath = "";
  card.style.aspectRatio = "";

  if (content.shape === "rectangle") {
    card.style.borderRadius = "0";
  }

  if (content.shape === "rounded") {
    card.style.borderRadius = "24px";
  }

  if (content.shape === "circle") {
    card.style.borderRadius = "9999px";
    card.style.aspectRatio = "1 / 1";
  }

  if (content.shape === "hexagon") {
    card.style.borderRadius = "0";
    card.style.clipPath =
      "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%)";
  }

  if (content.shape === "custom" && content.customShapeImage) {
    card.style.backgroundImage = `url("${content.customShapeImage}")`;
    card.style.backgroundPosition = "center";
    card.style.backgroundRepeat = "no-repeat";
    card.style.backgroundSize = "100% 100%";
  } else {
    card.style.backgroundImage = "";
  }
}

function applyItemImage(
  card: HTMLElement,
  item: PreviewContent["items"][number],
) {
  if (!item.image) return;

  const image = card.querySelector("img");
  if (image instanceof HTMLImageElement) {
    image.src = item.image;
    image.srcset = "";
    return;
  }

  const visual = Array.from(card.querySelectorAll("div, span")).find(
    (element) =>
      element instanceof HTMLElement &&
      (element.className.includes("h-14") ||
        element.className.includes("h-16") ||
        element.className.includes("aspect") ||
        element.className.includes("rounded-2xl")),
  );

  if (visual instanceof HTMLElement) {
    visual.style.backgroundImage = `url("${item.image}")`;
    visual.style.backgroundPosition = "center";
    visual.style.backgroundSize = "cover";
    visual.textContent = "";
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
