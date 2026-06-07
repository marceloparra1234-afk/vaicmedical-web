import Link from "next/link";
import { catalogLines } from "@/data/catalog-products";

export default function CatalogoPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-[#d7e9ef] bg-[#f2fbfd]" data-editor-section="hero">
        <div className="mx-auto max-w-[1500px] px-6 py-16 sm:px-10 lg:px-14">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
            Catálogo
          </p>
          <h1 className="mt-4 max-w-[1280px] text-5xl font-semibold leading-tight text-[#213255] sm:text-6xl">
            Líneas y productos para organizar solicitudes técnicas.
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-[#34466f]">
            Una vista inicial para ordenar equipos, repuestos y servicios por
            línea. Más adelante podremos conectar esta sección con el editor
            para cargar fotografías, fichas y disponibilidad.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-8 px-6 py-14 sm:px-10 lg:grid-cols-[320px_1fr] lg:px-14" data-editor-section="catalogo">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
            Líneas
          </p>
          <nav className="grid gap-3">
            {catalogLines.map((line, index) => (
              <a
                className="group rounded-[22px] border border-[#ccebf2] bg-white px-5 py-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#58c3de] hover:bg-[#eef9fc] hover:shadow-md"
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
        </aside>

        <div className="grid gap-10">
          {catalogLines.map((line, lineIndex) => (
            <section
              className="scroll-mt-28 overflow-hidden rounded-[32px] border border-[#d7e9ef] bg-white shadow-sm"
              data-editor-section={`linea-${String(lineIndex + 1).padStart(2, "0")}`}
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
                        href={`/catalogo/${product.slug}`}
                      >
                        Ver producto
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
