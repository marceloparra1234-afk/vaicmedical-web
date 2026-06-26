"use client";

import { FormEvent, useState } from "react";

const requestTypes = [
  "Mantención preventiva",
  "Reparación correctiva",
  "Evaluación técnica",
  "Cotización",
  "Otro requerimiento",
];

type ContactItem = {
  id?: string;
  title?: string;
  text?: string;
  visible?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fieldType?: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
};

type ContactButton = {
  label?: string;
  href?: string;
  visible?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
};

export type ContactFormContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  backgroundColor?: string;
  itemColor?: string;
  accentColor?: string;
  textColor?: string;
  sectionImage?: string;
  sectionImages?: string[];
  buttons?: ContactButton[];
  items?: ContactItem[];
};

const defaultFields: Required<Pick<ContactItem, "id" | "title" | "text">>[] = [
  { id: "nombre", title: "Nombre", text: "Nombre completo" },
  { id: "correo", title: "Correo", text: "correo@institucion.cl" },
  { id: "telefono", title: "Teléfono", text: "+56 9..." },
  { id: "institucion", title: "Institución", text: "Hospital, clínica o empresa" },
  { id: "asunto", title: "Asunto", text: "Ej: Reparación de cama clínica" },
  { id: "tipo", title: "Tipo de solicitud", text: "Seleccionar" },
  { id: "mensaje", title: "Mensaje", text: "Describe la falla, mantención requerida o antecedentes relevantes." },
];

const defaultDirectCard: ContactItem = {
  id: "correo-directo",
  title: "Correo directo",
  text: "También puedes escribir a contacto@vaicmedical.cl con antecedentes del equipo, ubicación y criticidad del requerimiento.",
  backgroundColor: "#f6fbfd",
  borderColor: "#d7e9ef",
  textColor: "#213255",
  visible: true,
};

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "");
}

