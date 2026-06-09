"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeading } from "@/components/admin/AdminDashboard";

type Item = {
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
  const [tab, setTab] = useState<"products" | "lines">("products");
  const [lines, setLines] = useState<Item[]>([]);
  const [products, setProducts] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [lineFilter, setLineFilter] = useState("");
  const [status, setStatus] = useState("");

  async function reload() {
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

  const visibleProducts = useMemo(() => {
    const search = normalize(query);
    return products.filter((product) => {
      const matchesLine = !lineFilter || product.line === lineFilter;
      const matchesSearch =
        !search ||
        normalize(
          `${product.title} ${product.model} ${product.internalCode} ${product.excerpt}`,
        ).includes(search);
      return matchesLine && matchesSearch;
    });
  }, [lineFilter, products, query]);

  async function save(type: "line" | "product", item: Item, changes: Partial<Item>) {
    const response = await fetch("/api/admin/created-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        slug: item.slug,
        content: { ...item, ...changes, builtIn: false },
      }),
    });
    setStatus(response.ok ? "Cambio guardado." : "No se pudo guardar el cambio.");
    if (response.ok) await reload();
  }

  async function remove(type: "line" | "product", item: Item) {
    if (!window.confirm("¿Eliminar este elemento del catálogo?")) return;
    if (item.builtIn) {
      await save(type, item, { active: false });
      return;
    }
    const response = await fetch(
      `/api/admin/created-content?type=${type}&slug=${encodeURIComponent(item.slug)}`,
      { method: "DELETE" },
    );
    setStatus(response.ok ? "Elemento eliminado." : "No se pudo eliminar.");
    if (response.ok) await reload();
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeading
        eyebrow="Editor / Catálogo"
        title="Líneas y productos"
        text="Administra el contenido del catálogo. Las líneas organizan; los productos son el contenido principal."
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#d7e9ef] pb-5">
        <div className="flex gap-2">
          <Tab active={tab === "products"} onClick={() => setTab("products")}>
            Productos ({products.length})
          </Tab>
          <Tab active={tab === "lines"} onClick={() => setTab("lines")}>
            Líneas ({lines.length})
          </Tab>
        </div>
        <div className="flex gap-2">
          <Link className="rounded-lg border border-[#58c3de] bg-white px-4 py-3 text-sm font-bold text-[#213255]" href="/admin/catalogo/lineas/crear">
            Crear línea
          </Link>
          <Link className="rounded-lg bg-[#213255] px-4 py-3 text-sm font-bold text-white" href="/admin/catalogo/productos/crear">
            Crear producto
          </Link>
        </div>
      </div>

      {status && <p className="mt-4 text-sm font-semibold text-[#34466f]">{status}</p>}

      {tab === "products" ? (
        <>
          <section className="mt-6 grid gap-3 border-b border-[#d7e9ef] pb-6 lg:grid-cols-[1fr_320px_auto]">
            <input className="h-12 border border-[#d7e9ef] bg-white px-4 outline-none focus:border-[#58c3de]" onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nombre, modelo, código o descripción" value={query} />
            <select className="h-12 border border-[#d7e9ef] bg-white px-4" onChange={(event) => setLineFilter(event.target.value)} value={lineFilter}>
              <option value="">Todas las líneas</option>
              {lines.map((line) => <option key={line.slug} value={line.title}>{line.title}</option>)}
            </select>
            <button className="h-12 border border-[#d7e9ef] bg-white px-4 text-sm font-bold" onClick={() => { setQuery(""); setLineFilter(""); }} type="button">
              Limpiar
            </button>
          </section>
          <div className="mt-6 grid gap-3">
            {visibleProducts.map((product) => (
              <ProductRow
                item={product}
                key={product.slug}
                onDelete={() => remove("product", product)}
                onFeature={() => save("product", product, { featured: !product.featured })}
                onToggle={() => save("product", product, { active: product.active === false })}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {lines.map((line) => (
            <article className="border border-[#d7e9ef] bg-white p-5" key={line.slug}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#58c3de]">
                    {line.active === false ? "Inactiva" : "Activa"}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-[#213255]">{line.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#34466f]">{line.excerpt}</p>
                  <p className="mt-4 text-xs font-semibold text-[#34466f]">
                    {products.filter((product) => product.line === line.title).length} productos asociados
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link className="rounded-md bg-[#213255] px-3 py-2 text-center text-xs font-bold text-white" href={`/admin/catalogo/lineas/crear?edit=${encodeURIComponent(line.slug)}`}>Editar</Link>
                  <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={() => save("line", line, { active: line.active === false })} type="button">{line.active === false ? "Activar" : "Desactivar"}</button>
                  <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={() => remove("line", line)} type="button">Eliminar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Tab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button className={`border-b-2 px-4 py-3 text-sm font-bold ${active ? "border-[#58c3de] text-[#213255]" : "border-transparent text-[#34466f]"}`} onClick={onClick} type="button">{children}</button>;
}

function ProductRow({ item, onDelete, onFeature, onToggle }: { item: Item; onDelete: () => void; onFeature: () => void; onToggle: () => void }) {
  return (
    <article className="grid gap-4 border border-[#d7e9ef] bg-white p-4 md:grid-cols-[100px_1fr_auto] md:items-center">
      <div className="h-20 bg-[#eaf8fc] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: item.primaryImage ? `url("${item.primaryImage}")` : undefined }} />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-bold text-[#213255]">{item.title}</h2>
          {item.featured && <span className="bg-[#eaf8fc] px-2 py-1 text-[10px] font-bold text-[#213255]">Destacado</span>}
        </div>
        <p className="mt-1 text-sm text-[#34466f]">{item.line || "Sin línea"} · {item.model || "Sin modelo"}</p>
        <p className="mt-2 text-xs font-semibold text-[#58c3de]">{item.active === false ? "Inactivo" : "Activo"}</p>
      </div>
      <div className="flex flex-wrap gap-2 md:justify-end">
        <Link className="rounded-md bg-[#213255] px-3 py-2 text-xs font-bold text-white" href={`/admin/catalogo/productos/crear?edit=${encodeURIComponent(item.slug)}`}>Editar</Link>
        <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={onToggle} type="button">{item.active === false ? "Activar" : "Desactivar"}</button>
        <button className="rounded-md border border-[#58c3de] px-3 py-2 text-xs font-bold" onClick={onFeature} type="button">{item.featured ? "Quitar destacado" : "Destacar"}</button>
        <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={onDelete} type="button">Eliminar</button>
      </div>
    </article>
  );
}

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
