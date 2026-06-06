import Link from "next/link";

const categories = [
  "Camas clínicas",
  "Camillas",
  "Mesas quirúrgicas",
  "Lámparas",
  "Monitores multiparámetros",
  "Repuestos y componentes",
];

export default function CatalogoPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
          Catálogo
        </p>
        <h1 className="mt-3 max-w-5xl text-6xl font-semibold leading-tight sm:text-7xl">
          Equipos y categorías para ordenar solicitudes técnicas.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#34466f]">
          Esta página será la base para fichas, repuestos, referencias técnicas
          y solicitudes asociadas a cada tipo de equipo.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 sm:px-8 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((item) => (
          <article
            className="rounded-2xl border border-[#d7e9ef] bg-white p-8 shadow-sm"
            key={item}
          >
            <div className="mb-8 h-2 w-14 rounded-full bg-[#58c3de]" />
            <h2 className="text-2xl font-semibold">{item}</h2>
            <p className="mt-4 leading-7 text-[#34466f]">
              Categoría inicial para organizar mantenciones, reparaciones,
              fichas técnicas y consultas comerciales.
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <Link
          className="inline-flex rounded-full bg-[#213255] px-7 py-4 font-semibold text-white transition hover:bg-[#34466f]"
          href="/contacto"
        >
          Solicitar información
        </Link>
      </section>
    </main>
  );
}
