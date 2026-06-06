"use client";

import { useState } from "react";
import { PageHeading } from "@/components/admin/AdminDashboard";

type EditorWorkspaceProps = {
  title: string;
  description: string;
  sections: string[];
  previewType?: "page" | "popup";
};

export function AdminEditorWorkspace({
  title,
  description,
  sections,
  previewType = "page",
}: EditorWorkspaceProps) {
  const [selected, setSelected] = useState(sections[0]);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeading eyebrow="Editor de página" title={title} text={description} />

      <div className="mt-7 min-h-[760px] overflow-hidden rounded-xl border border-[#d7e9ef] bg-white shadow-sm">
        <section className="border-b border-[#d7e9ef] bg-white">
          <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="shrink-0">
              <h2 className="font-bold">Secciones</h2>
              <p className="mt-1 text-xs text-[#667085]">
                Selecciona una sección para editarla y verla en la vista previa.
              </p>
            </div>
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 lg:justify-end">
              {sections.map((section) => (
                <button
                  className={`min-h-11 shrink-0 rounded-lg border px-4 py-3 text-center text-xs font-semibold transition ${
                    selected === section
                      ? "border-[#58c3de] bg-[#eaf8fc] text-[#213255]"
                      : "border-[#d7e9ef] text-[#667085] hover:border-[#58c3de]"
                  }`}
                  key={section}
                  onClick={() => setSelected(section)}
                  type="button"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="grid min-h-[690px] xl:grid-cols-[380px_minmax(0,1fr)]">
          <section className="border-b border-[#d7e9ef] bg-white xl:border-b-0 xl:border-r">
            <div className="border-b border-[#d7e9ef] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58c3de]">
                Editando sección
              </p>
              <h2 className="mt-1 font-bold">{selected}</h2>
            </div>
            <div className="max-h-[calc(100vh-245px)] overflow-y-auto">
              <EditorFields section={selected} previewType={previewType} />
            </div>
          </section>

          <section className="bg-[#eef5f7] p-5 sm:p-7">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58c3de]">
                  Vista previa
                </p>
                <h2 className="mt-1 font-bold">{selected}</h2>
              </div>
              <span className="rounded-lg border border-[#d7e9ef] bg-white px-3 py-2 text-xs text-[#667085]">
                Escritorio
              </span>
            </div>
            {previewType === "popup" ? (
              <PopupPreview section={selected} />
            ) : (
              <PagePreview section={selected} title={title} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function EditorFields({
  section,
  previewType,
}: {
  section: string;
  previewType: "page" | "popup";
}) {
  return (
    <div className="grid gap-5 p-5">
      <Field label="Título" placeholder={`Título de ${section}`} />
      <Field label="Subtítulo" placeholder="Texto secundario de la sección" />
      <label className="text-xs font-semibold text-[#34466f]">
        Contenido
        <textarea
          className="mt-2 min-h-28 w-full resize-y rounded-lg border border-[#d7e9ef] bg-white p-3 text-sm outline-none focus:border-[#58c3de]"
          defaultValue="Contenido editable de esta sección."
        />
      </label>
      <UploadGuide
        formats="JPG, PNG, WEBP"
        maxSize="Máximo 5 MB"
        recommended={
          previewType === "popup"
            ? "Recomendado: 1200 × 1200 px"
            : "Recomendado: 1920 × 1080 px"
        }
        title="Imagen de la sección"
      />
      <div className="grid grid-cols-2 gap-3">
        <button
          className="rounded-lg border border-[#d7e9ef] px-4 py-3 text-sm font-semibold text-[#667085]"
          type="button"
        >
          Descartar
        </button>
        <button
          className="rounded-lg bg-[#213255] px-4 py-3 text-sm font-semibold text-white"
          type="button"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="text-xs font-semibold text-[#34466f]">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-lg border border-[#d7e9ef] px-3 text-sm outline-none focus:border-[#58c3de]"
        placeholder={placeholder}
      />
    </label>
  );
}

export function UploadGuide({
  title,
  recommended,
  maxSize,
  formats,
}: {
  title: string;
  recommended: string;
  maxSize: string;
  formats: string;
}) {
  return (
    <label className="block cursor-pointer rounded-lg border border-dashed border-[#9eddea] bg-[#f4fbfd] p-4">
      <span className="text-sm font-bold text-[#213255]">{title}</span>
      <span className="mt-2 block text-xs text-[#34466f]">{recommended}</span>
      <span className="mt-1 block text-xs text-[#667085]">
        {formats} · {maxSize}
      </span>
      <span className="mt-4 inline-flex rounded-md bg-[#58c3de] px-3 py-2 text-xs font-bold text-[#213255]">
        Seleccionar archivo
      </span>
      <input className="hidden" type="file" />
    </label>
  );
}

function PagePreview({ section, title }: { section: string; title: string }) {
  return (
    <div className="min-h-[610px] overflow-hidden rounded-lg border border-[#d7e9ef] bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between border-b border-[#d7e9ef] px-5">
        <span className="font-bold text-[#213255]">VaicMedical</span>
        <div className="flex gap-3 text-[10px] text-[#667085]">
          <span>Inicio</span>
          <span>Nosotros</span>
          <span>Servicios</span>
          <span>Contacto</span>
        </div>
      </div>
      <div className="grid min-h-[360px] place-items-center bg-[#eaf8fc] p-8 text-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
            {section}
          </p>
          <h3 className="mx-auto mt-4 max-w-xl text-4xl font-bold text-[#213255]">
            Vista previa de {title}
          </h3>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#34466f]">
            Aquí se actualizará únicamente la sección seleccionada mientras se
            edita su contenido.
          </p>
        </div>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            className="h-32 rounded-lg border border-[#d7e9ef] bg-[#f6fbfd]"
            key={item}
          />
        ))}
      </div>
    </div>
  );
}

function PopupPreview({ section }: { section: string }) {
  return (
    <div className="grid min-h-[610px] place-items-center rounded-lg bg-[#213255]/65 p-7">
      <div className="grid w-full max-w-3xl overflow-hidden rounded-[24px] bg-white shadow-2xl md:grid-cols-2">
        <div className="grid min-h-72 place-items-center bg-[#eaf8fc] p-8 text-center text-sm text-[#667085]">
          Imagen 1200 × 1200 px
        </div>
        <div className="flex flex-col justify-center p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
            {section}
          </p>
          <h3 className="mt-3 text-2xl font-bold">Ventana emergente VaicMedical</h3>
          <p className="mt-4 text-sm leading-6 text-[#667085]">
            Esta vista previa mostrará los cambios de la ventana emergente.
          </p>
          <button
            className="mt-6 w-fit rounded-lg bg-[#213255] px-5 py-3 text-sm font-bold text-white"
            type="button"
          >
            Botón principal
          </button>
        </div>
      </div>
    </div>
  );
}
