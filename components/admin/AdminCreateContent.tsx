"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeading } from "@/components/admin/AdminDashboard";

type CreateContentProps = {
  type: "blog" | "line" | "product";
};

type MediaFile = {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "document";
};

type FormState = {
  title: string;
  line: string;
  date: string;
  excerpt: string;
  body: string;
  brand: string;
  model: string;
  internalCode: string;
  tags: string;
  featured: boolean;
  active: boolean;
  primaryImage: string;
  secondaryImages: MediaFile[];
  videos: MediaFile[];
  documents: MediaFile[];
  sublines: string[];
  subline: string;
  order: number;
  technicalSheet: MediaFile | null;
  certifications: MediaFile[];
};

const config = {
  blog: {
    eyebrow: "Blog",
    title: "Crear publicación",
    text: "Crea noticias, artículos o contenidos técnicos con los mismos campos que verá el cliente.",
  },
  line: {
    eyebrow: "Catálogo",
    title: "Crear línea de productos",
    text: "Define la presentación y contenido general de una nueva línea del catálogo.",
  },
  product: {
    eyebrow: "Catálogo",
    title: "Crear producto",
    text: "Crea una ficha completa con información técnica, galería y documentación.",
  },
};

const initialState: FormState = {
  title: "",
  line: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  body: "",
  brand: "Multimarca",
  model: "",
  internalCode: "",
  tags: "",
  featured: false,
  active: true,
  primaryImage: "",
  secondaryImages: [],
  videos: [],
  documents: [],
  sublines: [],
  subline: "",
  order: 0,
  technicalSheet: null,
  certifications: [],
};

