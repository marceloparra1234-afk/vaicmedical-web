"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const POPUP_SESSION_KEY = "vaicmedical:site-popup-session";

const defaultPopup = {
  eyebrow: "Soporte técnico VaicMedical",
  title: "¿Necesitas evaluar o reparar un equipo médico?",
  text: "Coordinamos diagnóstico, mantención y reparación de equipos clínicos, con seguimiento técnico y documentación de cada intervención.",
  image: "/service-maintenance.svg",
  buttonLabel: "Solicitar evaluación",
  buttonHref: "/contacto",
  visible: true,
  backgroundColor: "#ffffff",
  accentColor: "#58c3de",
  buttonColor: "#213255",
  textColor: "#213255",
};

type PopupSection = {
  eyebrow?: string;
  subtitle?: string;
  title?: string;
  content?: string;
  sectionImages?: string[];
  sectionImage?: string;
  buttons?: Array<{ label?: string; href?: string }>;
  visible?: boolean;
  backgroundColor?: string;
  accentColor?: string;
  itemColor?: string;
  textColor?: string;
};

export function SitePopup({ content }: { content?: Record<string, unknown> | null }) {
  const section = content?.["Configuración"] as PopupSection | undefined;
  const configuredPopup = section
    ? {
        eyebrow: stripHtml(section.eyebrow ?? section.subtitle ?? ""),
        title: stripHtml(section.title ?? ""),
        text: stripHtml(section.content ?? ""),
        image: section.sectionImages?.[0] ?? section.sectionImage ?? "",
        buttonLabel: section.buttons?.[0]?.label ?? "",
        buttonHref: section.buttons?.[0]?.href ?? "/contacto",
        visible: section.visible !== false,
        backgroundColor: section.backgroundColor ?? "#ffffff",
        accentColor: section.accentColor ?? "#58c3de",
        buttonColor: section.itemColor ?? "#213255",
        textColor: section.textColor ?? "#213255",
      }
    : defaultPopup;
  const [visible, setVisible] = useState(false);
  const [popup] = useState(configuredPopup);
  const [imageAvailable, setImageAvailable] = useState(Boolean(configuredPopup.image));

  useEffect(() => {
    if (
      window.self !== window.top ||
      new URLSearchParams(window.location.search).has("admin-preview")
    ) {
      return;
    }

    let timer: number | undefined;
    if (popup.visible && sessionStorage.getItem(POPUP_SESSION_KEY) !== "true") {
      timer = window.setTimeout(() => setVisible(true), 900);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [popup.visible]);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closePopup();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  function closePopup() {
    sessionStorage.setItem(POPUP_SESSION_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      aria-label="Ventana emergente VaicMedical"
      aria-modal="true"
      className="fixed inset-0 z-[80] grid place-items-center bg-[#213255]/65 px-4 py-8 backdrop-blur-sm"
      onClick={closePopup}
      role="dialog"
    >
      <div
        className="relative grid max-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-auto rounded-[28px] shadow-2xl shadow-[#213255]/35 md:grid-cols-[1.1fr_0.9fr]"
        onClick={(event) => event.stopPropagation()}
        style={{ backgroundColor: popup.backgroundColor, color: popup.textColor }}
      >
        <button
          aria-label="Cerrar ventana emergente"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-[#d7e9ef] bg-white/95 text-2xl leading-none text-[#213255] shadow-sm transition hover:border-[#58c3de] hover:text-[#58c3de]"
          onClick={closePopup}
          type="button"
        >
          ×
        </button>

        <div className="relative aspect-square min-h-64 bg-white md:min-h-[600px]">
          {popup.image && imageAvailable && (
            <Image
              alt="Mantención y reparación de equipos médicos VaicMedical"
              className="object-contain"
              fill
              priority
              onError={() => setImageAvailable(false)}
              sizes="(max-width: 768px) 100vw, 660px"
              src={popup.image}
              unoptimized
            />
          )}
        </div>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: popup.accentColor }}>
            {popup.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            {popup.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-[#34466f]">
            {popup.text}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex rounded-xl px-6 py-3 text-sm font-bold text-white transition"
              href={popup.buttonHref}
              onClick={closePopup}
              style={{ backgroundColor: popup.buttonColor }}
            >
              {popup.buttonLabel}
            </Link>
            <button
              className="rounded-xl border border-[#d7e9ef] px-6 py-3 text-sm font-bold text-[#213255] transition hover:border-[#58c3de] hover:text-[#58c3de]"
              onClick={closePopup}
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "");
}
