import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

const infoItems = [
  ["Correo", "contacto@vaicmedical.cl"],
  ["Cobertura", "Chile y Latinoamérica"],
  ["Respuesta", "Atención técnica y comercial"],
  ["Especialidad", "Mantención y reparación"],
];

export default function ContactoPage() {
  return (
    <main className="bg-[#f6fbfd] text-[#213255]">
      <section className="relative overflow-hidden border-b border-[#d7e9ef] bg-white">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[#eaf8fc]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:py-24">
          <section>
            <Link
              href="/"
              className="inline-flex text-sm font-bold text-[#58c3de]"
            >
              ← Volver al inicio
            </Link>

            <p className="mt-14 text-sm font-bold uppercase tracking-[0.24em] text-[#58c3de]">
              Contacto técnico
            </p>

            <h1 className="mt-5 max-w-3xl text-6xl font-semibold leading-[1.02] md:text-7xl">
              Coordinemos una evaluación técnica para tus equipos.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#34466f]">
              Cuéntanos qué equipo presenta falla, qué tipo de mantención
              necesitas o qué requerimiento técnico quieres programar.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {infoItems.map(([label, value]) => (
                <div
                  className="rounded-3xl border border-[#d7e9ef] bg-[#f6fbfd] p-5"
                  key={label}
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#58c3de]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#34466f]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="relative">
            <ContactForm />
          </div>
        </div>
      </section>

    </main>
  );
}