export function ContactForm({ content }: { content?: ContactFormContent | null }) {
  const [fallbackHref, setFallbackHref] = useState("");
  const accent = content?.accentColor || "#58c3de";
  const textColor = content?.textColor || "#213255";
  const formBackground = content?.backgroundColor || "#ffffff";
  const visualBackground = content?.itemColor || "#eaf8fc";
  const image = content?.sectionImages?.[0] || content?.sectionImage || "";
  const primaryButton = content?.buttons?.[0];
  const secondaryButton = content?.buttons?.[1];
  const fields = defaultFields.map((field) => ({
    ...field,
    ...content?.items?.find((item) => item.id === field.id),
  }));
  const directCard = {
    ...defaultDirectCard,
    ...content?.items?.find((item) => item.id === "correo-directo"),
  };

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
      subject,
    )}&body=${encodeURIComponent(body)}`;
    const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=contacto@vaicmedical.cl&su=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setFallbackHref(mailtoHref);
    window.open(gmailHref, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      className="rounded-[2rem] border p-5 shadow-2xl shadow-[#213255]/10 sm:p-8"
      onSubmit={handleSubmit}
      style={{ backgroundColor: formBackground, borderColor: accent, color: textColor }}
    >
      <div
        className="mb-8 h-44 overflow-hidden rounded-[1.5rem] border p-5 sm:h-52"
        data-editor-field="section-image"
        style={{
          backgroundColor: visualBackground,
          backgroundImage: image ? `url("${image}")` : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderColor: accent,
        }}
      >
        {!image && (
          <div
            className="grid h-full place-items-center rounded-[1rem] border bg-white text-center"
            style={{ borderColor: accent }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
                {stripHtml(content?.subtitle || "VaicMedical")}
              </p>
              <p className="mt-3 text-2xl font-semibold" style={{ color: textColor }}>
                {stripHtml(content?.eyebrow || "Solicitud técnica")}
              </p>
            </div>
          </div>
        )}
      </div>

      <p
        className="text-xs font-bold uppercase tracking-[0.22em]"
        data-editor-field="section-eyebrow"
        dangerouslySetInnerHTML={{ __html: content?.subtitle || "Formulario de contacto" }}
        style={{ color: accent }}
      />
      <h2
        className="mt-3 text-3xl font-semibold"
        data-editor-field="section-title"
        dangerouslySetInnerHTML={{ __html: content?.title || "Describe tu requerimiento" }}
        style={{ color: textColor }}
      />
      <p
        className="mt-3 leading-7"
        data-editor-field="section-intro"
        dangerouslySetInnerHTML={{
          __html:
            content?.content ||
            "Completa los datos y prepararemos un correo con la información necesaria para iniciar la coordinación.",
        }}
        style={{ color: textColor }}
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field id="nombre" label={stripHtml(fields[0]?.title)} textColor={textColor}>
          <input autoCorrect="on" className="contact-input-light" lang="es" name="nombre" placeholder={stripHtml(fields[0]?.text)} required={fields[0]?.required ?? true} spellCheck />
        </Field>

        <Field id="correo" label={stripHtml(fields[1]?.title)} textColor={textColor}>
          <input className="contact-input-light" name="correo" placeholder={stripHtml(fields[1]?.text)} required={fields[1]?.required ?? true} type="email" />
        </Field>

        <Field id="telefono" label={stripHtml(fields[2]?.title)} textColor={textColor}>
          <input className="contact-input-light" name="telefono" placeholder={stripHtml(fields[2]?.text)} />
        </Field>

        <Field id="institucion" label={stripHtml(fields[3]?.title)} textColor={textColor}>
          <input className="contact-input-light" name="institucion" placeholder={stripHtml(fields[3]?.text)} />
        </Field>

        <Field id="asunto" label={stripHtml(fields[4]?.title)} textColor={textColor}>
          <input className="contact-input-light" name="asunto" placeholder={stripHtml(fields[4]?.text)} />
        </Field>

        <Field id="tipo" label={stripHtml(fields[5]?.title)} textColor={textColor}>
          <select className="contact-input-light" defaultValue="" name="tipo">
            <option disabled value="">
              {stripHtml(fields[5]?.text)}
            </option>
            {requestTypes.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field id="mensaje" label={stripHtml(fields[6]?.title)} textColor={textColor}>
          <textarea autoCorrect="on" className="contact-input-light" lang="es" name="mensaje" placeholder={stripHtml(fields[6]?.text)} required={fields[6]?.required ?? true} rows={6} spellCheck />
        </Field>
      </div>

      <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          className="inline-flex items-center justify-center rounded-2xl border px-6 py-4 text-sm font-extrabold transition"
          style={{
            backgroundColor: primaryButton?.backgroundColor || "#213255",
            borderColor: primaryButton?.borderColor || primaryButton?.backgroundColor || "#213255",
            color: primaryButton?.textColor || "#ffffff",
            display: primaryButton?.visible === false ? "none" : undefined,
          }}
          type="submit"
        >
          {primaryButton?.label || "Enviar solicitud"}
        </button>

        <a
          className="inline-flex items-center justify-center rounded-2xl border px-6 py-4 text-sm font-extrabold"
          href={secondaryButton?.href || "mailto:contacto@vaicmedical.cl"}
          style={{
            backgroundColor: secondaryButton?.backgroundColor || "#eaf8fc",
            borderColor: secondaryButton?.borderColor || accent,
            color: secondaryButton?.textColor || textColor,
            display: secondaryButton?.visible === false ? "none" : undefined,
          }}
        >
          {secondaryButton?.label || "Escribir directo"}
        </a>
      </div>

      {directCard.visible !== false && (
        <div
          className="mt-6 rounded-2xl border p-4"
          data-contact-direct-card
          style={{
            backgroundColor: directCard.backgroundColor || "#f6fbfd",
            borderColor: directCard.borderColor || accent,
            color: directCard.textColor || textColor,
          }}
        >
          <p className="text-sm font-bold" data-contact-direct-title dangerouslySetInnerHTML={{ __html: directCard.title || "Correo directo" }} />
          <p className="mt-2 text-sm leading-6" data-contact-direct-text dangerouslySetInnerHTML={{ __html: directCard.text || "" }} />
        </div>
      )}

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
  textColor = "#34466f",
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  textColor?: string;
}) {
  return (
    <label className="block text-sm font-bold" data-form-field={id} style={{ color: textColor }}>
      <span data-form-label>{label}</span>
      {children}
    </label>
  );
}
