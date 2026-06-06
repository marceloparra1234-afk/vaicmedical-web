import { PageHeading } from "@/components/admin/AdminDashboard";
import { UploadGuide } from "@/components/admin/AdminEditorWorkspace";

type CreateContentProps = {
  type: "blog" | "line" | "product";
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

export function AdminCreateContent({ type }: CreateContentProps) {
  const content = config[type];

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading
        eyebrow={content.eyebrow}
        title={content.title}
        text={content.text}
      />
      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="grid gap-5 rounded-xl border border-[#d7e9ef] bg-white p-6 shadow-sm">
          <Field label="Título" />
          {type === "product" && <Field label="Línea de producto" />}
          {type === "blog" && <Field label="Fecha de publicación" type="date" />}
          <Field label={type === "blog" ? "Breve reseña" : "Descripción corta"} />
          <label className="text-xs font-semibold text-[#34466f]">
            {type === "blog" ? "Artículo o historia" : "Descripción completa"}
            <textarea className="mt-2 min-h-52 w-full rounded-lg border border-[#d7e9ef] p-3 text-sm outline-none focus:border-[#58c3de]" />
          </label>
          {type === "product" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Marca" />
              <Field label="Modelo" />
              <Field label="Código interno" />
              <Field label="Etiquetas" />
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-[#d7e9ef] pt-5">
            <button
              className="rounded-lg border border-[#d7e9ef] px-5 py-3 text-sm font-semibold text-[#667085]"
              type="button"
            >
              Guardar borrador
            </button>
            <button
              className="rounded-lg bg-[#213255] px-5 py-3 text-sm font-semibold text-white"
              type="button"
            >
              Publicar
            </button>
          </div>
        </section>

        <aside className="grid content-start gap-4">
          <UploadGuide
            formats="JPG, PNG, WEBP"
            maxSize="Máximo 5 MB por imagen"
            recommended={
              type === "blog"
                ? "Portada recomendada: 1600 × 900 px"
                : type === "line"
                  ? "Imagen recomendada: 1600 × 1000 px"
                  : "Principal recomendada: 1600 × 1600 px"
            }
            title="Imagen principal"
          />
          <UploadGuide
            formats="JPG, PNG, WEBP"
            maxSize="Máximo 5 MB por imagen · hasta 10 archivos"
            recommended="Galería recomendada: 1600 × 1600 px"
            title="Imágenes secundarias"
          />
          <UploadGuide
            formats="MP4, WEBM"
            maxSize="Máximo 50 MB por video"
            recommended="Video recomendado: 1920 × 1080 px"
            title="Videos"
          />
          <UploadGuide
            formats="PDF"
            maxSize="Máximo 15 MB por documento"
            recommended="Ficha técnica, manual, certificados o brochure"
            title="Documentos"
          />
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
}: {
  label: string;
  type?: string;
}) {
  return (
    <label className="text-xs font-semibold text-[#34466f]">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] px-3 text-sm outline-none focus:border-[#58c3de]"
        type={type}
      />
    </label>
  );
}
