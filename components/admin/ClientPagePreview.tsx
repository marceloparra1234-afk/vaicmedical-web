"use client";

import Image from "next/image";

export type PreviewContent = {
  title: string;
  subtitle: string;
  content: string;
};

export function ClientPagePreview({
  contentKey,
  section,
  content,
}: {
  contentKey: string;
  section: string;
  content: PreviewContent;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#d7e9ef] bg-white shadow-sm">
      <ClientHeader />
      <div className="max-h-[650px] overflow-auto">
        {contentKey === "inicio" ? (
          <HomeSectionPreview content={content} section={section} />
        ) : (
          <InternalPagePreview
            content={content}
            contentKey={contentKey}
            section={section}
          />
        )}
      </div>
    </div>
  );
}

function ClientHeader() {
  return (
    <div className="flex h-16 items-center justify-between border-b border-[#d7e9ef] bg-[#f6fbfd] px-5">
      <Image
        alt="VaicMedical"
        className="h-8 w-auto"
        height={32}
        src="/brand/vaicmedical-logo.svg"
        width={180}
      />
      <div className="flex items-center gap-4 text-[10px] font-medium text-[#213255]">
        <span>Inicio</span>
        <span>Nosotros</span>
        <span>Servicios</span>
        <span>Blog</span>
        <span>Catálogo</span>
        <span className="rounded-full bg-[#213255] px-3 py-2 text-white">
          Contacto
        </span>
      </div>
    </div>
  );
}

