import { Suspense } from "react";
import { CatalogExperience } from "@/components/CatalogExperience";
import { getCatalogSettings, getPublicCatalog } from "@/data/catalog-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CatalogoPage() {
  const [lines, settings] = await Promise.all([getPublicCatalog(), getCatalogSettings()]);

  return (
    <main className="min-h-screen bg-[#f6fbfd]">
      <section className="border-b border-[#d7e9ef] bg-white" data-editor-section="hero">
        <div className="mx-auto px-5 py-16 sm:px-8 lg:py-20" style={{ maxWidth: settings.maxWidth }}>
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

      <Suspense fallback={<div className="mx-auto min-h-96 px-5 py-16 sm:px-8" style={{ maxWidth: settings.maxWidth }} />}>
        <CatalogExperience lines={lines} maxWidth={settings.maxWidth} />
      </Suspense>
    </main>
  );
}
