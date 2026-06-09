import "server-only";

import {
  catalogLines,
  type CatalogDocument,
  type CatalogLine,
  type CatalogProduct,
} from "@/data/catalog-products";
import {
  getManagedCreatedContent,
  type ManagedCreatedContent,
} from "@/data/supabase-created-content";

export async function getPublicCatalog(): Promise<CatalogLine[]> {
  const [savedLines, savedProducts] = await Promise.all([
    getManagedCreatedContent("line"),
    getManagedCreatedContent("product"),
  ]);
  const lineOverrides = new Map(savedLines.map((line) => [line.slug, line]));
  const productOverrides = new Map(savedProducts.map((product) => [product.slug, product]));

  const baseLines = catalogLines
    .filter((line) => lineOverrides.get(line.id)?.active !== false)
    .map((line) => {
      const override = lineOverrides.get(line.id);
      return {
        id: line.id,
        name: override?.title || line.name,
        description: override?.excerpt || line.description,
        summary: override?.body || line.summary,
        products: line.products
          .filter((product) => productOverrides.get(product.slug)?.active !== false)
          .map((product) =>
            productOverrides.has(product.slug)
              ? managedToProduct(productOverrides.get(product.slug)!)
              : product,
          ),
      };
    });

  const baseLineIds = new Set(catalogLines.map((line) => line.id));
  const customLines = savedLines
    .filter((line) => line.active !== false && !baseLineIds.has(line.slug))
    .map((line) => ({
      id: line.slug,
      name: line.title || "Línea",
      description: line.excerpt || "",
      summary: line.body || "",
      products: savedProducts
        .filter((product) => product.active !== false && product.line === line.title)
        .map(managedToProduct),
    }));

  return [...customLines, ...baseLines];
}

export async function getPublicProduct(slug: string) {
  const catalog = await getPublicCatalog();
  for (const line of catalog) {
    const product = line.products.find((item) => item.slug === slug);
    if (product) return { line, product };
  }
  return null;
}

export async function getFeaturedPublicProducts() {
  const catalog = await getPublicCatalog();
  return catalog.flatMap((line) =>
    line.products
      .filter((product) => product.featured)
      .map((product) => ({ ...product, lineName: line.name })),
  );
}

function managedToProduct(product: ManagedCreatedContent): CatalogProduct {
  const documents = product.documents || [];
  const documentAt = (index: number): CatalogDocument | null => {
    const document = documents[index];
    return document?.url ? { name: document.name, url: document.url } : null;
  };

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
      technicalSheet: documentAt(0),
      manual: documentAt(1),
      certificates: documentAt(2),
      brochure: documentAt(3),
    },
    additionalDocuments: documents.slice(4).map((document) => ({
      name: document.name,
      url: document.url,
    })),
  };
}
