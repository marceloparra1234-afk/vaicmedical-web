"use client";

import Image from "next/image";

export type PreviewContent = {
  title: string;
  subtitle: string;
  content: string;
  visible: boolean;
  eyebrow: string;
  shape: "arrow" | "rectangle" | "rounded" | "circle" | "hexagon" | "custom";
  customShapeImage: string;
  backgroundColor: string;
  itemColor: string;
  accentColor: string;
  textColor: string;
  sectionImage: string;
  sectionImages: string[];
  columns: number;
  buttons: Array<{
    id: string;
    label: string;
    href: string;
    visible: boolean;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
  }>;
  items: Array<{
    id: string;
    number: string;
    title: string;
    text: string;
    visible: boolean;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    numberColor: string;
    image: string;
    fieldType?: "text" | "email" | "tel" | "textarea" | "select";
    required?: boolean;
  }>;
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
  if (!content.visible) {
    return (
      <div className="grid min-h-[360px] place-items-center bg-[#f6fbfd] p-8 text-center text-sm text-[#667085]">
        Esta sección está oculta para la vista del cliente.
      </div>
    );
  }

  if (section === "Hero principal") {
    return (
      <section
        className="grid min-h-[430px] items-center gap-6 p-8 lg:grid-cols-[0.8fr_1.2fr]"
        style={{ backgroundColor: content.backgroundColor }}
      >
        <div className="text-center">
          <Rich
            className="rich-preview mb-5 inline-flex rounded-full border px-5 py-2 text-xs font-semibold text-[#213255]"
            html={content.subtitle}
            style={{
              backgroundColor: `${content.accentColor}18`,
              borderColor: content.accentColor,
            }}
          />
          <Rich
            className="rich-preview text-4xl font-semibold leading-tight text-[#213255]"
            html={content.title}
          />
          <Rich
            className="rich-preview mt-4 text-sm leading-6 text-[#34466f]"
            html={content.content}
          />
          <div className="mt-6 flex justify-center gap-3">
            {content.buttons.filter((button) => button.visible).map((button) => (
              <span
                className="rounded-full border px-5 py-3 text-xs font-semibold"
                key={button.id}
                style={buttonStyle(button)}
              >
                {button.label}
              </span>
            ))}
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
    const visibleItems = content.items.filter((item) => item.visible);
    return (
      <section className="p-8" style={{ backgroundColor: content.backgroundColor }}>
        {content.eyebrow && (
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: content.accentColor }}>
            {content.eyebrow}
          </p>
        )}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${Math.min(content.columns, visibleItems.length || 1)}, minmax(0, 1fr))` }}
        >
          {visibleItems.map((item, index) => (
              <article
                className={`relative flex min-h-40 flex-col items-center justify-center px-5 py-6 text-center ${
                  content.shape === "rounded" ? "rounded-3xl" : ""
                } ${content.shape === "circle" ? "aspect-square rounded-full" : ""} ${
                  content.shape === "hexagon" ? "vm-hex aspect-square" : ""
                }`}
                key={item.id}
                style={{
                  backgroundColor:
                    content.shape === "custom" ? "transparent" : content.itemColor,
                  backgroundImage:
                    content.shape === "custom" && content.customShapeImage
                      ? `url(${content.customShapeImage})`
                      : undefined,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  color: content.textColor,
                  clipPath:
                    content.shape === "arrow"
                      ? index === 0
                        ? "polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%)"
                        : "polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 18px 50%)"
                      : undefined,
                }}
              >
                <span className="text-[10px]" style={{ color: content.accentColor }}>
                  {item.number || String(index + 1).padStart(2, "0")}
                </span>
                <Rich className="rich-preview mt-2 font-semibold" html={item.title} />
                <Rich className="rich-preview mt-2 text-xs leading-5 opacity-75" html={item.text} />
              </article>
            ))}
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
              {content.eyebrow}
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
            {content.buttons.filter((button) => button.visible).slice(0, 1).map((button) => (
              <span className="mt-5 inline-flex rounded-full border px-5 py-3 text-xs font-semibold" key={button.id} style={buttonStyle(button)}>
                {button.label}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {content.items.filter((item) => item.visible).map((item) => (
            <article
              className={cardShapeClass(content.shape)}
              key={item.id}
              style={{
                backgroundColor: content.itemColor || item.backgroundColor,
                borderColor: item.borderColor,
                color: item.textColor,
              }}
            >
              <div
                className="mb-4 h-1.5 w-12 rounded-full"
                style={{ backgroundColor: content.accentColor }}
              />
              <Rich className="rich-preview text-xl font-semibold" html={item.title} />
              <Rich
                className="rich-preview mt-3 text-xs leading-6"
                html={item.text}
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
            {content.eyebrow}
          </p>
          <Rich
            className="rich-preview mt-3 text-4xl font-semibold leading-tight"
            html={content.title}
          />
          <Rich
            className="rich-preview mt-5 text-sm leading-7 text-white/70"
            html={content.content}
          />
          {content.buttons.filter((button) => button.visible).slice(0, 1).map((button) => (
            <span className="mt-6 inline-flex rounded-full border px-5 py-3 text-xs font-semibold" key={button.id} style={buttonStyle(button)}>
              {button.label}
            </span>
          ))}
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
          {content.eyebrow}
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
          {content.items.filter((item) => item.visible).map(
            (item) => (
              <article
                className={`overflow-hidden ${cardShapeClass(content.shape)}`}
                key={item.id}
                style={{
                  backgroundColor: content.itemColor || item.backgroundColor,
                  borderColor: item.borderColor,
                  color: item.textColor,
                }}
              >
                <div className="aspect-square bg-[#eaf8fc] p-4">
                  <Image alt="" height={200} src={item.image || "/service-maintenance.svg"} width={200} />
                </div>
                <Rich className="rich-preview p-3 text-xs font-semibold" html={item.title} />
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
          {content.eyebrow}
        </p>
        <Rich
          className="rich-preview mt-3 max-w-3xl text-4xl font-semibold leading-tight"
          html={content.title}
        />
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {content.items.filter((item) => item.visible).map((item) => (
            <article
              className={cardShapeClass(content.shape)}
              key={item.id}
              style={{
                backgroundColor: content.itemColor || item.backgroundColor,
                borderColor: item.borderColor,
                color: item.textColor,
              }}
            >
              <Image alt="" height={180} src={item.image || "/blog-article.svg"} width={320} />
              <div className="p-4">
                <p className="text-[10px] font-semibold text-[#58c3de]">
                  VAIC INSIGHTS
                </p>
                <Rich
                  className="rich-preview mt-3 text-sm font-semibold"
                  html={item.title}
                />
                <Rich className="rich-preview mt-2 text-xs leading-5 opacity-75" html={item.text} />
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
          {content.eyebrow}
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
        {content.buttons.filter((button) => button.visible).slice(0, 1).map((button) => (
          <span className="mt-5 inline-flex rounded-full border px-5 py-3 text-xs font-semibold" key={button.id} style={buttonStyle(button)}>
            {button.label}
          </span>
        ))}
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
  if (!content.visible) {
    return <HiddenSection />;
  }

  if (contentKey === "nosotros") {
    return <AboutPageSection content={content} section={section} />;
  }

  if (contentKey === "servicios") {
    return <ServicesPageSection content={content} section={section} />;
  }

  if (contentKey === "blog" || contentKey === "blog-vista") {
    return <BlogPageSection content={content} section={section} />;
  }

  if (contentKey.startsWith("catalogo")) {
    return <CatalogPageSection content={content} section={section} />;
  }

  if (contentKey === "contacto") {
    return <ContactPageSection content={content} section={section} />;
  }

  return <StandardSection content={content} section={section} />;
}

function AboutPageSection({ content, section }: SectionPreviewProps) {
  if (section === "Hero" || section === "Presentación") {
    return <PublicHero content={content} eyebrow="Nosotros" />;
  }

  return (
    <section className="bg-[#eaf8fc] p-9">
      <div className="rounded-[28px] border border-[#c7e9f2] bg-white p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
          {section}
        </p>
        <Rich className="rich-preview mt-3 text-4xl font-semibold" html={content.title} />
        <Rich className="rich-preview mt-4 text-sm leading-7 text-[#34466f]" html={content.content} />
        <EditableCards content={content} />
      </div>
    </section>
  );
}

function ServicesPageSection({ content, section }: SectionPreviewProps) {
  if (section === "Hero") return <PublicHero content={content} eyebrow="Servicios" />;

  if (section === "Llamado a contacto") {
    return (
      <section className="bg-[#213255] p-10 text-white">
        <Rich className="rich-preview max-w-3xl text-4xl font-semibold" html={content.title} />
        <Rich className="rich-preview mt-4 max-w-2xl text-sm leading-7 text-white/70" html={content.content} />
        <span className="mt-6 inline-flex rounded-full border px-5 py-3 text-xs font-semibold" style={buttonStyle(content.buttons[0])}>
          {content.buttons[0]?.label || "Solicitar soporte"}
        </span>
      </section>
    );
  }

  return (
    <section className="bg-white p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
        {section}
      </p>
      <Rich className="rich-preview mt-3 text-4xl font-semibold" html={content.title} />
      <EditableCards content={content} />
    </section>
  );
}

function BlogPageSection({ content, section }: SectionPreviewProps) {
  if (section === "Encabezado" || section === "Título y fecha") {
    return <PublicHero content={content} eyebrow="Blog" />;
  }
  return (
    <section className="bg-[#f6fbfd] p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
        {section}
      </p>
      <Rich className="rich-preview mt-3 text-4xl font-semibold" html={content.title} />
      <EditableCards content={content} imageMode />
    </section>
  );
}

function CatalogPageSection({ content, section }: SectionPreviewProps) {
  if (section === "Encabezado" || section === "Título de línea") {
    return <PublicHero content={content} eyebrow="Catálogo" />;
  }
  return (
    <section className="bg-white p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
        {section}
      </p>
      <Rich className="rich-preview mt-3 text-4xl font-semibold" html={content.title} />
      <EditableCards content={content} imageMode />
    </section>
  );
}

function ContactPageSection({ content, section }: SectionPreviewProps) {
  return (
    <section className="grid gap-7 bg-[#f6fbfd] p-9 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
          {section}
        </p>
        <Rich className="rich-preview mt-3 text-4xl font-semibold" html={content.title} />
        <Rich className="rich-preview mt-4 text-sm leading-7 text-[#34466f]" html={content.content} />
      </div>
      <div className="grid gap-3 rounded-2xl border border-[#d7e9ef] bg-white p-5">
        {["Nombre", "Correo", "Institución", "Mensaje"].map((field) => (
          <div className="h-11 rounded-lg border border-[#b9dce6] px-3 py-3 text-xs text-[#667085]" key={field}>
            {field}
          </div>
        ))}
      </div>
    </section>
  );
}

function PublicHero({ content, eyebrow }: { content: PreviewContent; eyebrow: string }) {
  return (
    <section className="bg-white p-10" style={{ backgroundColor: content.backgroundColor }}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: content.accentColor }}>
        {content.eyebrow || eyebrow}
      </p>
      <Rich className="rich-preview mt-3 max-w-5xl text-5xl font-semibold leading-tight" html={content.title} />
      <Rich className="rich-preview mt-5 max-w-3xl text-lg leading-8 text-[#34466f]" html={content.subtitle} />
      <Rich className="rich-preview mt-4 max-w-3xl text-sm leading-7 text-[#34466f]" html={content.content} />
    </section>
  );
}

function EditableCards({ content, imageMode = false }: { content: PreviewContent; imageMode?: boolean }) {
  const items = content.items.filter((item) => item.visible);
  return (
    <div className="mt-7 grid gap-4 md:grid-cols-3">
      {(items.length ? items : [createPreviewItem("Caja editable")]).map((item) => (
        <article
          className={`overflow-hidden ${cardShapeClass(content.shape)}`}
          key={item.id}
          style={{
            backgroundColor: content.itemColor || item.backgroundColor,
            borderColor: item.borderColor,
            color: item.textColor,
          }}
        >
          {imageMode && (
            <Image alt="" height={180} src={item.image || "/service-maintenance.svg"} width={320} />
          )}
          <Rich className="rich-preview text-lg font-semibold" html={item.title} />
          <Rich className="rich-preview mt-3 text-xs leading-6 opacity-75" html={item.text} />
        </article>
      ))}
    </div>
  );
}

function buttonStyle(button?: PreviewContent["buttons"][number]) {
  return {
    backgroundColor: button?.backgroundColor || "#213255",
    borderColor: button?.borderColor || "#213255",
    color: button?.textColor || "#ffffff",
  };
}

function StandardSection({ content, section }: SectionPreviewProps) {
  return (
    <section className="bg-white p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">{section}</p>
      <Rich className="rich-preview mt-3 text-5xl font-semibold" html={content.title} />
      <Rich className="rich-preview mt-5 text-lg text-[#34466f]" html={content.subtitle} />
      <Rich className="rich-preview mt-4 text-sm leading-7 text-[#34466f]" html={content.content} />
      <EditableCards content={content} />
    </section>
  );
}

function HiddenSection() {
  return (
    <div className="grid min-h-[360px] place-items-center bg-[#f6fbfd] p-8 text-sm text-[#667085]">
      Esta sección está oculta para la vista del cliente.
    </div>
  );
}

type SectionPreviewProps = { content: PreviewContent; section: string };

function createPreviewItem(title: string): PreviewContent["items"][number] {
  return {
    id: "preview",
    number: "",
    title,
    text: "Contenido editable de esta caja.",
    visible: true,
    backgroundColor: "#f6fbfd",
    borderColor: "#d7e9ef",
    textColor: "#213255",
    numberColor: "#58c3de",
    image: "",
  };
}

function Rich({
  html,
  className,
  style,
}: {
  html: string;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      style={style}
    />
  );
}

function cardShapeClass(shape: PreviewContent["shape"]) {
  if (shape === "rectangle") return "border p-5";
  if (shape === "circle") return "aspect-square rounded-full border p-6";
  if (shape === "hexagon") return "vm-hex aspect-square border p-7";
  return "rounded-2xl border p-5";
}
