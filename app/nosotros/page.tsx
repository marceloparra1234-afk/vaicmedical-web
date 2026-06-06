import Link from "next/link";

export default function NosotrosPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
          Nosotros
        </p>
        <h1 className="mt-3 max-w-5xl text-6xl font-semibold leading-tight sm:text-7xl">
          Equipo técnico dedicado a mantener equipos médicos operativos.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#34466f]">
          VaicMedical trabaja en mantención y reparación de equipamiento médico,
          con foco en continuidad, diagnóstico claro y respuesta técnica para
          entornos de alta exigencia.
        </p>
      </section>

      <section className="bg-[#eaf8fc]">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-16 sm:px-8 md:grid-cols-3">
          {[
            ["Misión", "Recuperar y mantener equipos médicos críticos con respuesta técnica clara y trazable."],
            ["Visión", "Ser un aliado confiable para instituciones que necesitan continuidad operativa."],
            ["Valores", "Rigor técnico, responsabilidad, orden documental y compromiso con cada requerimiento."],
          ].map(([title, text]) => (
            <article
              className="rounded-3xl border border-[#c7e9f2] bg-white p-7 shadow-sm"
              key={title}
            >
              <div className="mb-6 h-2 w-14 rounded-full bg-[#58c3de]" />
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="mt-4 leading-7 text-[#34466f]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Link
          className="inline-flex rounded-full bg-[#213255] px-7 py-4 font-semibold text-white transition hover:bg-[#34466f]"
          href="/servicios"
        >
          Conocer servicios
        </Link>
      </section>
    </main>
  );
}
