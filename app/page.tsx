import Image from "next/image";
import Link from "next/link";

const workflow = [
  ["Solicitud", "Recibimos el requerimiento y clasificamos la criticidad."],
  ["Diagnóstico", "Evaluamos la falla, el estado del equipo y sus condiciones de uso."],
  ["Reparación", "Ejecutamos mantención o reparación con criterio técnico."],
  ["Informe", "Documentamos el trabajo realizado y las recomendaciones."],
];

const catalogItems = [
  "Camas clínicas",
  "Camillas",
  "Mesas quirúrgicas",
  "Lámparas",
];

const posts = [
  "Señales de desgaste en camas clínicas antes de una falla crítica",
  "Mantención preventiva en camillas: puntos que conviene revisar",
  "Cómo documentar reparaciones para mejorar la continuidad técnica",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <main>
      <section className="w-full border-b border-[#d7e9ef] bg-white">
        <div className="mx-auto grid max-w-[calc(100vw-4rem)] items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8 lg:py-14 lg:pl-[max(2rem,calc((100vw-80rem)/2))] lg:pr-8">
          <div className="flex max-w-[33rem] flex-col items-center text-center">
            <p className="mb-5 inline-flex max-w-full rounded-full border border-[#b9e8f2] bg-[#f6fbfd] px-5 py-2 text-sm font-semibold text-[#213255]">
              Mantención y reparación de equipos médicos
            </p>
            <h1 className="text-5xl font-semibold leading-[1.03] text-[#213255] sm:text-6xl lg:text-7xl">
              Soporte técnico para mantener operativa la atención en salud.
            </h1>
            <p className="mt-6 max-w-[36rem] text-lg leading-8 text-[#34466f]">
              Reparamos y mantenemos camas clínicas, camillas, mesas
              quirúrgicas, lámparas, monitores multiparámetros y otros equipos
              esenciales para la continuidad asistencial.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className="rounded-full bg-[#213255] px-7 py-4 text-center font-semibold text-white transition hover:bg-[#34466f]"
                href="/contacto"
              >
                Solicitar soporte
              </Link>
              <Link
                className="rounded-full border border-[#9eddea] bg-white px-7 py-4 text-center font-semibold text-[#213255] transition hover:border-[#58c3de]"
                href="/servicios"
              >
                Ver servicios
              </Link>
            </div>
          </div>

          <div className="relative w-full">
            <div className="aspect-[2.12/1] w-full overflow-hidden rounded-[2rem] border border-[#d7e9ef] bg-[#eaf8fc] shadow-2xl shadow-[#213255]/10">
              <Image
                src="/medical-dashboard.svg"
                alt="Equipos médicos en mantención y monitoreo técnico VaicMedical"
                width={1400}
                height={560}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d7e9ef] bg-[#f6fbfd]">
        <div className="mx-auto grid max-w-7xl gap-0 px-5 py-8 sm:px-8 lg:grid-cols-4">
          {workflow.map(([title, text], index) => (
            <article
              className="relative flex min-h-40 flex-col items-center justify-center bg-[#213255] px-9 py-6 text-center text-white shadow-sm lg:mr-5 lg:clip-path-none lg:[clip-path:polygon(0_0,calc(100%-22px)_0,100%_50%,calc(100%-22px)_100%,0_100%,22px_50%)] lg:first:[clip-path:polygon(0_0,calc(100%-22px)_0,100%_50%,calc(100%-22px)_100%,0_100%)]"
              key={title}
            >
              <span className="font-mono text-xs font-semibold text-[#58c3de]">
                0{index + 1}
              </span>
              <h2 className="mt-3 text-xl font-semibold">
                {title}
              </h2>
              <p className="mt-2 max-w-52 text-sm leading-6 text-white/70">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#eaf8fc]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionLabel>Nosotros</SectionLabel>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Trabajo técnico para equipos que no pueden quedar fuera de
              servicio.
            </h2>
          </div>
          <div className="grid gap-8">
            <p className="text-lg leading-8 text-[#34466f]">
              VaicMedical se enfoca en diagnosticar, reparar y mantener equipos
              médicos de uso intensivo. Nuestro trabajo combina coordinación,
              criterio técnico y documentación para que cada requerimiento tenga
              seguimiento.
            </p>
            <Link
              className="w-fit rounded-full bg-[#213255] px-7 py-4 font-semibold text-white transition hover:bg-[#34466f]"
              href="/nosotros"
            >
              Conocer VaicMedical
            </Link>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 sm:px-8 md:grid-cols-3">
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
              <h3 className="text-2xl font-semibold text-[#213255]">{title}</h3>
              <p className="mt-4 leading-7 text-[#34466f]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#213255] px-5 py-20 text-center text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="text-center">
            <SectionLabel>Servicios</SectionLabel>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Mantención preventiva, reparación correctiva y soporte en terreno.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Atendemos equipos esenciales para la operación diaria, con foco en
              recuperar disponibilidad y reducir tiempos fuera de servicio.
            </p>
            <Link
              className="mt-8 inline-flex rounded-full bg-[#58c3de] px-7 py-4 font-semibold text-[#213255] transition hover:bg-white"
              href="/servicios"
            >
              Ver servicios
            </Link>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#58c3de]/35 bg-[#eaf8fc] shadow-2xl shadow-black/20">
            <Image
              src="/service-maintenance.svg"
              alt="Representación de mantención y reparación de equipos médicos"
              width={900}
              height={620}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionLabel>Catálogo</SectionLabel>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Categorías para ordenar equipos, repuestos y solicitudes técnicas.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#34466f]">
              El catálogo será la base para fichas, fotografías, referencias,
              repuestos y requerimientos asociados a cada equipo.
            </p>
            <Link
              className="mt-8 inline-flex rounded-full bg-[#213255] px-7 py-4 font-semibold text-white transition hover:bg-[#34466f]"
              href="/catalogo"
            >
              Ver catálogo
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {catalogItems.map((item) => (
              <Link
                className="group flex aspect-square flex-col justify-between rounded-3xl border border-[#d7e9ef] bg-[#f6fbfd] p-6 transition hover:border-[#58c3de] hover:bg-white"
                href="/catalogo"
                key={item}
              >
                <div className="flex-1 rounded-xl bg-gradient-to-br from-[#dff6fb] to-white" />
                <div className="pt-5">
                  <h3 className="text-xl font-semibold">{item}</h3>
                  <p className="mt-2 text-sm font-semibold text-[#58c3de]">
                    Ver categoría
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6fbfd]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel>Blog</SectionLabel>
              <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                Criterios técnicos para cuidar equipos médicos.
              </h2>
            </div>
            <Link
              className="w-fit rounded-full border border-[#9eddea] bg-white px-7 py-4 font-semibold text-[#213255] transition hover:border-[#58c3de]"
              href="/blog"
            >
              Ver blog
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <article className="border border-[#d7e9ef] bg-white p-7" key={post}>
                <p className="font-mono text-xs font-semibold text-[#58c3de]">
                  VAIC INSIGHTS
                </p>
                <h3 className="mt-5 text-xl font-semibold leading-7">{post}</h3>
                <p className="mt-6 text-sm font-semibold text-[#34466f]">
                  Próximamente
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <SectionLabel>Contacto</SectionLabel>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Coordinemos una evaluación técnica para tus equipos.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#34466f]">
              Puedes solicitar una visita, coordinar una reparación o consultar
              por mantenciones programadas.
            </p>
          </div>
          <div className="rounded-3xl bg-[#213255] p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
              Canal directo
            </p>
            <a
              className="mt-5 block text-2xl font-semibold"
              href="mailto:contacto@vaicmedical.cl"
            >
              contacto@vaicmedical.cl
            </a>
            <Link
              className="mt-8 inline-flex rounded-full bg-[#58c3de] px-7 py-4 font-semibold text-[#213255] transition hover:bg-white"
              href="/contacto"
            >
              Solicitar soporte
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
