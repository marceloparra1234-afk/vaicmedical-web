import "server-only";

import type { CatalogDocument, CatalogLine, CatalogProduct } from "@/data/catalog-products";
import { getManagedCreatedContent, type ManagedCreatedContent } from "@/data/supabase-created-content";
import { getSiteContent } from "@/lib/supabase-admin";

export type CatalogSettings = {
  whatsappNumber: string;
  maxWidth: number;
};

export const defaultCatalogSettings: CatalogSettings = {
  whatsappNumber: "56927792285",
  maxWidth: 1800,
};

export async function getCatalogSettings() {
  return {
    ...defaultCatalogSettings,
    ...(await getSiteContent<Partial<CatalogSettings>>("catalog-settings")),
  };
}

export async function getPublicCatalog(): Promise<CatalogLine[]> {
  const [lines, products] = await Promise.all([
    getManagedCreatedContent("line"),
    getManagedCreatedContent("product"),
  ]);

  return lines
    .filter((line) => line.active !== false && !line.deletedAt)
    .sort(sortByOrderThenTitle)
    .map((line) => ({
      id: line.slug,
      name: line.title || "Línea",
      description: line.excerpt || "",
      summary: line.body || "",
      sublines: line.sublines || [],
      featured: line.featured,
      image: line.primaryImage,
      products: products
        .filter(
          (product) =>
            product.active !== false &&
            !product.deletedAt &&
            (product.line === line.slug || product.line === line.title),
        )
        .sort(
          (a, b) =>
            Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
            (a.title || "").localeCompare(b.title || "", "es"),
        )
        .map((product) => managedToProduct(product, line.slug, line.title || "")),
    }));
}

export async function getPublicProduct(slug: string) {
  const catalog = await getPublicCatalog();
  for (const line of catalog) {
    const product = line.products.find((item) => item.slug === slug);
    if (product) return { line, product };
  }
  return null;
}

export async function getHomeCatalogHighlights() {
  const catalog = await getPublicCatalog();
  const featuredProducts = catalog.flatMap((line) =>
    line.products
      .filter((product) => product.featured)
      .map((product) => ({ ...product, lineName: line.name })),
  );
  const regularProducts = catalog.flatMap((line) =>
    line.products
      .filter((product) => !product.featured)
      .map((product) => ({ ...product, lineName: line.name })),
  );
  const products = [...featuredProducts, ...regularProducts];

  if (products.length) {
    return products.map((product) => ({
      slug: product.slug,
      name: product.name,
      lineName: product.lineName || "Producto",
      description: product.description,
      image: product.image || "/service-maintenance.svg",
      href: `/catalogo/${product.slug}`,
    }));
  }

  const featuredLines = catalog.filter((line) => line.featured);
  if (featuredLines.length) {
    return featuredLines.map((line) => ({
      slug: line.id,
      name: line.name,
      lineName: "Línea destacada",
      description: line.description,
      image: line.image || "/service-maintenance.svg",
      href: `/catalogo?linea=${encodeURIComponent(line.id)}`,
    }));
  }

  return catalog.map((line) => ({
    slug: line.id,
    name: line.name,
    lineName: "Línea de productos",
    description: line.description,
    image: line.image || "/service-maintenance.svg",
    href: `/catalogo?linea=${encodeURIComponent(line.id)}`,
  }));
}

function managedToProduct(
  product: ManagedCreatedContent,
  lineId: string,
  lineName: string,
): CatalogProduct {
  const document = (item?: { name: string; url: string } | null): CatalogDocument | null =>
    item?.url ? { name: item.name, url: item.url } : null;

  return {
    slug: product.slug,
    name: product.title || "Producto",
    lineId,
    lineName,
    featured: product.featured,
    type: product.subline || lineName || "Producto",
    description: product.excerpt || "",
    longDescription: product.body || "",
    brand: product.brand || "",
    model: product.model || "",
    internalCode: product.internalCode || "",
    tags: product.tags || "",
    image: product.primaryImage || "",
    gallery: [
      ...(product.secondaryImages || []).map((image) => image.url),
      ...(product.videos || []).map((video) => video.url),
    ],
    documents: {
      technicalSheet: document(product.technicalSheet),
      manual: null,
      certificates: null,
      brochure: null,
    },
    additionalDocuments: (product.certifications || []).map((item) => ({
      name: item.name,
      url: item.url,
    })),
  };
}

function sortByOrderThenTitle(a: ManagedCreatedContent, b: ManagedCreatedContent) {
  return (a.order ?? 9999) - (b.order ?? 9999) || (a.title || "").localeCompare(b.title || "", "es");
}
