import { CatalogExperience } from "@/components/CatalogExperience";
import { getPublicCatalog } from "@/data/catalog-service";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const lines = await getPublicCatalog();

  return (
    <main className="min-h-screen bg-[#f6fbfd]">
      <section className="border-b border-[#d7e9ef] bg-white" data-editor-section="hero">
        <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]" data-editor-field="section-eyebrow">
            Catálogo
          </p>
          <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-tight text-[#213255] sm:text-6xl" data-editor-field="section-title">
            Equipos, componentes y soporte técnico.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#34466f]" data-editor-field="section-intro">
            Explora las líneas de VaicMedical y revisa la información técnica de cada producto.
          </p>
        </div>
      </section>

      <CatalogExperience lines={lines} />
    </main>
  );
}
