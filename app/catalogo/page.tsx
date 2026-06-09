import { CatalogBrowser } from "@/components/CatalogBrowser";
import { catalogLines, type CatalogLine, type CatalogProduct } from "@/data/catalog-products";
import { getManagedCreatedContent } from "@/data/supabase-created-content";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const [createdLines, createdProducts] = await Promise.all([
    getManagedCreatedContent("line"),
    getManagedCreatedContent("product"),
  ]);
  const managedLineSlugs = new Set(createdLines.map((line) => line.slug));
  const managedProductBySlug = new Map(createdProducts.map((product) => [product.slug, product]));
  const managedLines: CatalogLine[] = createdLines
    .filter((line) => line.active !== false)
    .map((line) => {
      const baseLine = catalogLines.find((item) => item.id === line.slug);
      const baseProducts = (baseLine?.products || [])
        .filter((product) => managedProductBySlug.get(product.slug)?.active !== false)
        .map((product) => {
          const override = managedProductBySlug.get(product.slug);
          return override ? toCatalogProduct(override) : product;
        });
      const baseProductSlugs = new Set(baseProducts.map((product) => product.slug));
      const newProducts = createdProducts
        .filter(
          (product) =>
            product.active !== false &&
            product.line === line.title &&
            !baseProductSlugs.has(product.slug),
        )
        .map(toCatalogProduct);

      return {
        id: line.slug,
        name: line.title || "Línea",
        description: line.excerpt || "",
        summary: line.body || "",
        products: [...baseProducts, ...newProducts],
      };
    });
  const baseLines = catalogLines
    .filter((line) => !managedLineSlugs.has(line.id))
    .map((line) => ({
      ...line,
      products: line.products
        .filter((product) => managedProductBySlug.get(product.slug)?.active !== false)
        .map((product) => {
          const override = managedProductBySlug.get(product.slug);
          return override ? toCatalogProduct(override) : product;
        }),
    }));
  const lines = [...managedLines, ...baseLines];

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

      <CatalogBrowser lines={lines} />
    </main>
  );
}

function toCatalogProduct(product: Awaited<ReturnType<typeof getManagedCreatedContent>>[number]): CatalogProduct {
  return {
    slug: product.slug,
    name: product.title || "Producto",
    featured: product.featured,
    type: product.line || "Producto",
    description: product.excerpt || "",
    longDescription: product.body || "",
    brand: product.brand || "Multimarca",
    model: product.model || "Según producto",
    internalCode: product.internalCode || "",
    tags: product.tags || "",
    image: product.primaryImage || "/service-maintenance.svg",
    gallery: (product.secondaryImages || []).map((image) => image.url),
    documents: {
      technicalSheet: null,
      manual: null,
      certificates: null,
      brochure: null,
    },
    additionalDocuments: (product.documents || []).map((document) => ({
      name: document.name,
      url: document.url,
    })),
  };
}
