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
  deletedAt?: string;
  order?: number;
  sublines?: string[];
};

export function AdminCatalogManager() {
  const [tab, setTab] = useState<"products" | "lines">("products");
  const [lines, setLines] = useState<Item[]>([]);
  const [products, setProducts] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [lineFilter, setLineFilter] = useState("");
  const [status, setStatus] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("56927792285");
  const [maxWidth, setMaxWidth] = useState(1800);
  const [showTrash, setShowTrash] = useState(false);
  const [lineModal, setLineModal] = useState<Item | null | undefined>(undefined);

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
      fetch("/api/admin/content?pageKey=catalog-settings").then((response) => response.json()),
    ]).then(([lineResult, productResult, settingsResult]) => {
      if (cancelled) return;
      setLines(lineResult.items || []);
      setProducts(productResult.items || []);
      setWhatsappNumber(settingsResult.content?.whatsappNumber || "56927792285");
      setMaxWidth(settingsResult.content?.maxWidth || 1800);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const search = normalize(query);
    return products.filter((product) => {
      if (showTrash !== Boolean(product.deletedAt)) return false;
      const matchesLine = !lineFilter || product.line === lineFilter;
      const matchesSearch =
        !search ||
        normalize(
          `${product.title} ${product.model} ${product.internalCode} ${product.excerpt}`,
        ).includes(search);
      return matchesLine && matchesSearch;
    });
  }, [lineFilter, products, query, showTrash]);

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
    if (!window.confirm("¿Enviar este elemento a la papelera por 30 días?")) return;
    await save(type, item, { deletedAt: new Date().toISOString(), active: false });
  }

  async function duplicateProduct(item: Item) {
    const uniqueId = crypto.randomUUID();
    const slug = `${item.slug}-copia-${uniqueId}`;
    const response = await fetch("/api/admin/created-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "product",
        slug,
        content: {
          ...item,
          id: `product-${uniqueId}`,
          slug,
          title: `Copia de ${item.title || "producto"}`,
          featured: false,
          active: false,
          deletedAt: "",
          createdAt: new Date().toISOString(),
        },
      }),
    });
    setStatus(response.ok ? "Producto duplicado como borrador inactivo." : "No se pudo duplicar el producto.");
    if (response.ok) await reload();
  }

  async function saveSettings() {
    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageKey: "catalog-settings", content: { whatsappNumber, maxWidth } }),
    });
    setStatus(response.ok ? "Configuración del catálogo guardada." : "No se pudo guardar la configuración.");
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeading
        eyebrow="Editor / Catálogo"
        title="Líneas y productos"
        text="Administra el contenido del catálogo. Las líneas organizan; los productos son el contenido principal."
      />

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Líneas" value={lines.filter((item) => !item.deletedAt).length} />
        <Metric label="Líneas activas" value={lines.filter((item) => !item.deletedAt && item.active !== false).length} />
        <Metric label="Productos" value={products.filter((item) => !item.deletedAt).length} />
        <Metric label="Productos activos" value={products.filter((item) => !item.deletedAt && item.active !== false).length} />
        <Metric label="Destacados" value={products.filter((item) => !item.deletedAt && item.featured).length} />
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#d7e9ef] pb-5">
        <div className="flex gap-2">
          <Tab active={tab === "products"} onClick={() => setTab("products")}>
            Productos ({products.length})
          </Tab>
          <Tab active={tab === "lines"} onClick={() => setTab("lines")}>
            Líneas ({lines.length})
          </Tab>
          <Tab active={showTrash} onClick={() => setShowTrash((value) => !value)}>
            Papelera
          </Tab>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-[#58c3de] bg-white px-4 py-3 text-sm font-bold text-[#213255]" onClick={() => setLineModal(null)} type="button">
            Crear línea
          </button>
          <Link className="rounded-lg bg-[#213255] px-4 py-3 text-sm font-bold text-white" href="/admin/catalogo/productos/crear">
            Crear producto
          </Link>
        </div>
      </div>

      {status && <p className="mt-4 text-sm font-semibold text-[#34466f]">{status}</p>}

      <section className="mt-6 grid gap-4 border border-[#d7e9ef] bg-white p-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <label className="text-xs font-bold text-[#34466f]">WhatsApp principal
          <input className="mt-2 h-11 w-full border border-[#d7e9ef] px-3" onChange={(event) => setWhatsappNumber(event.target.value.replace(/\D/g, ""))} value={whatsappNumber} />
        </label>
        <label className="text-xs font-bold text-[#34466f]">Ancho público: {maxWidth}px
          <input className="mt-4 w-full accent-[#58c3de]" max={1920} min={960} onChange={(event) => setMaxWidth(Number(event.target.value))} type="range" value={maxWidth} />
        </label>
        <button className="h-11 bg-[#213255] px-5 text-sm font-bold text-white" onClick={saveSettings} type="button">Guardar configuración</button>
      </section>

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
                onDuplicate={() => duplicateProduct(product)}
                onFeature={() => save("product", product, { featured: !product.featured })}
                onRecover={() => save("product", product, { deletedAt: "", active: true })}
                onToggle={() => save("product", product, { active: product.active === false })}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {lines.filter((line) => showTrash === Boolean(line.deletedAt)).map((line) => (
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
                  <button className="rounded-md bg-[#213255] px-3 py-2 text-center text-xs font-bold text-white" onClick={() => setLineModal(line)} type="button">Editar</button>
                  <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={() => save("line", line, { order: Math.max(0, (line.order || 0) - 1) })} type="button">Subir orden</button>
                  <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={() => save("line", line, { order: (line.order || 0) + 1 })} type="button">Bajar orden</button>
                  <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={() => save("line", line, { active: line.active === false })} type="button">{line.active === false ? "Activar" : "Desactivar"}</button>
                  {!line.deletedAt && <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={() => remove("line", line)} type="button">Eliminar</button>}
                  {line.deletedAt && <button className="rounded-md border border-[#58c3de] px-3 py-2 text-xs font-bold" onClick={() => save("line", line, { deletedAt: "", active: true })} type="button">Recuperar</button>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {lineModal !== undefined && <LineModal initial={lineModal} onClose={() => setLineModal(undefined)} onSaved={async () => { setLineModal(undefined); await reload(); }} products={products} />}
    </div>
  );
}

function Tab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button className={`border-b-2 px-4 py-3 text-sm font-bold ${active ? "border-[#58c3de] text-[#213255]" : "border-transparent text-[#34466f]"}`} onClick={onClick} type="button">{children}</button>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <article className="border border-[#d7e9ef] bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#34466f]">{label}</p><p className="mt-3 text-3xl font-bold text-[#213255]">{value}</p></article>;
}

function ProductRow({
  item,
  onDelete,
  onDuplicate,
  onFeature,
  onRecover,
  onToggle,
}: {
  item: Item;
  onDelete: () => void;
  onDuplicate: () => void;
  onFeature: () => void;
  onRecover: () => void;
  onToggle: () => void;
}) {
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
        {!item.deletedAt && <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={onDuplicate} type="button">Duplicar</button>}
        {!item.deletedAt && <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={onToggle} type="button">{item.active === false ? "Activar" : "Desactivar"}</button>}
        {!item.deletedAt && <button className="rounded-md border border-[#58c3de] px-3 py-2 text-xs font-bold" onClick={onFeature} type="button">{item.featured ? "Quitar destacado" : "Destacar"}</button>}
        {!item.deletedAt && <button className="rounded-md border border-[#d7e9ef] px-3 py-2 text-xs font-bold" onClick={onDelete} type="button">Eliminar</button>}
        {item.deletedAt && <button className="rounded-md border border-[#58c3de] px-3 py-2 text-xs font-bold" onClick={onRecover} type="button">Recuperar</button>}
      </div>
    </article>
  );
}

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function LineModal({ initial, onClose, onSaved, products }: { initial: Item | null; onClose: () => void; onSaved: () => void; products: Item[] }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [sublines, setSublines] = useState<string[]>(initial?.sublines || []);
  const [order, setOrder] = useState(initial?.order || 0);
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [active, setActive] = useState(initial?.active !== false);
  const [image, setImage] = useState(initial?.primaryImage || "");
  const [status, setStatus] = useState("");

  async function saveLine() {
    if (!title.trim()) return setStatus("Agrega el nombre de la línea.");
    const slug = initial?.slug || slugify(title);
    const response = await fetch("/api/admin/created-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "line", slug, content: { ...initial, slug, title, excerpt, sublines: sublines.map((item) => item.trim()).filter(Boolean), order, featured, active, primaryImage: image } }),
    });
    if (!response.ok) return setStatus("No se pudo guardar la línea.");
    if (initial?.title && initial.title !== title) {
      await Promise.all(
        products
          .filter((product) => product.line === initial.title)
          .map((product) =>
            fetch("/api/admin/created-content", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "product",
                slug: product.slug,
                content: { ...product, line: title, builtIn: false },
              }),
            }),
          ),
      );
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#213255]/55 p-5">
      <section className="max-h-[90vh] w-full max-w-2xl overflow-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#58c3de]">Catálogo</p><h2 className="mt-2 text-2xl font-bold">{initial ? "Editar línea" : "Crear línea"}</h2></div><button className="border border-[#d7e9ef] px-3 py-2 text-sm font-bold" onClick={onClose} type="button">Cerrar</button></div>
        <div className="mt-6 grid gap-4">
          <Field label="Nombre de la línea" onChange={setTitle} value={title} />
          <label className="text-xs font-bold text-[#34466f]">Descripción<textarea className="mt-2 min-h-28 w-full border border-[#d7e9ef] p-3 text-sm" onChange={(event) => setExcerpt(event.target.value)} value={excerpt} /></label>
                    <div className="rounded-lg border border-[#d7e9ef] bg-[#f6fbfd] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#34466f]">Sublíneas</p>
                <p className="mt-1 text-xs text-[#667085]">Agrega las categorías internas que se desplegarán bajo esta línea.</p>
              </div>
              <button
                className="rounded-md bg-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]"
                onClick={() => setSublines((current) => [...current, ""])}
                type="button"
              >
                Agregar sublínea
              </button>
            </div>
            <div className="mt-4 grid gap-2">
              {sublines.map((subline, index) => (
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]" key={index}>
                  <input
                    className="h-11 rounded-lg border border-[#d7e9ef] bg-white px-3 text-sm"
                    onChange={(event) =>
                      setSublines((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      )
                    }
                    placeholder={`Sublínea ${index + 1}`}
                    value={subline}
                  />
                  <button
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700"
                    onClick={() =>
                      setSublines((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    type="button"
                  >
                    Quitar
                  </button>
                </div>
              ))}
              {!sublines.length && (
                <p className="rounded-lg border border-dashed border-[#d7e9ef] bg-white p-3 text-xs text-[#667085]">
                  Esta línea no tiene sublíneas.
                </p>
              )}
            </div>
          </div>
          <Field label="Orden visual" onChange={(value) => setOrder(Number(value))} type="number" value={String(order)} />
          <label className="text-xs font-bold text-[#34466f]">Imagen principal<input accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-xs" onChange={async (event) => { const file = event.target.files?.[0]; if (file) setImage(await uploadImage(file)); }} type="file" /></label>
          {image && <div><div className="h-36 rounded-lg border border-[#d7e9ef] bg-[#eaf8fc] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url("${image}")` }} /><button className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700" onClick={() => setImage("")} type="button">Quitar imagen</button></div>}
          <div className="flex gap-5"><label className="flex items-center gap-2 text-sm font-semibold"><input checked={active} onChange={(event) => setActive(event.target.checked)} type="checkbox" />Activa</label><label className="flex items-center gap-2 text-sm font-semibold"><input checked={featured} onChange={(event) => setFeatured(event.target.checked)} type="checkbox" />Destacada</label></div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#d7e9ef] pt-5"><p className="text-sm font-semibold text-[#34466f]">{status}</p><button className="bg-[#213255] px-5 py-3 text-sm font-bold text-white" onClick={saveLine} type="button">Guardar línea</button></div>
      </section>
    </div>
  );
}

function Field({ label, onChange, type = "text", value }: { label: string; onChange: (value: string) => void; type?: string; value: string }) {
  return <label className="text-xs font-bold text-[#34466f]">{label}<input className="mt-2 h-11 w-full border border-[#d7e9ef] px-3 text-sm" onChange={(event) => onChange(event.target.value)} type={type} value={value} /></label>;
}

async function uploadImage(file: File) {
  const response = await fetch("/api/admin/uploads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: file.name, size: file.size, mimeType: file.type, kind: "image" }) });
  const result = await response.json();
  if (!response.ok || !result.uploadUrl || !result.url) throw new Error("No se pudo subir la imagen");
  const upload = await fetch(result.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!upload.ok) throw new Error("No se pudo subir la imagen");
  return result.url as string;
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

