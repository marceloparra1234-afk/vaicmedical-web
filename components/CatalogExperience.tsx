"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CatalogLine } from "@/data/catalog-products";
import type { PreviewContent } from "@/components/admin/ClientPagePreview";

type CatalogEditorContent = Record<string, Partial<PreviewContent>> | null;

export function CatalogExperience({
  content,
  lines,
  maxWidth,
}: {
  content: CatalogEditorContent;
  lines: CatalogLine[];
  maxWidth: number;
}) {
  const searchParams = useSearchParams();
  const requestedLine = searchParams.get("linea") || "";
  const [lineId, setLineId] = useState(lines.some((line) => line.id === requestedLine) ? requestedLine : lines[0]?.id || "");
  const [subline, setSubline] = useState("");
  const line = lines.find((item) => item.id === lineId) || lines[0];
  const navigationStyle = findSection(content, "navegaci");
  const lineStyle = findSection(content, "vista de l");
  const navBackground = navigationStyle?.backgroundColor || "#ffffff";
  const navAccent = navigationStyle?.accentColor || "#58c3de";
  const navText = navigationStyle?.textColor || "#213255";
  const productBackground = lineStyle?.itemColor || "#ffffff";
  const productAccent = lineStyle?.accentColor || "#d7e9ef";
  const productText = lineStyle?.textColor || "#213255";
  const products = useMemo(() => {
    if (!line) return [];
    return subline
      ? line.products.filter((product) => product.type === subline)
      : line.products;
  }, [line, subline]);

  if (!line) {
    return (
      <section className="w-full px-5 py-16 sm:px-8 lg:px-12">
        <p className="rounded-lg border border-[#d7e9ef] bg-white p-8 text-[#34466f]">
          PrÃ³ximamente encontrarÃ¡s nuestros productos.
        </p>
      </section>
    );
  }

  return (
    <section
      className="w-full px-5 py-14 sm:px-8 lg:px-12"
      data-editor-section="catalogo"
      style={{ maxWidth: "none" }}
    >
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside
          className="self-start rounded-3xl border p-5 lg:sticky lg:top-28"
          style={{ backgroundColor: navBackground, borderColor: navAccent }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: navAccent }}>{stripHtml(navigationStyle?.title || navigationStyle?.eyebrow || "Líneas de productos")}</p>
          <nav className="mt-4 grid" aria-label="LÃ­neas del catÃ¡logo">
            {lines.map((item) => (
              <div className="border-t py-4" key={item.id} style={{ borderColor: navAccent }}>
                <button
                  className="w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold transition"
                  onClick={() => {
                    setLineId(item.id);
                    setSubline("");
                  }}
                  style={{ backgroundColor: item.id === line.id ? navAccent : "transparent", color: item.id === line.id ? "#ffffff" : navText }} type="button">{item.name}
                  <span className="mt-1 block text-xs font-normal opacity-80">
                    {item.products.length} producto{item.products.length === 1 ? "" : "s"}
                  </span>
                </button>
                {item.sublines?.length ? (
                  <div className="mt-3 grid gap-1 border-l pl-3" style={{ borderColor: navAccent }}>
                    <button
                      className="py-1 text-left text-xs" style={{ color: item.id === line.id && !subline ? navAccent : navText, fontWeight: item.id === line.id && !subline ? 700 : 400 }}
                      onClick={() => {
                        setLineId(item.id);
                        setSubline("");
                      }}
                      type="button"
                    >
                      Todos
                    </button>
                    {item.sublines.map((name) => (
                      <button
                        className="py-1 text-left text-xs" style={{ color: item.id === line.id && subline === name ? navAccent : navText, fontWeight: item.id === line.id && subline === name ? 700 : 400 }}
                        key={name}
                        onClick={() => {
                          setLineId(item.id);
                          setSubline(name);
                        }}
                        type="button"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 rounded-3xl border p-6 sm:p-8" data-editor-section="linea-01" style={{ backgroundColor: lineStyle?.backgroundColor || "transparent", borderColor: lineStyle?.accentColor || "transparent" }}>
          <header className="border-b pb-7" style={{ borderColor: productAccent }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: lineStyle?.accentColor || "#58c3de" }}>{stripHtml(lineStyle?.eyebrow || "Línea seleccionada")}</p>
            <div className="mt-3">
              <h2 className="text-3xl font-semibold sm:text-4xl" style={{ color: productText }}>
                {line.name}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7" style={{ color: productText }}>
                {line.description}
              </p>
            </div>
          </header>

          <div className="mt-7 grid gap-x-5 gap-y-8 md:grid-cols-2 2xl:grid-cols-3">
            {products.map((product) => (
              <Link className="group min-w-0" href={`/catalogo/${product.slug}`} key={product.slug}>
                {product.image && <div className="relative aspect-[4/3] overflow-hidden border bg-white" style={{ borderColor: productAccent }}>
                  <Image
                    alt={product.name}
                    className="object-contain p-7 transition duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    src={product.image}
                  />
                  {product.featured && (
                    <span className="absolute left-3 top-3 px-3 py-2 text-xs font-bold text-white" style={{ backgroundColor: navAccent }}>
                      Destacado
                    </span>
                  )}
                </div>}
                <article className="border-x border-b p-5" style={{ backgroundColor: productBackground, borderColor: productAccent, color: productText }}>
                  <h3 className="mt-2 text-xl font-semibold">
                    {product.name}
                  </h3>
                  {(product.brand || product.model) && (
                    <p className="mt-2 text-sm opacity-80">
                      {[product.brand, product.model].filter(Boolean).join(" Â· ")}
                    </p>
                  )}
                  {product.tags && (
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em]" style={{ color: navAccent }}>
                      {product.tags}
                    </p>
                  )}
                  <p className="mt-4 line-clamp-3 text-sm leading-6 opacity-80">
                    {product.description}
                  </p>
                  <p className="mt-5 text-sm font-bold" style={{ color: navAccent }}>Ver producto</p>
                </article>
              </Link>
            ))}
          </div>

          {!products.length && (
            <p className="mt-7 border border-[#d7e9ef] bg-white p-7 text-sm text-[#34466f]">
              No hay productos que coincidan con la bÃºsqueda.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}


function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '').trim();
}

function findSection(content: CatalogEditorContent, pattern: string) {
  if (!content) return undefined;
  const normalizedPattern = normalizeText(pattern);
  return Object.entries(content).find(([key]) =>
    normalizeText(key).includes(normalizedPattern),
  )?.[1];
}

function normalizeText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

