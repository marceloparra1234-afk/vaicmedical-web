import Link from "next/link";

const values = [
  {
    letter: "V",
    title: "Vida",
    text: "Trabajamos para preservar lo más valioso: la vida.",
    icon: "life",
  },
  {
    letter: "A",
    title: "Atención",
    text: "Escuchamos, entendemos y respondemos con excelencia.",
    icon: "attention",
  },
  {
    letter: "I",
    title: "Innovación",
    text: "Innovamos para anticipar y servir mejor.",
    icon: "innovation",
  },
  {
    letter: "C",
    title: "Cuidado",
    text: "Cada detalle importa; cuidamos personas, procesos y equipos.",
    icon: "care",
  },
];

export default function NosotrosPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" data-editor-section="hero">
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
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8" data-editor-section="identidad-corporativa">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              [
                "Misión",
                "Recuperar y mantener equipos médicos críticos con respuesta técnica clara, trazable y orientada a la continuidad de la atención.",
              ],
              [
                "Visión",
                "Ser un aliado confiable para instituciones que necesitan equipos disponibles, procesos ordenados y soporte técnico oportuno.",
              ],
            ].map(([title, text]) => (
              <article
                className="rounded-3xl border border-[#c7e9f2] bg-white p-8 shadow-sm"
                data-editor-section={title === "Misión" ? "mision" : "vision"}
                key={title}
              >
                <div className="mb-6 h-2 w-14 rounded-full bg-[#58c3de]" />
                <h2 className="text-3xl font-semibold">{title}</h2>
                <p className="mt-4 leading-7 text-[#34466f]">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border border-[#c7e9f2] bg-white p-6 shadow-sm sm:p-8" data-editor-section="valores">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end" data-editor-section="valores-intro">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]" data-editor-field="section-eyebrow">
                  Valores
                </p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight" data-editor-field="section-title">
                  VAIC como forma de trabajo.
                </h2>
              </div>
              <p className="max-w-xl leading-7 text-[#34466f]" data-editor-field="section-intro">
                Nuestros valores ordenan la manera en que atendemos cada
                requerimiento técnico.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-4">
              {values.map((value) => (
                <article
                  className="rounded-3xl border border-[#d7e9ef] bg-[#f6fbfd] p-5"
                  data-editor-section={`valor-${value.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                  key={value.letter}
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#213255] text-2xl font-semibold text-white">
                      {value.letter}
                    </div>
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#58c3de]/15 text-[#213255]">
                      <ValueIcon name={value.icon} />
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold">{value.title}</h3>
                  <p className="mt-3 leading-7 text-[#34466f]">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8" data-editor-section="cta-servicios">
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

function ValueIcon({ name }: { name: string }) {
  if (name === "life") {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12h4l2-5 4 10 2-5h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "attention") {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "innovation") {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18h6M10 21h4M8 13a6 6 0 1 1 8 0c-1.2 1-1.5 2-1.5 3h-5c0-1-.3-2-1.5-3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7-4-7-10V6l7-3 7 3v5c0 6-7 10-7 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