function HomeSectionPreview({
  section,
  content,
}: {
  section: string;
  content: PreviewContent;
}) {
  if (section === "Hero principal") {
    return (
      <section className="grid min-h-[430px] items-center gap-6 bg-white p-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="text-center">
          <Rich
            className="rich-preview text-4xl font-semibold leading-tight text-[#213255]"
            html={content.title}
          />
          <Rich
            className="rich-preview mt-4 text-sm leading-6 text-[#34466f]"
            html={content.subtitle}
          />
          <Rich
            className="rich-preview mt-4 text-sm leading-6 text-[#34466f]"
            html={content.content}
          />
          <div className="mt-6 flex justify-center gap-3">
            <span className="rounded-full bg-[#213255] px-5 py-3 text-xs font-semibold text-white">
              Solicitar soporte
            </span>
            <span className="rounded-full border border-[#9eddea] px-5 py-3 text-xs font-semibold">
              Ver servicios
            </span>
          </div>
        </div>
        <div className="overflow-hidden rounded-[24px] border border-[#d7e9ef] bg-[#eaf8fc]">
          <Image
            alt=""
            className="h-auto w-full object-cover"
            height={560}
            src="/medical-dashboard.svg"
            width={1400}
          />
        </div>
      </section>
    );
  }

  if (section === "Método de trabajo") {
    return (
      <section className="bg-[#f6fbfd] p-8">
        <div className="grid gap-0 lg:grid-cols-4">
          {["Solicitud", "Diagnóstico", "Reparación", "Informe"].map(
            (item, index) => (
              <article
                className="relative flex min-h-40 flex-col items-center justify-center bg-[#213255] px-5 py-6 text-center text-white lg:mr-4 lg:[clip-path:polygon(0_0,calc(100%-18px)_0,100%_50%,calc(100%-18px)_100%,0_100%,18px_50%)] lg:first:[clip-path:polygon(0_0,calc(100%-18px)_0,100%_50%,calc(100%-18px)_100%,0_100%)]"
                key={item}
              >
                <span className="text-[10px] text-[#58c3de]">0{index + 1}</span>
                <h3 className="mt-2 font-semibold">{item}</h3>
                {index === 0 && (
                  <Rich
                    className="rich-preview mt-2 text-xs leading-5 text-white/70"
                    html={content.content}
                  />
                )}
              </article>
            ),
          )}
        </div>
      </section>
    );
  }

  if (section === "Nosotros") {
    return (
      <section className="bg-[#eaf8fc] p-9">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
              Nosotros
            </p>
            <Rich
              className="rich-preview mt-3 text-4xl font-semibold leading-tight"
              html={content.title}
            />
          </div>
          <div>
            <Rich
              className="rich-preview text-sm leading-7 text-[#34466f]"
              html={content.content}
            />
            <span className="mt-5 inline-flex rounded-full bg-[#213255] px-5 py-3 text-xs font-semibold text-white">
              Conocer VaicMedical
            </span>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Misión", "Visión", "Valores"].map((item) => (
            <article
              className="rounded-2xl border border-[#c7e9f2] bg-white p-5"
              key={item}
            >
              <div className="mb-4 h-1.5 w-12 rounded-full bg-[#58c3de]" />
              <h3 className="text-xl font-semibold">{item}</h3>
              <Rich
                className="rich-preview mt-3 text-xs leading-6 text-[#34466f]"
                html={content.subtitle}
              />
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section === "Servicios") {
    return (
      <section className="grid items-center gap-8 bg-[#213255] p-9 text-center text-white lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
            Servicios
          </p>
          <Rich
            className="rich-preview mt-3 text-4xl font-semibold leading-tight"
            html={content.title}
          />
          <Rich
            className="rich-preview mt-5 text-sm leading-7 text-white/70"
            html={content.content}
          />
          <span className="mt-6 inline-flex rounded-full bg-[#58c3de] px-5 py-3 text-xs font-semibold text-[#213255]">
            Ver servicios
          </span>
        </div>
        <div className="overflow-hidden rounded-[24px] border border-[#58c3de]/35 bg-[#eaf8fc]">
          <Image alt="" height={620} src="/service-maintenance.svg" width={900} />
        </div>
      </section>
    );
  }

  if (section === "Productos destacados") {
    return (
      <section className="grid gap-8 bg-white p-9 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
            Catálogo
          </p>
          <Rich
            className="rich-preview mt-3 text-4xl font-semibold leading-tight"
            html={content.title}
          />
          <Rich
            className="rich-preview mt-4 text-sm leading-7 text-[#34466f]"
            html={content.content}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {["Camas clínicas", "Mesas quirúrgicas", "Monitores", "Actuadores"].map(
            (item) => (
              <article
                className="overflow-hidden rounded-2xl border border-[#d7e9ef] bg-[#f6fbfd]"
                key={item}
              >
                <div className="aspect-square bg-[#eaf8fc] p-4">
                  <Image alt="" height={200} src="/service-maintenance.svg" width={200} />
                </div>
                <p className="p-3 text-xs font-semibold">{item}</p>
              </article>
            ),
          )}
        </div>
      </section>
    );
  }

  if (section === "Noticias destacadas") {
    return (
      <section className="bg-[#f6fbfd] p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
          Blog
        </p>
        <Rich
          className="rich-preview mt-3 max-w-3xl text-4xl font-semibold leading-tight"
          html={content.title}
        />
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <article className="border border-[#d7e9ef] bg-white" key={item}>
              <Image alt="" height={180} src="/blog-article.svg" width={320} />
              <div className="p-4">
                <p className="text-[10px] font-semibold text-[#58c3de]">
                  VAIC INSIGHTS
                </p>
                <Rich
                  className="rich-preview mt-3 text-sm font-semibold"
                  html={content.subtitle}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-8 bg-white p-9 lg:grid-cols-[1fr_0.75fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
          Contacto
        </p>
        <Rich
          className="rich-preview mt-3 text-4xl font-semibold leading-tight"
          html={content.title}
        />
        <Rich
          className="rich-preview mt-4 text-sm leading-7 text-[#34466f]"
          html={content.content}
        />
      </div>
      <div className="rounded-2xl bg-[#213255] p-6 text-white">
        <p className="text-xs uppercase tracking-[0.18em] text-[#58c3de]">
          Canal directo
        </p>
        <p className="mt-4 text-xl font-semibold">contacto@vaicmedical.cl</p>
        <span className="mt-5 inline-flex rounded-full bg-[#58c3de] px-5 py-3 text-xs font-semibold text-[#213255]">
          Solicitar soporte
        </span>
      </div>
    </section>
  );
}

function InternalPagePreview({
  contentKey,
  section,
  content,
}: {
  contentKey: string;
  section: string;
  content: PreviewContent;
}) {
  const isDark =
    contentKey === "servicios" &&
    (section === "Soporte técnico" || section === "Llamado a contacto");

  return (
    <section className={isDark ? "bg-[#213255] p-10 text-white" : "bg-white p-10"}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
        {section}
      </p>
      <Rich
        className="rich-preview mt-3 max-w-4xl text-5xl font-semibold leading-tight"
        html={content.title}
      />
      <Rich
        className={`rich-preview mt-5 max-w-3xl text-lg leading-8 ${
          isDark ? "text-white/75" : "text-[#34466f]"
        }`}
        html={content.subtitle}
      />
      <Rich
        className={`rich-preview mt-5 max-w-3xl text-sm leading-7 ${
          isDark ? "text-white/70" : "text-[#34466f]"
        }`}
        html={content.content}
      />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            className={`min-h-36 rounded-2xl border p-5 ${
              isDark
                ? "border-white/15 bg-white/5"
                : "border-[#d7e9ef] bg-[#f6fbfd]"
            }`}
            key={item}
          >
            <div className="mb-4 h-1.5 w-12 rounded-full bg-[#58c3de]" />
            <Rich
              className="rich-preview text-sm font-semibold"
              html={content.subtitle}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function Rich({ html, className }: { html: string; className: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