export function AdminCreateContent({ type }: CreateContentProps) {
  const content = config[type];
  const [form, setForm] = useState<FormState>(initialState);
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [blogPosts, setBlogPosts] = useState<Array<FormState & { id: string; slug: string }>>([]);
  const [editingSlug, setEditingSlug] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [status, setStatus] = useState("");
  const [catalogLines, setCatalogLines] = useState<Array<FormState & { id: string; slug: string }>>([]);
  const slug = useMemo(() => slugify(form.title || content.title), [content.title, form.title]);

  async function loadBlogPosts() {
    if (type !== "blog") return;
    const response = await fetch("/api/admin/created-content?type=blog");
    if (!response.ok) return;
    const result = (await response.json()) as {
      items?: Array<Partial<FormState> & { id: string; slug: string }>;
    };
    setBlogPosts(
      (result.items || []).map((item) => ({
        ...initialState,
        ...item,
        secondaryImages: item.secondaryImages || [],
        videos: item.videos || [],
        documents: item.documents || [],
        sublines: item.sublines || [],
        certifications: item.certifications || [],
      })),
    );
  }

  useEffect(() => {
    if (type !== "blog") return;
    let cancelled = false;

    fetch("/api/admin/created-content?type=blog")
      .then((response) => (response.ok ? response.json() : null))
      .then((result: { items?: Array<Partial<FormState> & { id: string; slug: string }> } | null) => {
        if (cancelled || !result) return;
        setBlogPosts(
          (result.items || []).map((item) => ({
            ...initialState,
            ...item,
            secondaryImages: item.secondaryImages || [],
            videos: item.videos || [],
            documents: item.documents || [],
          })),
        );
      });

    return () => {
      cancelled = true;
    };
  }, [type]);

  useEffect(() => {
    if (type === "blog") return;
    let cancelled = false;
    const editSlug = new URLSearchParams(window.location.search).get("edit");

    Promise.all([
      fetch(`/api/admin/created-content?type=${type}`).then((response) => response.json()),
      type === "product"
        ? fetch("/api/admin/created-content?type=line").then((response) => response.json())
        : Promise.resolve({ items: [] }),
    ]).then(([itemsResult, linesResult]) => {
      if (cancelled) return;
      setCatalogLines(linesResult.items || []);
      if (!editSlug) return;
      const item = (itemsResult.items || []).find((entry: { slug: string }) => entry.slug === editSlug);
      if (!item) return;
      setForm({
        ...initialState,
        ...item,
        secondaryImages: item.secondaryImages || [],
        videos: item.videos || [],
        documents: item.documents || [],
      });
      setEditingSlug(item.slug);
      setStatus(`Editando: ${item.title}`);
    });

    return () => {
      cancelled = true;
    };
  }, [type]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setStatus("");
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function publish() {
    const title = form.title.trim();
    if (!title) {
      setStatus("Agrega un título antes de publicar.");
      return;
    }
    if (type === "product" && !form.line) {
      setStatus("Selecciona la línea principal del producto.");
      return;
    }

    setIsPublishing(true);
    setStatus("Publicando...");

    const effectiveSlug = editingSlug || slug;
    const payload = {
      ...form,
      id: `${type}-${Date.now()}`,
      slug: effectiveSlug,
      createdAt: new Date().toISOString(),
      type,
    };

    try {
      const response = await fetch("/api/admin/created-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug: effectiveSlug, content: payload }),
      });

      if (response.ok) {
        setStatus("Publicado en Supabase y disponible para el sitio.");
        const wasEditing = Boolean(editingSlug);
        setEditingSlug("");
        await loadBlogPosts();
        if (type === "blog") setActiveTab("manage");
        if (!wasEditing && (type === "product" || type === "line")) {
          setForm({
            ...initialState,
            date: new Date().toISOString().slice(0, 10),
          });
        }
        return;
      }

      const result = await response.json().catch(() => null);
      setStatus(result?.error || "No se pudo guardar en Supabase.");
    } catch {
      setStatus("No se pudo conectar con Supabase.");
    } finally {
      setIsPublishing(false);
    }
  }

  function editBlogPost(post: FormState & { slug: string }) {
    setForm({
      ...initialState,
      ...post,
      secondaryImages: post.secondaryImages || [],
      videos: post.videos || [],
      documents: post.documents || [],
    });
    setEditingSlug(post.slug);
    setStatus(`Editando: ${post.title}`);
    setActiveTab("create");
  }

  async function deleteBlogPost(slugToDelete: string) {
    if (!window.confirm("¿Eliminar esta publicación? Esta acción no se puede deshacer.")) return;
    const response = await fetch(
      `/api/admin/created-content?type=blog&slug=${encodeURIComponent(slugToDelete)}`,
      { method: "DELETE" },
    );
    setStatus(response.ok ? "Publicación eliminada." : "No se pudo eliminar la publicación.");
    if (response.ok) await loadBlogPosts();
  }

  async function toggleFeatured(post: FormState & { slug: string }) {
    const contentToSave = { ...post, featured: !post.featured };
    const response = await fetch("/api/admin/created-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "blog", slug: post.slug, content: contentToSave }),
    });
    setStatus(response.ok ? "Estado destacado actualizado." : "No se pudo actualizar.");
    if (response.ok) await loadBlogPosts();
  }

  if (type === "blog" && activeTab === "manage") {
    return (
      <div className="mx-auto max-w-[1600px]">
        <PageHeading eyebrow={content.eyebrow} title={content.title} text={content.text} />
        <BlogTabs active={activeTab} onChange={setActiveTab} />
        <section className="mt-6 overflow-hidden rounded-xl border border-[#d7e9ef] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d7e9ef] px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-[#213255]">Publicaciones</h2>
              <p className="mt-1 text-sm text-[#34466f]">
                Edita, elimina o destaca las publicaciones guardadas en Supabase.
              </p>
            </div>
            <p className="text-sm font-semibold text-[#34466f]">{status}</p>
          </div>
          <div className="grid gap-4 p-6 lg:grid-cols-2">
            {blogPosts.map((post) => (
              <article className="grid gap-4 rounded-lg border border-[#d7e9ef] bg-[#f6fbfd] p-4 sm:grid-cols-[140px_1fr]" key={post.slug}>
                <div
                  className="aspect-[16/10] rounded-lg border border-[#d7e9ef] bg-[#eaf8fc] bg-cover bg-center"
                  style={{ backgroundImage: post.primaryImage ? `url("${post.primaryImage}")` : undefined }}
                />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#58c3de]">
                      {post.featured ? "Destacada" : "Publicación"}
                    </p>
                    <span className="text-xs text-[#34466f]">{post.date}</span>
                  </div>
                  <h3 className="mt-2 truncate text-lg font-bold text-[#213255]">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#34466f]">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="rounded-md bg-[#213255] px-3 py-2 text-xs font-bold text-white" onClick={() => editBlogPost(post)} type="button">
                      Editar
                    </button>
                    <button className="rounded-md border border-[#58c3de] bg-white px-3 py-2 text-xs font-bold text-[#213255]" onClick={() => toggleFeatured(post)} type="button">
                      {post.featured ? "Quitar destacado" : "Destacar"}
                    </button>
                    <button className="rounded-md border border-[#d7e9ef] bg-white px-3 py-2 text-xs font-bold text-[#213255]" onClick={() => deleteBlogPost(post.slug)} type="button">
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!blogPosts.length && (
              <p className="p-6 text-sm text-[#34466f]">Aún no hay publicaciones guardadas en Supabase.</p>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeading eyebrow={content.eyebrow} title={content.title} text={content.text} />
      {type === "blog" && <BlogTabs active={activeTab} onChange={setActiveTab} />}

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
        <section className="grid gap-6 rounded-xl border border-[#d7e9ef] bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Título" value={form.title} onChange={(value) => update("title", value)} />
            {type === "product" && (
              <label className="text-xs font-semibold text-[#34466f]">
                Línea de producto
                <select className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3 text-sm" onChange={(event) => update("line", event.target.value)} value={form.line}>
                  <option value="">Seleccionar línea</option>
                  {catalogLines.map((line) => <option key={line.slug} value={line.title}>{line.title}</option>)}
                </select>
              </label>
            )}
            {type === "line" && (
              <Field label="Orden visual" type="number" value={String(form.order)} onChange={(value) => update("order", Number(value))} />
            )}
            {type === "blog" && (
              <Field label="Fecha de publicación" type="date" value={form.date} onChange={(value) => update("date", value)} />
            )}
          </div>

          <Field
            label={type === "blog" ? "Breve reseña" : "Descripción corta"}
            value={form.excerpt}
            onChange={(value) => update("excerpt", value)}
          />

          <label className="text-xs font-semibold text-[#34466f]">
            {type === "blog" ? "Artículo o historia" : "Descripción completa"}
            <textarea
              className="mt-2 min-h-60 w-full rounded-lg border border-[#d7e9ef] p-3 text-sm outline-none focus:border-[#58c3de]"
              onChange={(event) => update("body", event.target.value)}
              value={form.body}
            />
          </label>

          {type === "product" && (
            <div className="grid gap-4 rounded-lg border border-[#d7e9ef] bg-[#f6fbfd] p-4 sm:grid-cols-2">
              <Field label="Marca" value={form.brand} onChange={(value) => update("brand", value)} />
              <Field label="Modelo" value={form.model} onChange={(value) => update("model", value)} />
              <Field label="Código interno" value={form.internalCode} onChange={(value) => update("internalCode", value)} />
              <Field label="Etiquetas" value={form.tags} onChange={(value) => update("tags", value)} />
              <label className="text-xs font-semibold text-[#34466f]">
                Sublínea opcional
                <select className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] bg-white px-3 text-sm" onChange={(event) => update("subline", event.target.value)} value={form.subline}>
                  <option value="">Sin sublínea</option>
                  {(catalogLines.find((line) => line.title === form.line)?.sublines || []).map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-[#d7e9ef] bg-white px-3 py-3 text-xs font-semibold text-[#34466f]">
                <input
                  checked={form.featured}
                  className="h-4 w-4 accent-[#58c3de]"
                  onChange={(event) => update("featured", event.target.checked)}
                  type="checkbox"
                />
                Producto destacado
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-[#d7e9ef] bg-white px-3 py-3 text-xs font-semibold text-[#34466f]">
                <input
                  checked={form.active}
                  className="h-4 w-4 accent-[#58c3de]"
                  onChange={(event) => update("active", event.target.checked)}
                  type="checkbox"
                />
                Producto visible para clientes
              </label>
            </div>
          )}

          {type === "line" && (
            <div className="grid gap-4 rounded-lg border border-[#d7e9ef] bg-[#f6fbfd] p-4">
              <Field label="Sublíneas separadas por coma" value={form.sublines.join(", ")} onChange={(value) => update("sublines", value.split(",").map((item) => item.trim()).filter(Boolean))} />
              <label className="flex items-center gap-3 rounded-lg border border-[#d7e9ef] bg-white px-4 py-4 text-xs font-semibold text-[#34466f]">
              <input checked={form.active} className="h-4 w-4 accent-[#58c3de]" onChange={(event) => update("active", event.target.checked)} type="checkbox" />
              Línea visible para clientes
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-[#d7e9ef] bg-white px-4 py-4 text-xs font-semibold text-[#34466f]">
                <input checked={form.featured} className="h-4 w-4 accent-[#58c3de]" onChange={(event) => update("featured", event.target.checked)} type="checkbox" />
                Línea destacada en Inicio
              </label>
            </div>
          )}

          <div className="grid gap-4 border-t border-[#d7e9ef] pt-5">
            <h2 className="text-sm font-bold text-[#213255]">Archivos y medios</h2>
            <div className="grid gap-4 xl:grid-cols-4">
              <PrimaryImageInput
                image={form.primaryImage}
                onChange={(primaryImage) => update("primaryImage", primaryImage)}
                type={type}
              />
              <MediaInput
                accept="image/jpeg,image/png,image/webp"
                files={form.secondaryImages}
                formats="JPG, PNG, WEBP"
                label="Imágenes secundarias"
                maxFiles={10}
                maxSize="Máximo 20 MB por imagen"
                onChange={(secondaryImages) => update("secondaryImages", secondaryImages)}
                type="image"
              />
              <MediaInput
                accept="video/mp4,video/webm"
                files={form.videos}
                formats="MP4, WEBM"
                label="Videos"
                maxFiles={4}
                maxSize="Máximo 50 MB por video"
                onChange={(videos) => update("videos", videos)}
                type="video"
              />
              {type !== "product" && <MediaInput accept="application/pdf" files={form.documents} formats="PDF" label="Documentos" maxFiles={8} maxSize="Máximo 30 MB por documento" onChange={(documents) => update("documents", documents)} type="document" />}
            </div>
            {type === "product" && (
              <div className="grid gap-4 lg:grid-cols-2">
                <SingleDocumentInput file={form.technicalSheet} label="Ficha técnica" onChange={(technicalSheet) => update("technicalSheet", technicalSheet)} />
                <MediaInput accept="application/pdf,image/jpeg,image/png,image/webp" files={form.certifications} formats="PDF, JPG, PNG, WEBP" label="Certificaciones" maxFiles={12} maxSize="Máximo 30 MB por archivo" onChange={(certifications) => update("certifications", certifications)} type="document" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d7e9ef] pt-5">
            <p className="text-sm font-semibold text-[#34466f]">{status}</p>
            <div className="flex gap-3">
              <button
                className="rounded-lg border border-[#d7e9ef] px-5 py-3 text-sm font-semibold text-[#34466f]"
                onClick={() => {
                  setForm(initialState);
                  setEditingSlug("");
                  setStatus("");
                }}
                type="button"
              >
                {editingSlug ? "Cancelar edición" : "Limpiar"}
              </button>
              <button
                className="rounded-lg bg-[#213255] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17243f]"
                disabled={isPublishing}
                onClick={publish}
                type="button"
              >
                {isPublishing ? "Guardando..." : editingSlug ? "Guardar cambios" : "Publicar"}
              </button>
            </div>
          </div>
        </section>

        <aside className="sticky top-24 grid max-h-[calc(100vh-120px)] content-start gap-4 overflow-auto rounded-xl border border-[#d7e9ef] bg-[#f6fbfd] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#58c3de]">Vista previa</p>
          <CreatePreview form={form} slug={slug} type={type} />
        </aside>
      </div>
    </div>
  );
}

function SingleDocumentInput({ file, label, onChange }: { file: MediaFile | null; label: string; onChange: (file: MediaFile | null) => void }) {
  return (
    <div className="rounded-lg border border-dashed border-[#9eddea] bg-[#f4fbfd] p-4">
      <p className="text-sm font-bold text-[#213255]">{label}</p>
      <p className="mt-2 text-xs text-[#667085]">PDF · máximo 30 MB</p>
      <label className="mt-4 inline-flex cursor-pointer rounded-md bg-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]">
        {file ? "Reemplazar" : "Agregar"}
        <input accept="application/pdf" className="hidden" onChange={(event) => { const selected = event.target.files?.[0]; if (selected) void uploadFile(selected, "document").then(onChange); }} type="file" />
      </label>
      {file && <button className="ml-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700" onClick={() => onChange(null)} type="button">Quitar</button>}
    </div>
  );
}

function BlogTabs({
  active,
  onChange,
}: {
  active: "create" | "manage";
  onChange: (tab: "create" | "manage") => void;
}) {
  return (
    <div className="mt-6 flex w-fit overflow-hidden rounded-lg border border-[#d7e9ef] bg-white">
      <button
        className={`px-5 py-3 text-sm font-bold ${active === "create" ? "bg-[#213255] text-white" : "text-[#34466f]"}`}
        onClick={() => onChange("create")}
        type="button"
      >
        Crear publicación
      </button>
      <button
        className={`px-5 py-3 text-sm font-bold ${active === "manage" ? "bg-[#213255] text-white" : "text-[#34466f]"}`}
        onClick={() => onChange("manage")}
        type="button"
      >
        Publicaciones
      </button>
    </div>
  );
}

function Field({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="text-xs font-semibold text-[#34466f]">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] px-3 text-sm outline-none focus:border-[#58c3de]"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function PrimaryImageInput({
  image,
  onChange,
  type,
}: {
  image: string;
  onChange: (image: string) => void;
  type: CreateContentProps["type"];
}) {
  const [status, setStatus] = useState("");

  async function selectImage(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setStatus("Subiendo...");
    try {
      const uploaded = await uploadFile(file, "image");
      onChange(uploaded.url);
      setStatus("Imagen cargada");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo subir");
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-[#9eddea] bg-[#f4fbfd] p-4">
      <p className="text-sm font-bold text-[#213255]">Imagen principal</p>
      <p className="mt-2 text-xs text-[#34466f]">
        {type === "blog"
          ? "Portada recomendada: 1600 x 900 px"
          : type === "line"
            ? "Imagen recomendada: 1600 x 1000 px"
            : "Principal recomendada: 1600 x 1600 px"}
      </p>
      <p className="mt-1 text-xs text-[#667085]">JPG, PNG, WEBP · máximo 20 MB</p>
      <label className="mt-4 inline-flex cursor-pointer rounded-md bg-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]">
        Cargar
        <input
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => selectImage(event.target.files)}
          type="file"
        />
      </label>
      <p className="mt-2 text-xs font-semibold text-[#34466f]">{status}</p>
      {image && (
        <div className="mt-4 overflow-hidden rounded-lg border border-[#d7e9ef] bg-white">
          <div className="h-28 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url("${image}")` }} />
          <button className="m-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700" onClick={() => onChange("")} type="button">
            Quitar imagen
          </button>
        </div>
      )}
    </div>
  );
}

function MediaInput({
  accept,
  files,
  formats,
  label,
  maxFiles,
  maxSize,
  onChange,
  type,
}: {
  accept: string;
  files: MediaFile[];
  formats: string;
  label: string;
  maxFiles: number;
  maxSize: string;
  onChange: (files: MediaFile[]) => void;
  type: MediaFile["type"];
}) {
  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const availableSlots = Math.max(0, maxFiles - files.length);
    const selected = Array.from(fileList).slice(0, availableSlots);
    if (!selected.length) return;

    Promise.all(selected.map((file) => uploadFile(file, type)))
      .then((uploaded) => onChange([...files, ...uploaded]))
      .catch(() => undefined);
  }

  return (
    <div className="rounded-lg border border-dashed border-[#9eddea] bg-[#f4fbfd] p-4">
      <p className="text-sm font-bold text-[#213255]">{label}</p>
      <p className="mt-2 text-xs text-[#34466f]">{formats}</p>
      <p className="mt-1 text-xs text-[#667085]">{maxSize} · hasta {maxFiles} archivos</p>
      <label className="mt-4 inline-flex cursor-pointer rounded-md bg-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]">
        Agregar
        <input accept={accept} className="hidden" multiple onChange={(event) => addFiles(event.target.files)} type="file" />
      </label>
      {files.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {files.map((file) => (
            <div className="overflow-hidden rounded-lg border border-[#d7e9ef] bg-white shadow-sm" key={file.id}>
              {file.type === "image" ? (
                <div className="h-24 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url("${file.url}")` }} />
              ) : (
                <div className="grid h-24 place-items-center bg-[#eaf8fc] px-3 text-center text-xs font-bold text-[#213255]">
                  {file.type === "video" ? "Video" : "Documento"}
                </div>
              )}
              <div className="grid gap-2 p-3">
              <span className="break-words text-xs font-semibold leading-5 text-[#34466f]">{file.name}</span>
              <button
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700"
                onClick={() => onChange(files.filter((item) => item.id !== file.id))}
                type="button"
              >
                Quitar
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreatePreview({
  form,
  slug,
  type,
}: {
  form: FormState;
  slug: string;
  type: CreateContentProps["type"];
}) {
  if (type === "blog") {
    return (
      <article className="overflow-hidden rounded-xl border border-[#d7e9ef] bg-white">
        <PreviewImage image={form.primaryImage} label="Imagen principal" ratio="aspect-[16/9]" />
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#58c3de]">{form.date || "Fecha"}</p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-[#213255]">{form.title || "Título de la noticia o blog"}</h2>
          <p className="mt-3 text-sm leading-6 text-[#34466f]">{form.excerpt || "Breve reseña de la publicación."}</p>
          <div className="mt-5 space-y-3 text-sm leading-6 text-[#213255]">
            {(form.body || "Historia o artículo de la publicación.").split("\n").filter(Boolean).map((paragraph, index) => (
              <p key={`${paragraph}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    );
  }

  if (type === "line") {
    return (
      <div className="rounded-xl border border-[#d7e9ef] bg-white p-5">
        <PreviewImage image={form.primaryImage} label="Imagen de línea" ratio="aspect-[16/10]" />
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#58c3de]">Línea de productos</p>
        <h2 className="mt-3 text-2xl font-bold text-[#213255]">{form.title || "Nombre de la línea"}</h2>
        <p className="mt-3 text-sm leading-6 text-[#34466f]">{form.excerpt || "Descripción corta de la línea."}</p>
        <p className="mt-3 text-sm leading-6 text-[#213255]">{form.body || "Resumen técnico de la línea."}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#d7e9ef] bg-white p-5">
      <PreviewImage image={form.primaryImage} label="Imagen principal" ratio="aspect-square" />
      <div className="mt-4 flex flex-wrap gap-2">
        {form.secondaryImages.slice(0, 4).map((image) => (
          <div className="h-16 w-16 rounded-lg border border-[#d7e9ef] bg-cover bg-center" key={image.id} style={{ backgroundImage: `url("${image.url}")` }} />
        ))}
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#58c3de]">{form.line || "Línea de producto"}</p>
      <h2 className="mt-3 text-2xl font-bold text-[#213255]">{form.title || "Nombre del producto"}</h2>
      <p className="mt-3 text-sm leading-6 text-[#34466f]">{form.excerpt || "Descripción corta del producto."}</p>
      <div className="mt-5 grid gap-2 text-sm text-[#213255]">
        <PreviewRow label="Marca" value={form.brand} />
        <PreviewRow label="Modelo" value={form.model || "Según equipo"} />
        <PreviewRow label="Código" value={form.internalCode || "VM-000"} />
        <PreviewRow label="Etiquetas" value={form.tags || "Mantención, reparación"} />
      </div>
      <p className="mt-5 text-sm leading-6 text-[#213255]">{form.body || "Descripción completa del producto."}</p>
      <p className="mt-4 text-xs font-semibold text-[#34466f]">Slug: /catalogo/{slug}</p>
    </div>
  );
}

function PreviewImage({ image, label, ratio }: { image: string; label: string; ratio: string }) {
  return (
    <div
      className={`${ratio} grid place-items-center rounded-lg border border-[#d7e9ef] bg-[#eaf8fc] bg-cover bg-center text-sm font-semibold text-[#34466f]`}
      style={{ backgroundImage: image ? `url("${image}")` : undefined }}
    >
      {!image && label}
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#d7e9ef] py-2">
      <span className="font-semibold text-[#34466f]">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

async function uploadFile(file: File, kind: MediaFile["type"]): Promise<MediaFile> {
  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      mimeType: file.type,
      kind,
    }),
  });
  const result = (await response.json()) as {
    error?: string;
    name?: string;
    type?: MediaFile["type"];
    uploadUrl?: string;
    url?: string;
  };
  if (!response.ok || !result.url || !result.uploadUrl) {
    throw new Error(result.error || "No se pudo subir el archivo");
  }
  const uploadResponse = await fetch(result.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!uploadResponse.ok) throw new Error("No se pudo subir el archivo");
  return {
    id: crypto.randomUUID(),
    name: result.name || file.name,
    type: result.type || kind,
    url: result.url,
  };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
