"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const POPUP_SESSION_KEY = "vaicmedical:site-popup-session";

const popup = {
  eyebrow: "Soporte técnico VaicMedical",
  title: "¿Necesitas evaluar o reparar un equipo médico?",
  text: "Coordinamos diagnóstico, mantención y reparación de equipos clínicos, con seguimiento técnico y documentación de cada intervención.",
  image: "/service-maintenance.svg",
  buttonLabel: "Solicitar evaluación",
  buttonHref: "/contacto",
};

export function SitePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(POPUP_SESSION_KEY) === "true") return;

    const timer = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

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
        className="relative grid max-h-[calc(100vh-4rem)] w-full max-w-5xl overflow-auto rounded-[28px] bg-white shadow-2xl shadow-[#213255]/35 md:grid-cols-[0.95fr_1.05fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Cerrar ventana emergente"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-[#d7e9ef] bg-white/95 text-2xl leading-none text-[#213255] shadow-sm transition hover:border-[#58c3de] hover:text-[#58c3de]"
          onClick={closePopup}
          type="button"
        >
          ×
        </button>

        <div className="relative min-h-64 bg-[#eaf8fc] md:min-h-[500px]">
          <Image
            alt="Mantención y reparación de equipos médicos VaicMedical"
            className="object-contain p-7 sm:p-10"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 480px"
            src={popup.image}
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#58c3de]">
            {popup.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#213255] sm:text-4xl">
            {popup.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-[#34466f]">
            {popup.text}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex rounded-xl bg-[#213255] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#34466f]"
              href={popup.buttonHref}
              onClick={closePopup}
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
