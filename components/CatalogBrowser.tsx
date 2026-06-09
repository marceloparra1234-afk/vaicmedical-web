"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogLine } from "@/data/catalog-products";

export function CatalogBrowser({ lines }: { lines: CatalogLine[] }) {
  const [selectedId, setSelectedId] = useState(lines[0]?.id || "");
  const [query, setQuery] = useState("");
  const selectedLine = lines.find((line) => line.id === selectedId) || lines[0];
  const products = useMemo(() => {
    const normalized = normalize(query);
    if (!selectedLine || !normalized) return selectedLine?.products || [];

    return selectedLine.products.filter((product) =>
      normalize(
        [
          product.name,
          product.type,
          product.description,
          product.brand,
          product.model,
          product.internalCode,
          product.tags,
        ].join(" "),
      ).includes(normalized),
    );
  }, [query, selectedLine]);

  if (!selectedLine) return null;

  return (
    <section
      className="mx-auto grid max-w-[1560px] gap-7 px-5 py-14 sm:px-8 lg:grid-cols-[250px_minmax(0,1fr)]"
      data-editor-section="catalogo"
    >
      <aside className="self-start rounded-3xl border border-[#d7e9ef] bg-white p-4 shadow-sm lg:sticky lg:top-28">
        <p className="px-2 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
          Líneas
        </p>
        <nav className="grid gap-2" aria-label="Líneas del catálogo">
          {lines.map((line) => {
            const active = line.id === selectedLine.id;
            return (
              <button
                className={`min-h-12 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  active
                    ? "border-[#58c3de] bg-[#eaf8fc] text-[#213255]"
                    : "border-[#d7e9ef] bg-[#f6fbfd] text-[#34466f] hover:border-[#58c3de]"
                }`}
                key={line.id}
                onClick={() => {
                  setSelectedId(line.id);
                  setQuery("");
                }}
                type="button"
              >
                {line.name}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0" data-editor-section="linea-01">
        <header className="rounded-3xl border border-[#d7e9ef] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
            Línea seleccionada
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#213255] sm:text-4xl">
            {selectedLine.name}
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#34466f]">
            {selectedLine.description}
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#34466f]">
            {selectedLine.summary}
          </p>
          <label className="mt-6 block">
            <span className="sr-only">Buscar productos</span>
            <input
              className="h-13 w-full rounded-2xl border border-[#d7e9ef] bg-[#f6fbfd] px-5 py-4 text-sm text-[#213255] outline-none transition placeholder:text-[#34466f] focus:border-[#58c3de] focus:bg-white"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por producto, modelo, código o descripción"
              type="search"
              value={query}
            />
          </label>
        </header>

        {products.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link
                className="group flex min-h-full flex-col overflow-hidden rounded-3xl border border-[#d7e9ef] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#58c3de] hover:shadow-lg"
                href={`/catalogo/${product.slug}`}
                key={product.slug}
              >
                <div className="relative aspect-[4/3] border-b border-[#d7e9ef] bg-[#eaf8fc]">
                  <Image
                    alt={product.name}
                    className="object-contain p-7 transition duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    src={product.image}
                  />
                  {product.featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]">
                      Destacado
                    </span>
                  )}
                </div>
                <article className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#58c3de]">
                    {product.type}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-[#213255]">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#34466f]">
                    {product.description}
                  </p>
                  <p className="mt-auto pt-6 text-sm font-bold text-[#58c3de]">
                    Ver producto
                  </p>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-[#d7e9ef] bg-white p-8 text-sm text-[#34466f]">
            No hay productos que coincidan con la búsqueda.
          </div>
        )}
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
