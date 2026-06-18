import Image from "next/image";
import Link from "next/link";
import { getManagedBlogPosts } from "@/data/supabase-blog";
import { getSiteContent } from "@/lib/supabase-admin";

type BlogSection = {
  eyebrow?: string;
  title?: string;
  content?: string;
  sectionImage?: string;
  sectionImages?: string[];
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const [posts, blogContent] = await Promise.all([
    getManagedBlogPosts(),
    getSiteContent<Record<string, BlogSection>>("blog"),
  ]);
  const heroContent = blogContent?.["Hero principal"];
  const heroImage =
    heroContent?.sectionImages?.[0] ||
    heroContent?.sectionImage ||
    posts[0]?.primaryImage ||
    "/blog-article.svg";

  return (
    <main>
      <section
        className="mx-auto grid max-w-[1500px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]"
        data-editor-section="hero"
      >
        <div>
          <p
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]"
            data-editor-field="section-eyebrow"
          >
            {heroContent?.eyebrow || "Blog"}
          </p>
          <h1
            className="mt-3 max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl"
            data-editor-field="section-title"
            dangerouslySetInnerHTML={{
              __html:
                heroContent?.title ||
                "Contenido técnico para cuidar equipos médicos y reducir fallas.",
            }}
          />
          <p
            className="mt-6 max-w-2xl text-lg leading-8 text-[#34466f]"
            data-editor-field="section-intro"
            dangerouslySetInnerHTML={{
              __html:
                heroContent?.content ||
                "Noticias, criterios técnicos y recomendaciones para apoyar la continuidad operativa.",
            }}
          />
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-[#d7e9ef] bg-[#eaf8fc] shadow-xl shadow-[#213255]/10">
          <Image
            alt="Contenido técnico VaicMedical"
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={heroImage}
            unoptimized={heroImage.startsWith("data:")}
          />
        </div>
      </section>

      <section
        className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 sm:px-8 md:grid-cols-3"
        data-dynamic-content="blog-posts"
        data-editor-section="publicaciones"
      >
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-3xl border border-[#d7e9ef] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#213255]/10"
          >
            <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl border border-[#d7e9ef] bg-[#eaf8fc]">
              <Image
                alt={post.title}
                className="object-cover transition duration-300 group-hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                src={post.primaryImage}
                unoptimized={post.primaryImage.startsWith("data:")}
              />
            </div>
            <p className="font-mono text-xs font-semibold text-[#58c3de]">
              {post.featured ? "DESTACADO" : "VAIC INSIGHTS"}
            </p>
            <h2 className="mt-5 text-xl font-semibold leading-7">
              {post.title}
            </h2>
            <p className="mt-4 leading-7 text-[#34466f]">{post.excerpt}</p>
            <p className="mt-6 text-sm font-semibold text-[#213255] transition group-hover:text-[#58c3de]">
              Leer artículo
            </p>
          </Link>
        ))}
        {!posts.length && (
          <div className="rounded-3xl border border-[#d7e9ef] bg-white p-8 text-[#34466f] md:col-span-3">
            Aún no hay publicaciones cargadas.
          </div>
        )}
      </section>
    </main>
  );
}
