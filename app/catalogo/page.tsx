import Link from "next/link";

const catalogLines = [
  {
    id: "camas-camillas",
    name: "Camas clínicas y camillas",
    description:
      "Equipos de traslado, hospitalización y apoyo diario para servicios clínicos.",
    summary: "Mantención, diagnóstico y reparación de sistemas mecánicos y eléctricos.",
    products: [
      {
        name: "Camas clínicas eléctricas",
        type: "Equipo clínico",
        description:
          "Revisión de actuadores, barandas, controles, ruedas, frenos y sistemas de elevación.",
      },
      {
        name: "Camillas de traslado",
        type: "Traslado",
        description:
          "Ajuste de estructura, ruedas, frenos, barandas y mecanismos de altura o respaldo.",
      },
      {
        name: "Barandas y accesorios",
        type: "Componente",
        description:
          "Evaluación y reposición de piezas asociadas a seguridad, fijación y operación.",
      },
    ],
  },
  {
    id: "pabellon-procedimientos",
    name: "Pabellón y procedimientos",
    description:
      "Soporte técnico para equipos usados en pabellones, unidades críticas y salas de procedimiento.",
    summary: "Trabajo técnico sobre equipos que requieren continuidad, precisión y seguridad.",
    products: [
      {
        name: "Mesas quirúrgicas",
        type: "Pabellón",
        description:
          "Diagnóstico de movimientos, controles, columnas, bases, frenos y módulos de operación.",
      },
      {
        name: "Lámparas quirúrgicas",
        type: "Iluminación",
        description:
          "Revisión de brazos, cabezales, intensidad lumínica, alimentación y conexiones.",
      },
      {
        name: "Brazos y soportes",
        type: "Accesorio",
        description:
          "Ajuste de articulaciones, fijaciones, estabilidad y funcionamiento de componentes móviles.",
      },
    ],
  },
  {
    id: "monitoreo-equipos",
    name: "Monitoreo y equipos clínicos",
    description:
      "Revisión técnica de equipos de apoyo clínico, monitoreo y continuidad asistencial.",
    summary: "Inspección, evaluación funcional y reparación según condiciones de uso.",
    products: [
      {
        name: "Monitores multiparámetros",
        type: "Monitoreo",
        description:
          "Evaluación de funcionamiento, conectores, módulos, alarmas, fuentes y accesorios.",
      },
      {
        name: "Cables y sensores",
        type: "Accesorio",
        description:
          "Revisión de continuidad, conectividad, desgaste físico y compatibilidad operativa.",
      },
      {
        name: "Fuentes y módulos",
        type: "Componente",
        description:
          "Diagnóstico de alimentación, módulos internos y fallas asociadas a operación.",
      },
    ],
  },
  {
    id: "repuestos-soporte",
    name: "Repuestos y soporte técnico",
    description:
      "Componentes y apoyo técnico para extender la vida útil de equipos médicos esenciales.",
    summary: "Gestión de repuestos, informes técnicos y recomendaciones de continuidad.",
    products: [
      {
        name: "Actuadores y motores",
        type: "Repuesto",
        description:
          "Componentes para sistemas de elevación, respaldo, inclinación y ajuste de equipos.",
      },
      {
        name: "Controles y botoneras",
        type: "Control",
        description:
          "Revisión o reposición de mandos, placas, cables y puntos de operación del usuario.",
      },
      {
        name: "Ruedas y frenos",
        type: "Movilidad",
        description:
          "Componentes para traslado seguro, bloqueo, estabilidad y maniobrabilidad.",
      },
    ],
  },
];

export default function CatalogoPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-[#d7e9ef] bg-[#f2fbfd]">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:px-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
              Catálogo
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight text-[#213255] sm:text-6xl">
              Líneas y productos para organizar solicitudes técnicas.
            </h1>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-[#34466f] lg:justify-self-end">
            Una vista inicial para ordenar equipos, repuestos y servicios por
            línea. Más adelante podremos conectar esta sección con el editor
            para cargar fotografías, fichas y disponibilidad.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-8 px-6 py-14 sm:px-10 lg:grid-cols-[320px_1fr] lg:px-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[28px] border border-[#ccebf2] bg-white p-5 shadow-sm">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
              Líneas
            </p>
            <nav className="mt-4 grid gap-2">
              {catalogLines.map((line, index) => (
                <a
                  className="group rounded-2xl border border-transparent px-4 py-4 transition hover:border-[#b9e7f1] hover:bg-[#eef9fc]"
                  href={`#${line.id}`}
                  key={line.id}
                >
                  <span className="text-xs font-semibold text-[#58c3de]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block text-lg font-semibold text-[#213255]">
                    {line.name}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="grid gap-10">
          {catalogLines.map((line, lineIndex) => (
            <section
              className="scroll-mt-28 overflow-hidden rounded-[32px] border border-[#d7e9ef] bg-white shadow-sm"
              id={line.id}
              key={line.id}
            >
              <div className="grid gap-8 bg-[#213255] p-7 text-white sm:p-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
                    Línea {String(lineIndex + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                    {line.name}
                  </h2>
                </div>
                <div>
                  <p className="text-lg leading-8 text-[#dff7fb]">
                    {line.description}
                  </p>
                  <p className="mt-4 rounded-2xl border border-white/15 bg-white/8 px-5 py-4 text-sm leading-6 text-white/85">
                    {line.summary}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 bg-[#f8fdfe] p-5 sm:p-7 lg:grid-cols-3">
                {line.products.map((product, productIndex) => (
                  <article
                    className="group overflow-hidden rounded-[26px] border border-[#d7e9ef] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#58c3de] hover:shadow-md"
                    key={product.name}
                  >
                    <div className="relative aspect-square bg-[#eaf8fc]">
                      <div className="absolute inset-5 rounded-[22px] border border-[#bdebf3] bg-white/70" />
                      <div className="absolute left-6 top-6 rounded-full bg-[#213255] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                        {product.type}
                      </div>
                      <div className="absolute inset-x-8 bottom-8 grid grid-cols-3 gap-3">
                        <span className="h-20 rounded-2xl bg-[#58c3de]/75" />
                        <span className="h-20 rounded-2xl bg-[#213255]/90" />
                        <span className="h-20 rounded-2xl bg-[#dff7fb]" />
                      </div>
                      <div className="absolute right-7 top-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-semibold text-[#58c3de] shadow-sm">
                        {String(productIndex + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold text-[#213255]">
                        {product.name}
                      </h3>
                      <p className="mt-4 min-h-24 leading-7 text-[#34466f]">
                        {product.description}
                      </p>
                      <Link
                        className="mt-6 inline-flex rounded-full border border-[#58c3de] px-5 py-3 text-sm font-semibold text-[#213255] transition hover:bg-[#58c3de] hover:text-white"
                        href="/contacto"
                      >
                        Consultar
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
