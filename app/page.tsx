import Image from "next/image";
import Link from "next/link";
import { getHomeCatalogHighlights } from "@/data/catalog-service";
import { getManagedBlogPosts } from "@/data/supabase-blog";
import { getSiteContent } from "@/lib/supabase-admin";

type LinkedButton = {
  label?: string;
  href?: string;
  visible?: boolean;
};

type LinkedSection = {
  title?: string;
  subtitle?: string;
  content?: string;
  sectionImage?: string;
  sectionImages?: string[];
  buttons?: LinkedButton[];
};

const workflow = [
  ["Solicitud", "Recibimos el requerimiento y clasificamos la criticidad."],
  ["Diagnóstico", "Evaluamos la falla, el estado del equipo y sus condiciones de uso."],
  ["Reparación", "Ejecutamos mantención o reparación con criterio técnico."],
  ["Informe", "Documentamos el trabajo realizado y las recomendaciones."],
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
      {children}
    </p>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [managedPosts, createdProducts, inicio, nosotros, servicios, blog, catalogo] =
    await Promise.all([
      getManagedBlogPosts(),
      getHomeCatalogHighlights(),
      getSiteContent<Record<string, LinkedSection>>("inicio"),
      getSiteContent<Record<string, LinkedSection>>("nosotros"),
      getSiteContent<Record<string, LinkedSection>>("servicios"),
      getSiteContent<Record<string, LinkedSection>>("blog"),
      getSiteContent<Record<string, LinkedSection>>("catalogo"),
    ]);
  const featuredProducts = createdProducts.slice(0, 3);
  const latestPosts = managedPosts.slice(0, 3);
  const aboutSummary = nosotros?.["Hero principal"];
  const servicesSummary = servicios?.["Hero principal"];
  const blogSummary = blog?.["Hero principal"];
  const catalogSummary = catalogo?.["Hero principal"];
  const heroContent = inicio?.["Hero principal"];
  const heroButtons = heroContent?.buttons?.filter((button) => button.visible !== false) || [];
  const heroPrimaryButton = heroButtons[0] || { label: "Solicitar soporte", href: "/contacto" };
  const heroSecondaryButton = heroButtons[1] || { label: "Ver servicios", href: "/servicios" };
  const heroImage = heroContent?.sectionImages?.[0] || heroContent?.sectionImage || "/medical-dashboard.svg";

  return (
    <main>
      <section className="w-full border-b border-[#d7e9ef] bg-white" data-editor-section="hero">
        <div className="mx-auto grid max-w-[1540px] items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-14 lg:py-16">
          <div className="flex max-w-[44rem] flex-col items-center text-center">
            <p className="mb-5 inline-flex max-w-full rounded-full border border-[#b9e8f2] bg-[#f6fbfd] px-5 py-2 text-sm font-semibold text-[#213255]">
              {heroContent?.subtitle || "Mantenci\u00f3n y reparaci\u00f3n de equipos m\u00e9dicos"}
            </p>
            <h1
              className="text-5xl font-semibold leading-[1.08] text-[#213255] sm:text-6xl lg:text-[64px]"
              dangerouslySetInnerHTML={{ __html: heroContent?.title || "Soporte t\u00e9cnico para mantener operativa la atenci\u00f3n en salud." }}
            />
            <div
              className="mt-6 max-w-[36rem] text-lg leading-8 text-[#34466f]"
              dangerouslySetInnerHTML={{
                __html:
                  heroContent?.content ||
                  "Reparamos y mantenemos camas cl\u00ednicas, camillas, mesas quir\u00fargicas, l\u00e1mparas, monitores multipar\u00e1metros y otros equipos esenciales para la continuidad asistencial.",
              }}
            />
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className="rounded-full bg-[#213255] px-7 py-4 text-center font-semibold text-white transition hover:bg-[#34466f]"
                href={heroPrimaryButton.href || "/contacto"}
              >
                {heroPrimaryButton.label || "Solicitar soporte"}
              </Link>
              <Link
                className="rounded-full border border-[#9eddea] bg-white px-7 py-4 text-center font-semibold text-[#213255] transition hover:border-[#58c3de]"
                href={heroSecondaryButton.href || "/servicios"}
              >
                {heroSecondaryButton.label || "Ver servicios"}
              </Link>
            </div>
          </div>

          <div className="relative w-full">
            <div className="aspect-[1.9/1] w-full overflow-hidden rounded-[2rem] border border-[#d7e9ef] bg-[#eaf8fc] shadow-2xl shadow-[#213255]/10">
              <Image
                src={heroImage}
                alt="Equipos médicos en mantención y monitoreo técnico VaicMedical"
                width={1400}
                height={560}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d7e9ef] bg-[#f6fbfd]" data-editor-section="metodo">
        <div className="mx-auto grid max-w-7xl gap-0 px-5 py-8 sm:px-8 lg:grid-cols-4">
          {workflow.map(([title, text], index) => (
            <article
              className="relative flex min-h-40 flex-col items-center justify-center bg-[#213255] px-9 py-6 text-center text-white shadow-sm lg:mr-5 lg:clip-path-none lg:[clip-path:polygon(0_0,calc(100%-22px)_0,100%_50%,calc(100%-22px)_100%,0_100%,22px_50%)] lg:first:[clip-path:polygon(0_0,calc(100%-22px)_0,100%_50%,calc(100%-22px)_100%,0_100%)]"
              key={title}
            >
              <span className="font-mono text-xs font-semibold text-[#58c3de]">
                0{index + 1}
              </span>
              <h2 className="mt-3 text-xl font-semibold">
                {title}
              </h2>
              <p className="mt-2 max-w-52 text-sm leading-6 text-white/70">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#eaf8fc]" data-editor-section="nosotros">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionLabel>Nosotros</SectionLabel>
            <h2
              className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl"
              dangerouslySetInnerHTML={{ __html: aboutSummary?.title || "Trabajo técnico para equipos que no pueden quedar fuera de servicio." }}
            />
          </div>
          <div className="grid gap-8">
            <p
              className="text-lg leading-8 text-[#34466f]"
              dangerouslySetInnerHTML={{ __html: aboutSummary?.content || "VaicMedical se enfoca en diagnosticar, reparar y mantener equipos médicos de uso intensivo. Nuestro trabajo combina coordinación, criterio técnico y documentación para que cada requerimiento tenga seguimiento." }}
            />
            <Link
              className="w-fit rounded-full bg-[#213255] px-7 py-4 font-semibold text-white transition hover:bg-[#34466f]"
              href="/nosotros"
            >
              Conocer VaicMedical
            </Link>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 sm:px-8 md:grid-cols-3">
          {[
            ["Misión", "Recuperar y mantener equipos médicos críticos con respuesta técnica clara y trazable."],
            ["Visión", "Ser un aliado confiable para instituciones que necesitan continuidad operativa."],
            ["Valores", "Rigor técnico, responsabilidad, orden documental y compromiso con cada requerimiento."],
          ].map(([title, text]) => (
            <article
              className="rounded-3xl border border-[#c7e9f2] bg-white p-7 shadow-sm"
              key={title}
            >
              <div className="mb-6 h-2 w-14 rounded-full bg-[#58c3de]" />
              <h3 className="text-2xl font-semibold text-[#213255]">{title}</h3>
              <p className="mt-4 leading-7 text-[#34466f]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#213255] px-5 py-20 text-center text-white sm:px-8" data-editor-section="servicios">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]" data-editor-field="section-eyebrow">Servicios</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl" data-editor-field="section-title" dangerouslySetInnerHTML={{ __html: servicesSummary?.title || "Mantención preventiva, reparación correctiva y soporte en terreno." }} />
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70" data-editor-field="section-intro" dangerouslySetInnerHTML={{ __html: servicesSummary?.content || "Atendemos equipos esenciales para la operación diaria, con foco en recuperar disponibilidad y reducir tiempos fuera de servicio." }} />
            <Link
              className="mt-8 inline-flex rounded-full bg-[#58c3de] px-7 py-4 font-semibold text-[#213255] transition hover:bg-white"
              href="/servicios"
            >
              Ver servicios
            </Link>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#58c3de]/35 bg-[#eaf8fc] shadow-2xl shadow-black/20">
            <Image
              src="/service-maintenance.svg"
              alt="Representación de mantención y reparación de equipos médicos"
              width={900}
              height={620}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-white" data-editor-section="catalogo">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionLabel>Catálogo</SectionLabel>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl" dangerouslySetInnerHTML={{ __html: catalogSummary?.title || "Categorías para ordenar equipos, repuestos y solicitudes técnicas." }} />
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#34466f]" dangerouslySetInnerHTML={{ __html: catalogSummary?.content || "Revisa una selección de equipos, componentes y servicios técnicos. Cada producto cuenta con información, galería y acceso directo para realizar consultas." }} />
            <Link
              className="mt-8 inline-flex rounded-full bg-[#213255] px-7 py-4 font-semibold text-white transition hover:bg-[#34466f]"
              href="/catalogo"
            >
              Ver catálogo
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProducts.map((product) => (
              <Link
                className="group overflow-hidden rounded-3xl border border-[#d7e9ef] bg-[#f6fbfd] transition hover:-translate-y-1 hover:border-[#58c3de] hover:bg-white hover:shadow-lg"
                href={product.href}
                key={product.slug}
              >
                <div className="relative aspect-square border-b border-[#d7e9ef] bg-[#eaf8fc]">
                  <Image
                    alt={product.name}
                    className="object-contain p-7 transition duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    src={product.image}
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58c3de]">
                    {product.lineName}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#213255]">
                    {product.name}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#34466f]">
                    {product.description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-[#58c3de]">
                    Ver producto
                  </p>
                </div>
              </Link>
            ))}
            {!featuredProducts.length && (
              <p className="border border-[#d7e9ef] bg-[#f6fbfd] p-7 text-[#34466f] sm:col-span-2">
                Próximamente encontrarás nuestros productos.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#f6fbfd]" data-editor-section="blog">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel>Blog</SectionLabel>
              <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl" dangerouslySetInnerHTML={{ __html: blogSummary?.title || "Criterios técnicos para cuidar equipos médicos." }} />
            </div>
            <Link
              className="w-fit rounded-full border border-[#9eddea] bg-white px-7 py-4 font-semibold text-[#213255] transition hover:border-[#58c3de]"
              href="/blog"
            >
              Ver blog
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                className="group overflow-hidden border border-[#d7e9ef] bg-white transition hover:-translate-y-1 hover:border-[#58c3de] hover:shadow-lg"
                href={`/blog/${post.slug}`}
                key={post.slug}
              >
                <div className="relative aspect-[16/9] border-b border-[#d7e9ef] bg-[#eaf8fc]">
                  <Image
                    alt={post.title}
                    className="object-cover transition duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    src={post.primaryImage}
                  />
                </div>
                <article className="p-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-xs font-semibold text-[#58c3de]">
                      VAIC INSIGHTS
                    </p>
                    <time className="text-xs text-[#667085]">{post.date}</time>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold leading-7 text-[#213255]">
                    {post.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#34466f]">
                    {post.excerpt}
                  </p>
                  <p className="mt-6 text-sm font-semibold text-[#58c3de]">
                    Leer artículo
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white" data-editor-section="contacto">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <SectionLabel>Contacto</SectionLabel>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Coordinemos una evaluación técnica para tus equipos.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#34466f]">
              Puedes solicitar una visita, coordinar una reparación o consultar
              por mantenciones programadas.
            </p>
          </div>
          <div className="rounded-3xl bg-[#213255] p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
              Canal directo
            </p>
            <a
              className="mt-5 block text-2xl font-semibold"
              href="mailto:contacto@vaicmedical.cl"
            >
              contacto@vaicmedical.cl
            </a>
            <Link
              className="mt-8 inline-flex rounded-full bg-[#58c3de] px-7 py-4 font-semibold text-[#213255] transition hover:bg-white"
              href="/contacto"
            >
              Solicitar soporte
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
