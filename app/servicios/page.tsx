import Link from "next/link";

const services = [
  {
    title: "Mantención preventiva",
    text: "Revisión programada, ajustes, limpieza técnica y control de condiciones para reducir fallas futuras.",
  },
  {
    title: "Reparación correctiva",
    text: "Diagnóstico y reparación de camas clínicas, camillas, mesas quirúrgicas, lámparas y otros equipos.",
  },
  {
    title: "Soporte técnico",
    text: "Respuesta en terreno, evaluación de fallas, informes técnicos y coordinación de requerimientos.",
  },
  {
    title: "Monitores multiparámetros",
    text: "Revisión técnica, detección de fallas, recuperación operativa y recomendaciones de continuidad.",
  },
  {
    title: "Equipos de pabellón",
    text: "Trabajo sobre mesas quirúrgicas, lámparas y componentes asociados a espacios de procedimiento.",
  },
  {
    title: "Gestión de requerimientos",
    text: "Ordenamiento de solicitudes, priorización por criticidad y seguimiento del estado de atención.",
  },
];

export default function ServiciosPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" data-editor-section="hero">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
          Servicios
        </p>
        <h1 className="mt-3 max-w-5xl text-6xl font-semibold leading-tight sm:text-7xl">
          Mantención y reparación para equipos médicos de uso intensivo.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#34466f]">
          Atendemos equipos esenciales para la operación diaria, con un enfoque
          práctico: diagnosticar, reparar, documentar y mantener continuidad.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 sm:px-8 md:grid-cols-2 lg:grid-cols-3" data-editor-section="servicios">
        {services.map((service) => (
          <article
            key={service.title}
            className="rounded-2xl border border-[#d7e9ef] bg-white p-7 shadow-sm"
            data-editor-section={`servicio-${service.title
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .split(" ")[0]}`}
          >
            <div className="mb-8 h-2 w-14 rounded-full bg-[#58c3de]" />
            <h2 className="text-2xl font-semibold">{service.title}</h2>
            <p className="mt-4 leading-7 text-[#34466f]">{service.text}</p>
          </article>
        ))}
      </section>

      <section className="bg-[#213255] px-5 py-20 text-white sm:px-8" data-editor-section="metodo">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
              Método de trabajo
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Diagnóstico, ejecución y trazabilidad técnica.
            </h2>
          </div>
          <div className="grid gap-0 lg:grid-cols-3">
            {[
              ["Recibimos el requerimiento", "Clasificamos la criticidad."],
              ["Evaluamos el equipo", "Revisamos la falla y condiciones de operación."],
              ["Ejecutamos el trabajo", "Reparamos o mantenemos con informe de respaldo."],
            ].map(([title, text], index) => (
              <article
                key={title}
                className="relative flex min-h-40 flex-col items-center justify-center bg-[#213255] px-9 py-6 text-center text-white shadow-sm lg:mr-5 lg:[clip-path:polygon(0_0,calc(100%-22px)_0,100%_50%,calc(100%-22px)_100%,0_100%,22px_50%)] lg:first:[clip-path:polygon(0_0,calc(100%-22px)_0,100%_50%,calc(100%-22px)_100%,0_100%)]"
              >
                <span className="font-mono text-xs font-semibold text-[#58c3de]">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-52 text-sm leading-6 text-white/70">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8" data-editor-section="cta-contacto">
        <Link
          className="inline-flex rounded-full bg-[#213255] px-7 py-4 font-semibold text-white transition hover:bg-[#34466f]"
          href="/contacto"
        >
          Solicitar soporte
        </Link>
      </section>
    </main>
  );
}
