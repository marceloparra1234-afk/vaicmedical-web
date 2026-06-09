"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogLine } from "@/data/catalog-products";

export function CatalogExperience({ lines }: { lines: CatalogLine[] }) {
  const [lineId, setLineId] = useState(lines[0]?.id || "");
  const [query, setQuery] = useState("");
  const line = lines.find((item) => item.id === lineId) || lines[0];
  const products = useMemo(() => {
    if (!line) return [];
    const search = normalize(query);
    if (!search) return line.products;
    return line.products.filter((product) =>
      normalize(
        `${product.name} ${product.description} ${product.model} ${product.internalCode} ${product.tags}`,
      ).includes(search),
    );
  }, [line, query]);

  if (!line) {
    return (
      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8">
        <p className="rounded-lg border border-[#d7e9ef] bg-white p-8 text-[#34466f]">
          El catálogo aún no tiene líneas activas.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8" data-editor-section="catalogo">
      <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="self-start border-t border-[#d7e9ef] pt-5 lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
            Líneas de productos
          </p>
          <nav className="mt-4 grid border-b border-[#d7e9ef]" aria-label="Líneas del catálogo">
            {lines.map((item) => (
              <button
                className={`border-t border-[#d7e9ef] px-1 py-4 text-left text-sm font-semibold transition ${
                  item.id === line.id
                    ? "text-[#58c3de]"
                    : "text-[#213255] hover:text-[#58c3de]"
                }`}
                key={item.id}
                onClick={() => {
                  setLineId(item.id);
                  setQuery("");
                }}
                type="button"
              >
                {item.name}
                <span className="mt-1 block text-xs font-normal text-[#34466f]">
                  {item.products.length} producto{item.products.length === 1 ? "" : "s"}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0" data-editor-section="linea-01">
          <header className="border-b border-[#d7e9ef] pb-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
              Línea seleccionada
            </p>
            <div className="mt-3 grid gap-5 xl:grid-cols-[1fr_0.85fr] xl:items-end">
              <div>
                <h2 className="text-3xl font-semibold text-[#213255] sm:text-4xl">
                  {line.name}
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-[#34466f]">
                  {line.description}
                </p>
              </div>
              <label>
                <span className="sr-only">Buscar producto</span>
                <input
                  className="h-12 w-full border border-[#d7e9ef] bg-white px-4 text-sm text-[#213255] outline-none transition placeholder:text-[#34466f] focus:border-[#58c3de]"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar producto, modelo, código o descripción"
                  type="search"
                  value={query}
                />
              </label>
            </div>
          </header>

          <div className="mt-7 grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link className="group min-w-0" href={`/catalogo/${product.slug}`} key={product.slug}>
                <div className="relative aspect-[4/3] overflow-hidden border border-[#d7e9ef] bg-white">
                  <Image
                    alt={product.name}
                    className="object-contain p-7 transition duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    src={product.image}
                    unoptimized={product.image.startsWith("http")}
                  />
                  {product.featured && (
                    <span className="absolute left-3 top-3 bg-[#213255] px-3 py-2 text-xs font-bold text-white">
                      Destacado
                    </span>
                  )}
                </div>
                <article className="border-x border-b border-[#d7e9ef] bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#58c3de]">
                    {product.type}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#213255]">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#34466f]">
                    {product.model}
                  </p>
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

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
