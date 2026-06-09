import { CatalogBrowser } from "@/components/CatalogBrowser";
import { LocalCreatedCatalogSections } from "@/components/LocalCreatedContent";
import { catalogLines } from "@/data/catalog-products";

export default function CatalogoPage() {
  return (
    <main className="min-h-screen bg-[#f6fbfd]">
      <section
        className="border-b border-[#d7e9ef] bg-white"
        data-editor-section="hero"
      >
        <div className="mx-auto max-w-[1560px] px-5 py-16 sm:px-8 lg:py-20">
          <p
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]"
            data-editor-field="section-eyebrow"
          >
            Catálogo
          </p>
          <h1
            className="mt-4 max-w-6xl text-5xl font-semibold leading-tight text-[#213255] sm:text-6xl"
            data-editor-field="section-title"
          >
            Líneas y productos para organizar solicitudes técnicas.
          </h1>
          <p
            className="mt-6 max-w-4xl text-lg leading-8 text-[#34466f]"
            data-editor-field="section-intro"
          >
            Explora equipos, componentes y servicios por línea. Selecciona una
            categoría y utiliza la búsqueda para encontrar rápidamente el
            producto que necesitas.
          </p>
        </div>
      </section>

      <CatalogBrowser lines={catalogLines} />

      <section className="mx-auto max-w-[1560px] px-5 pb-16 sm:px-8">
        <LocalCreatedCatalogSections />
      </section>
    </main>
  );
}
