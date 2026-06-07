"use client";

import { useEffect, useRef } from "react";
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
    Hero: "[data-editor-section='hero']",
    Misión: "[data-editor-section='mision']",
    Visión: "[data-editor-section='vision']",
    "Valores introducción": "[data-editor-section='valores-intro']",
    "Valor Vida": "[data-editor-section='valor-vida']",
    "Valor Atención": "[data-editor-section='valor-atencion']",
    "Valor Innovación": "[data-editor-section='valor-innovacion']",
    "Valor Cuidado": "[data-editor-section='valor-cuidado']",
    "Llamado a servicios": "[data-editor-section='cta-servicios']",
  },
  servicios: {
    Hero: "[data-editor-section='hero']",
    "Mantención preventiva": "[data-editor-section='servicio-mantencion']",
    "Reparación correctiva": "[data-editor-section='servicio-reparacion']",
    "Soporte técnico": "[data-editor-section='servicio-soporte']",
    "Monitores multiparámetros": "[data-editor-section='servicio-monitores']",
    "Equipos de pabellón": "[data-editor-section='servicio-equipos']",
    "Gestión de requerimientos": "[data-editor-section='servicio-gestion']",
    "Método de trabajo": "[data-editor-section='metodo']",
    "Llamado a contacto": "[data-editor-section='cta-contacto']",
  },
  blog: {
    Hero: "[data-editor-section='hero']",
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
    Hero: "[data-editor-section='hero']",
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
    Hero: "[data-editor-section='hero']",
    "Tarjeta Correo": "[data-editor-section='info-correo']",
    "Tarjeta Cobertura": "[data-editor-section='info-cobertura']",
    "Tarjeta Respuesta": "[data-editor-section='info-respuesta']",
    "Tarjeta Especialidad": "[data-editor-section='info-especialidad']",
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
  const path = pagePaths[contentKey] || "/";
  const selector = sectionSelectors[contentKey]?.[section];

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    function applyDraft() {
      const document = iframe?.contentDocument;
      if (!document) return;

      document.documentElement.style.scrollBehavior = "auto";
      document.querySelectorAll("[data-admin-preview-active]").forEach((element) => {
        element.removeAttribute("data-admin-preview-active");
      });

      const target = selector ? document.querySelector(selector) : null;
      if (target instanceof HTMLElement) {
        target.dataset.adminPreviewActive = "true";
        applyContentToTarget(target, content);
        target.scrollIntoView({ block: "start" });
      }
    }

    iframe.addEventListener("load", applyDraft);
    applyDraft();
    return () => iframe.removeEventListener("load", applyDraft);
  }, [selector, content]);

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

function applyContentToTarget(target: HTMLElement, content: PreviewContent) {
  target.style.display = content.visible ? "" : "none";
  target.style.backgroundColor = content.backgroundColor || "";

  const eyebrow = first(target, [
    "p.text-sm.font-semibold.uppercase",
    "p.text-xs.font-semibold.uppercase",
    "p.font-mono",
  ]);
  if (eyebrow && content.eyebrow) eyebrow.innerHTML = content.eyebrow;

  const heading = first(target, ["h1", "h2"]);
  if (heading) heading.innerHTML = content.title;

  const paragraphs = Array.from(target.querySelectorAll("p")).filter(
    (item) =>
      !item.className.includes("uppercase") &&
      !item.className.includes("font-mono") &&
      !item.closest("nav"),
  );
  if (paragraphs[0]) paragraphs[0].innerHTML = content.subtitle || content.content;
  if (paragraphs[1]) paragraphs[1].innerHTML = content.content;

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

      const cardNumber = first(card, ["span"]);
      if (cardNumber && item.number) cardNumber.innerHTML = item.number;

      const cardTitle = first(card, ["h2", "h3", ".font-semibold"]);
      if (cardTitle) cardTitle.innerHTML = item.title;

      const cardParagraph = first(card, ["p.leading-7", "p.text-sm", "p"]);
      if (cardParagraph) cardParagraph.innerHTML = item.text;
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
