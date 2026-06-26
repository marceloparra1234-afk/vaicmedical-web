import Link from "next/link";
import { ContactForm, type ContactFormContent } from "@/components/ContactForm";
import { getSiteContent } from "@/lib/supabase-admin";

type ContactItem = {
  id?: string;
  title?: string;
  text?: string;
  visible?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
};

type ContactSection = ContactFormContent & {
  items?: ContactItem[];
};

const defaultInfoItems = [
  ["correo", "Correo", "contacto@vaicmedical.cl"],
  ["cobertura", "Cobertura", "Chile y Latinoamérica"],
  ["respuesta", "Respuesta", "Atención técnica y comercial"],
  ["especialidad", "Especialidad", "Mantención y reparación"],
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactoPage() {
  const content = await getSiteContent<Record<string, ContactSection>>("contacto");
  const hero = content?.["Hero principal"];
  const info = content?.["Información de contacto"];
  const form = content?.Formulario;
  const infoItems = defaultInfoItems.map(([id, title, text]) => ({
    id,
    title,
    text,
    ...info?.items?.find((item) => item.id === id),
  }));

  return (
    <main
      className="text-[#213255]"
      style={{ backgroundColor: hero?.backgroundColor || "#f6fbfd" }}
    >
      <section
        className="relative overflow-hidden"
        data-editor-section="hero"
        style={{ backgroundColor: hero?.backgroundColor || "#ffffff" }}
      >
        <div
          className="absolute right-0 top-0 h-full w-1/2"
          style={{ backgroundColor: hero?.itemColor || "#eaf8fc" }}
        />
        <div
          className="relative mx-auto grid max-w-[1500px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(620px,1.25fr)] lg:gap-16 lg:py-20"
          data-editor-section="contacto"
        >
          <section data-editor-section="contacto-hero">
            <Link
              className="inline-flex text-sm font-bold"
              href="/"
              style={{ color: hero?.accentColor || "#58c3de" }}
            >
              ← Volver al inicio
            </Link>

            <p
              className="mt-14 text-sm font-bold uppercase tracking-[0.24em]"
              data-editor-field="section-eyebrow"
              dangerouslySetInnerHTML={{ __html: hero?.eyebrow || "Contacto técnico" }}
              style={{ color: hero?.accentColor || "#58c3de" }}
            />

            <h1
              className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.06] md:text-6xl"
              data-editor-field="section-title"
              dangerouslySetInnerHTML={{
                __html: hero?.title || "Coordinemos una evaluación técnica para tus equipos.",
              }}
              style={{ color: hero?.textColor || "#213255" }}
            />

            <p
              className="mt-8 max-w-2xl text-lg leading-8"
              data-editor-field="section-intro"
              dangerouslySetInnerHTML={{
                __html:
                  hero?.content ||
                  "Cuéntanos qué equipo presenta falla, qué tipo de mantención necesitas o qué requerimiento técnico quieres programar.",
              }}
              style={{ color: hero?.textColor || "#34466f" }}
            />

            <div className="mt-10 grid gap-4 xl:grid-cols-2" data-editor-section="contacto-info">
              {infoItems.map((item) => (
                <div
                  className="rounded-3xl border p-5"
                  data-editor-section={`info-${item.id}`}
                  key={item.id}
                  style={{
                    backgroundColor: item.backgroundColor || info?.itemColor || "#f6fbfd",
                    borderColor: item.borderColor || info?.accentColor || "#d7e9ef",
                    color: item.textColor || info?.textColor || "#213255",
                    display: item.visible === false ? "none" : undefined,
                  }}
                >
                  <p
                    className="text-xs font-extrabold uppercase tracking-[0.16em]"
                    dangerouslySetInnerHTML={{ __html: item.title || "" }}
                    style={{ color: item.textColor || info?.accentColor || "#58c3de" }}
                  />
                  <p
                    className="mt-2 text-sm leading-6"
                    dangerouslySetInnerHTML={{ __html: item.text || "" }}
                    style={{ color: item.textColor || info?.textColor || "#34466f" }}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="relative" data-editor-section="formulario">
            <ContactForm content={form} />
          </div>
        </div>
      </section>
    </main>
  );
}
