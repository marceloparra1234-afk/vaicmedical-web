"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CatalogLine } from "@/data/catalog-products";

export function CatalogExperience({ lines, maxWidth }: { lines: CatalogLine[]; maxWidth: number }) {
  const searchParams = useSearchParams();
  const requestedLine = searchParams.get("linea") || "";
  const [lineId, setLineId] = useState(lines.some((line) => line.id === requestedLine) ? requestedLine : lines[0]?.id || "");
  const [subline, setSubline] = useState("");
  const line = lines.find((item) => item.id === lineId) || lines[0];
  const products = useMemo(() => {
    if (!line) return [];
    return subline
      ? line.products.filter((product) => product.type === subline)
      : line.products;
  }, [line, subline]);

  if (!line) {
    return (
      <section className="mx-auto px-5 py-16 sm:px-8" style={{ maxWidth }}>
        <p className="rounded-lg border border-[#d7e9ef] bg-white p-8 text-[#34466f]">
          Próximamente encontrarás nuestros productos.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto px-5 py-14 sm:px-8" data-editor-section="catalogo" style={{ maxWidth }}>
      <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="self-start border-t border-[#d7e9ef] pt-5 lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
            Líneas de productos
          </p>
          <nav className="mt-4 grid border-b border-[#d7e9ef]" aria-label="Líneas del catálogo">
            {lines.map((item) => (
              <div className="border-t border-[#d7e9ef] py-4" key={item.id}>
                <button
                  className={`w-full px-1 text-left text-sm font-semibold transition ${
                    item.id === line.id
                      ? "text-[#58c3de]"
                      : "text-[#213255] hover:text-[#58c3de]"
                  }`}
                  onClick={() => {
                    setLineId(item.id);
                    setSubline("");
                  }}
                  type="button"
                >
                  {item.name}
                  <span className="mt-1 block text-xs font-normal text-[#34466f]">
                    {item.products.length} producto{item.products.length === 1 ? "" : "s"}
                  </span>
                </button>
                {item.id === line.id && item.sublines?.length ? (
                  <div className="mt-3 grid gap-1 border-l border-[#58c3de] pl-3">
                    <button
                      className={`py-1 text-left text-xs ${!subline ? "font-bold text-[#58c3de]" : "text-[#34466f]"}`}
                      onClick={() => setSubline("")}
                      type="button"
                    >
                      Todos
                    </button>
                    {item.sublines.map((name) => (
                      <button
                        className={`py-1 text-left text-xs ${subline === name ? "font-bold text-[#58c3de]" : "text-[#34466f]"}`}
                        key={name}
                        onClick={() => setSubline(name)}
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

        <div className="min-w-0" data-editor-section="linea-01">
          <header className="border-b border-[#d7e9ef] pb-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
              Línea seleccionada
            </p>
            <div className="mt-3">
              <h2 className="text-3xl font-semibold text-[#213255] sm:text-4xl">
                {line.name}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[#34466f]">
                {line.description}
              </p>
            </div>
          </header>

          <div className="mt-7 grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link className="group min-w-0" href={`/catalogo/${product.slug}`} key={product.slug}>
                {product.image && <div className="relative aspect-[4/3] overflow-hidden border border-[#d7e9ef] bg-white">
                  <Image
                    alt={product.name}
                    className="object-contain p-7 transition duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    src={product.image}
                  />
                  {product.featured && (
                    <span className="absolute left-3 top-3 bg-[#213255] px-3 py-2 text-xs font-bold text-white">
                      Destacado
                    </span>
                  )}
                </div>}
                <article className="border-x border-b border-[#d7e9ef] bg-white p-5">
                  <h3 className="mt-2 text-xl font-semibold text-[#213255]">
                    {product.name}
                  </h3>
                  {(product.brand || product.model) && (
                    <p className="mt-2 text-sm text-[#34466f]">
                      {[product.brand, product.model].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {product.tags && (
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[#58c3de]">
                      {product.tags}
                    </p>
                  )}
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#34466f]">
                    {product.description}
                  </p>
                  <p className="mt-5 text-sm font-bold text-[#58c3de]">Ver producto</p>
                </article>
              </Link>
            ))}
          </div>

          {!products.length && (
            <p className="mt-7 border border-[#d7e9ef] bg-white p-7 text-sm text-[#34466f]">
              No hay productos que coincidan con la búsqueda.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
