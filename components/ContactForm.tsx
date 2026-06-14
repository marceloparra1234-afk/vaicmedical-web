"use client";

import { FormEvent, useState } from "react";

const requestTypes = [
  "Mantención preventiva",
  "Reparación correctiva",
  "Evaluación técnica",
  "Cotización",
  "Otro requerimiento",
];

export function ContactForm() {
  const [fallbackHref, setFallbackHref] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nombre = String(formData.get("nombre") || "");
    const correo = String(formData.get("correo") || "");
    const telefono = String(formData.get("telefono") || "");
    const institucion = String(formData.get("institucion") || "");
    const asunto = String(formData.get("asunto") || "");
    const tipo = String(formData.get("tipo") || "");
    const mensaje = String(formData.get("mensaje") || "");

    const subject =
      asunto || `Solicitud VaicMedical - ${tipo || "Requerimiento técnico"}`;
    const body = [
      `Nombre: ${nombre}`,
      `Correo: ${correo}`,
      `Teléfono: ${telefono}`,
      `Institución: ${institucion}`,
      `Asunto: ${asunto}`,
      `Tipo de solicitud: ${tipo}`,
      "",
      "Mensaje:",
      mensaje,
    ].join("\n");

    const mailtoHref = `mailto:contacto@vaicmedical.cl?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=contacto@vaicmedical.cl&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setFallbackHref(mailtoHref);
    window.open(gmailHref, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-[#d7e9ef] bg-white p-5 shadow-2xl shadow-[#213255]/10 sm:p-8"
    >
      <div className="mb-8 h-44 rounded-[1.5rem] border border-[#d7e9ef] bg-[#eaf8fc] p-5 sm:h-52">
        <div className="grid h-full place-items-center rounded-[1rem] border border-[#58c3de]/30 bg-white text-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#58c3de]">
              VaicMedical
            </p>
            <p className="mt-3 text-2xl font-semibold text-[#213255]">
              Solicitud técnica
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#58c3de]">
        Formulario de contacto
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-[#213255]" data-editor-field="section-title">
        Describe tu requerimiento
      </h2>
      <p className="mt-3 leading-7 text-[#34466f]" data-editor-field="section-intro">
        Completa los datos y prepararemos un correo con la información necesaria
        para iniciar la coordinación.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field id="nombre" label="Nombre">
          <input
            autoCorrect="on"
            className="contact-input-light"
            lang="es"
            name="nombre"
            placeholder="Nombre completo"
            required
            spellCheck
          />
        </Field>

        <Field id="correo" label="Correo">
          <input
            className="contact-input-light"
            name="correo"
            type="email"
            placeholder="correo@institucion.cl"
            required
          />
        </Field>

        <Field id="telefono" label="Teléfono">
          <input
            className="contact-input-light"
            name="telefono"
            placeholder="+56 9..."
          />
        </Field>

        <Field id="institucion" label="Institución">
          <input
            className="contact-input-light"
            name="institucion"
            placeholder="Hospital, clínica o empresa"
          />
        </Field>

        <Field id="asunto" label="Asunto">
          <input
            className="contact-input-light"
            name="asunto"
            placeholder="Ej: Reparación de cama clínica"
          />
        </Field>

        <Field id="tipo" label="Tipo de solicitud">
          <select className="contact-input-light" name="tipo" defaultValue="">
            <option value="" disabled>
              Seleccionar
            </option>
            {requestTypes.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field id="mensaje" label="Mensaje">
          <textarea
            autoCorrect="on"
            className="contact-input-light"
            lang="es"
            name="mensaje"
            rows={6}
            placeholder="Describe la falla, mantención requerida o antecedentes relevantes."
            required
            spellCheck
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-[#213255] px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#34466f]"
        >
          Enviar solicitud
        </button>

        <a
          href="mailto:contacto@vaicmedical.cl"
          className="inline-flex items-center justify-center rounded-2xl border border-[#58c3de] bg-[#eaf8fc] px-6 py-4 text-sm font-extrabold text-[#213255]"
        >
          Escribir directo
        </a>
      </div>

      <div className="mt-6 rounded-2xl border border-[#d7e9ef] bg-[#f6fbfd] p-4">
        <p className="text-sm font-bold text-[#213255]">Correo directo</p>
        <p className="mt-2 text-sm leading-6 text-[#34466f]">
          También puedes escribir a contacto@vaicmedical.cl con antecedentes del
          equipo, ubicación y criticidad del requerimiento.
        </p>
      </div>

      {fallbackHref && (
        <p className="mt-5 rounded-2xl bg-[#eaf8fc] p-4 text-sm leading-6 text-[#34466f]">
          Si no se abrió la ventana de correo,{" "}
          <a className="font-bold text-[#213255]" href={fallbackHref}>
            haz clic aquí para intentarlo con tu aplicación de correo.
          </a>
        </p>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-bold text-[#34466f]" data-form-field={id}>
      <span data-form-label>{label}</span>
      {children}
    </label>
  );
}
