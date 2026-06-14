import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import type { CatalogDocument } from "@/data/catalog-products";
import { getCatalogSettings, getPublicProduct } from "@/data/catalog-service";

type ProductPageProps = {
  params: Promise<{ producto: string }>;
};

export const revalidate = 300;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { producto } = await params;
  const detail = await getPublicProduct(producto);

  if (!detail) return {};

  return {
    title: `${detail.product.name} | VaicMedical`,
    description: detail.product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { producto: slug } = await params;
  const [detail, settings] = await Promise.all([getPublicProduct(slug), getCatalogSettings()]);

  if (!detail) notFound();

  const { line, product } = detail;
  const related = line.products
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);
  const whatsappMessage = encodeURIComponent(`Quiero cotizar: ${product.name}`);
  const hasGallery = Boolean(product.image || product.gallery.length);
  const documents: Array<{
    label: string;
    item: CatalogDocument | null;
  }> = [
    { label: "Ficha técnica", item: product.documents.technicalSheet },
    { label: "Manual", item: product.documents.manual },
    { label: "Certificados", item: product.documents.certificates },
    { label: "Brochure", item: product.documents.brochure },
    ...(product.additionalDocuments || []).map((item, index) => ({
      label: item.name || `Documento ${index + 1}`,
      item,
    })),
  ].filter(({ item }) => Boolean(item?.url));

  return (
    <main className="min-h-screen bg-[#f4f9fb] text-[#213255]">
      <section className="mx-auto w-full px-5 pb-24 pt-12 sm:px-8 lg:px-10 lg:pt-16" style={{ maxWidth: settings.maxWidth }}>
        <nav className="mb-7 flex flex-wrap items-center gap-2.5 text-sm text-[#667085]">
          <Link className="font-semibold hover:text-[#58c3de]" href="/">
            Inicio
          </Link>
          <span>/</span>
          <Link className="font-semibold hover:text-[#58c3de]" href="/catalogo">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-[#58c3de]">{line.name}</span>
          <span>/</span>
          <span className="text-[#344054]">{product.name}</span>
        </nav>

        <div className={`grid items-start gap-8 ${hasGallery ? "xl:grid-cols-[minmax(0,1.25fr)_430px]" : "xl:grid-cols-[minmax(0,1fr)_430px]"}`}>
          {hasGallery && <div data-editor-section="product-gallery">
            <ProductGallery
              gallery={product.gallery}
              name={product.name}
              primaryImage={product.image}
            />
          </div>}

          <aside className="rounded-[28px] border border-[#d7e9ef] bg-white p-6 sm:p-8 xl:sticky xl:top-24" data-editor-section="product-info">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#58c3de]">
              {line.name}
            </p>
            <h1 className="mt-3.5 text-[38px] font-bold leading-[1.1]">
              {product.name}
            </h1>
            <p className="mt-5 text-base leading-7 text-[#667085]">
              {product.description}
            </p>

            {(product.brand || product.model || product.type || product.tags) && (
              <div className="mt-7 grid gap-3">
                {product.brand && <Info label="Marca" value={product.brand} />}
                {product.model && <Info label="Modelo" value={product.model} />}
                {product.type && <Info label="Categoría" value={product.type} />}
                {product.tags && <Info label="Etiquetas" value={product.tags} />}
              </div>
            )}

            <div className="mt-8 grid gap-3">
              <Link
                className="flex w-full justify-center rounded-2xl bg-[#58c3de] px-5 py-4 font-extrabold text-[#213255] transition hover:bg-[#6ed1e8]"
                href={`/contacto?producto=${encodeURIComponent(product.name)}`}
              >
                Solicitar cotización
              </Link>
              <a
                className="flex w-full justify-center rounded-2xl border border-[#58c3de]/40 bg-[#58c3de]/10 px-5 py-4 font-extrabold text-[#213255] transition hover:bg-[#58c3de]/20"
                href={`https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`}
                rel="noreferrer"
                target="_blank"
              >
                Contactar por WhatsApp
              </a>
              <Link className="flex w-full justify-center rounded-2xl border border-[#d7e9ef] bg-white px-5 py-4 font-extrabold text-[#213255] transition hover:border-[#58c3de]" href="/contacto">
                Contacto
              </Link>
            </div>

            <p className="mt-4.5 text-xs leading-6 text-[#667085]">
              La disponibilidad y alcance del servicio se confirman después de
              evaluar el equipo y sus condiciones de operación.
            </p>
          </aside>
        </div>

        {product.longDescription && (
          <section className="mt-12 max-w-[980px] rounded-[28px] border border-[#d7e9ef] bg-white p-7 sm:p-8" data-editor-section="product-description">
            <h2 className="text-[26px] font-bold">Descripción del producto</h2>
            <p className="mt-4.5 whitespace-pre-line text-base leading-8 text-[#667085]">
              {product.longDescription}
            </p>
          </section>
        )}

        {documents.length > 0 && (
          <section className="mt-12 max-w-[980px] rounded-[28px] border border-[#d7e9ef] bg-white p-7 sm:p-8" data-editor-section="product-docs">
            <h2 className="text-[26px] font-bold">Documentación</h2>
            <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {documents.map(({ label, item }) => (
                <a
                  className="flex flex-col gap-1.5 rounded-[18px] border border-[#58c3de]/40 bg-[#58c3de]/10 p-4.5 font-bold text-[#213255]"
                  href={item?.url || "#"}
                  key={label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>{label}</span>
                  <small className="font-normal text-[#667085]">
                    {item?.name}
                  </small>
                </a>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-14" data-editor-section="product-related">
            <h2 className="text-[28px] font-bold">Productos relacionados</h2>
            <div className="mt-5 grid max-w-[980px] gap-5 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  className="grid grid-cols-[120px_1fr] items-center gap-4 rounded-[22px] border border-[#d7e9ef] bg-white p-3.5 transition hover:border-[#58c3de]"
                  href={`/catalogo/${item.slug}`}
                  key={item.slug}
                >
                  <div className="relative h-[92px] w-[120px] overflow-hidden rounded-2xl bg-[#eef8fb]">
                    <Image
                      alt={item.name}
                      className="object-contain p-2"
                      fill
                      sizes="120px"
                      src={item.image}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="mt-1.5 text-xs text-[#667085]">
                      Modelo: {item.model}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#d7e9ef] pb-3 text-sm">
      <span className="text-[#667085]">{label}</span>
      <span className="text-right font-bold text-[#213255]">{value}</span>
    </div>
  );
}
