"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeading } from "@/components/admin/AdminDashboard";

type CatalogItem = {
  id: string;
  slug: string;
  title?: string;
  line?: string;
  excerpt?: string;
  primaryImage?: string;
  active?: boolean;
  featured?: boolean;
  model?: string;
  internalCode?: string;
  builtIn?: boolean;
};

export function AdminCatalogManager() {
  const [lines, setLines] = useState<CatalogItem[]>([]);
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [query, setQuery] = useState("");
  const [lineFilter, setLineFilter] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    const [lineResponse, productResponse] = await Promise.all([
      fetch("/api/admin/created-content?type=line"),
      fetch("/api/admin/created-content?type=product"),
    ]);
    const [lineResult, productResult] = await Promise.all([
      lineResponse.json(),
      productResponse.json(),
    ]);
    setLines(lineResult.items || []);
    setProducts(productResult.items || []);
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/admin/created-content?type=line").then((response) => response.json()),
      fetch("/api/admin/created-content?type=product").then((response) => response.json()),
    ]).then(([lineResult, productResult]) => {
      if (cancelled) return;
      setLines(lineResult.items || []);
      setProducts(productResult.items || []);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return products.filter((product) => {
      const matchesLine = !lineFilter || product.line === lineFilter;
      const matchesQuery =
        !normalized ||
        [product.title, product.model, product.internalCode, product.excerpt]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesLine && matchesQuery;
    });
  }, [lineFilter, products, query]);

  async function remove(type: "line" | "product", slug: string) {
    if (!window.confirm(`¿Eliminar ${type === "line" ? "esta línea" : "este producto"}?`)) return;
    const item = (type === "line" ? lines : products).find((entry) => entry.slug === slug);
    if (item?.builtIn) {
      await update(type, item, { active: false, builtIn: false });
      setStatus("Elemento base desactivado. Puede reactivarse desde esta gestión.");
      return;
    }
    const response = await fetch(
      `/api/admin/created-content?type=${type}&slug=${encodeURIComponent(slug)}`,
      { method: "DELETE" },
    );
    setStatus(response.ok ? "Elemento eliminado." : "No se pudo eliminar.");
    if (response.ok) await load();
  }

  async function update(type: "line" | "product", item: CatalogItem, changes: Partial<CatalogItem>) {
    const response = await fetch("/api/admin/created-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        slug: item.slug,
        content: { ...item, ...changes },
      }),
    });
    setStatus(response.ok ? "Estado actualizado." : "No se pudo actualizar.");
    if (response.ok) await load();
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeading
        eyebrow="Editor / Catálogo"
        title="Gestión de líneas y productos"
        text="Las líneas organizan el catálogo; los productos concentran la información comercial y técnica."
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded-lg bg-[#213255] px-5 py-3 text-sm font-bold text-white" href="/admin/catalogo/lineas/crear">
          Crear línea
        </Link>
        <Link className="rounded-lg bg-[#58c3de] px-5 py-3 text-sm font-bold text-[#213255]" href="/admin/catalogo/productos/crear">
          Crear producto
        </Link>
        <Link className="rounded-lg border border-[#d7e9ef] bg-white px-5 py-3 text-sm font-bold text-[#213255]" href="/admin/catalogo/vista">
          Editar vista del catálogo
        </Link>
      </div>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Líneas" value={lines.length} />
        <Metric label="Líneas activas" value={lines.filter((item) => item.active !== false).length} />
        <Metric label="Productos" value={products.length} />
        <Metric label="Productos activos" value={products.filter((item) => item.active !== false).length} />
        <Metric label="Destacados" value={products.filter((item) => item.featured).length} />
      </section>

      <section className="mt-7 rounded-xl border border-[#d7e9ef] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#213255]">Filtros</h2>
            <p className="mt-1 text-sm text-[#34466f]">Busca y segmenta los productos del catálogo.</p>
          </div>
          <button className="rounded-lg border border-[#d7e9ef] px-4 py-3 text-sm font-bold" onClick={() => { setQuery(""); setLineFilter(""); }} type="button">
            Limpiar filtros
          </button>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <input className="h-12 rounded-lg border border-[#d7e9ef] px-4 outline-none focus:border-[#58c3de]" onChange={(event) => setQuery(event.target.value)} placeholder="Buscar producto, modelo, código o descripción" value={query} />
          <select className="h-12 rounded-lg border border-[#d7e9ef] bg-white px-4" onChange={(event) => setLineFilter(event.target.value)} value={lineFilter}>
            <option value="">Todas las líneas</option>
            {lines.filter((line) => line.active !== false).map((line) => <option key={line.slug} value={line.title}>{line.title}</option>)}
          </select>
        </div>
        {status && <p className="mt-4 text-sm font-semibold text-[#34466f]">{status}</p>}
      </section>

      <section className="mt-7 rounded-xl border border-[#d7e9ef] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#213255]">Líneas existentes</h2>
        <div className="mt-5 grid gap-4">
          {lines.map((line) => (
            <article className="rounded-xl border border-[#d7e9ef] bg-[#f6fbfd] p-5" key={line.slug}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">{line.title}</h3>
                  <p className="mt-2 text-sm text-[#34466f]">{line.excerpt}</p>
                  <p className="mt-3 text-xs font-bold text-[#58c3de]">{line.active === false ? "Inactiva" : "Activa"}</p>
                </div>
                <Actions
                  editHref={`/admin/catalogo/lineas/crear?edit=${encodeURIComponent(line.slug)}`}
                  onDelete={() => remove("line", line.slug)}
                  onToggle={() => update("line", line, { active: line.active === false })}
                  toggleLabel={line.active === false ? "Activar" : "Desactivar"}
                />
              </div>
              <div className="mt-5 grid gap-3">
                {products.filter((product) => product.line === line.title).map((product) => (
                  <ProductRow item={product} key={product.slug} onDelete={() => remove("product", product.slug)} onFeature={() => update("product", product, { featured: !product.featured })} onToggle={() => update("product", product, { active: product.active === false })} />
                ))}
              </div>
            </article>
          ))}
          {!lines.length && <p className="text-sm text-[#34466f]">Aún no hay líneas creadas desde el administrador.</p>}
        </div>
      </section>

      <section className="mt-7 rounded-xl border border-[#d7e9ef] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#213255]">Todos los productos</h2>
        <div className="mt-5 grid gap-3">
          {filteredProducts.map((product) => (
            <ProductRow item={product} key={product.slug} onDelete={() => remove("product", product.slug)} onFeature={() => update("product", product, { featured: !product.featured })} onToggle={() => update("product", product, { active: product.active === false })} />
          ))}
          {!filteredProducts.length && <p className="text-sm text-[#34466f]">No hay productos que coincidan con los filtros.</p>}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-[#d7e9ef] bg-white p-5 shadow-sm"><p className="text-xs text-[#34466f]">{label}</p><p className="mt-2 text-3xl font-bold text-[#213255]">{value}</p></div>;
}

function Actions({ editHref, onDelete, onToggle, toggleLabel }: { editHref: string; onDelete: () => void; onToggle: () => void; toggleLabel: string }) {
  return <div className="flex flex-wrap gap-2"><Link className="rounded-md border border-[#d7e9ef] bg-white px-3 py-2 text-xs font-bold" href={editHref}>Editar</Link><button className="rounded-md border border-[#d7e9ef] bg-white px-3 py-2 text-xs font-bold" onClick={onToggle} type="button">{toggleLabel}</button><button className="rounded-md border border-[#d7e9ef] bg-white px-3 py-2 text-xs font-bold" onClick={onDelete} type="button">Eliminar</button></div>;
}

function ProductRow({ item, onDelete, onFeature, onToggle }: { item: CatalogItem; onDelete: () => void; onFeature: () => void; onToggle: () => void }) {
  return (
    <div className="grid gap-4 rounded-xl border border-[#d7e9ef] bg-white p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center">
      <div className="h-20 rounded-lg border border-[#d7e9ef] bg-[#eaf8fc] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: item.primaryImage ? `url("${item.primaryImage}")` : undefined }} />
      <div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-sm text-[#34466f]">{item.line || "Sin línea"} · {item.model || "Sin modelo"}</p><p className="mt-2 text-xs text-[#58c3de]">{item.active === false ? "Inactivo" : "Activo"} · {item.featured ? "Destacado" : "No destacado"}</p></div>
      <div className="flex flex-wrap gap-2 sm:justify-end"><Link className="rounded-md bg-[#213255] px-3 py-2 text-xs font-bold text-white" href={`/admin/catalogo/productos/crear?edit=${encodeURIComponent(item.slug)}`}>Editar</Link><button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={onToggle} type="button">{item.active === false ? "Activar" : "Desactivar"}</button><button className="rounded-md border border-[#58c3de] px-3 py-2 text-xs font-bold" onClick={onFeature} type="button">{item.featured ? "Quitar destacado" : "Destacar"}</button><button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={onDelete} type="button">Eliminar</button></div>
    </div>
  );
}
