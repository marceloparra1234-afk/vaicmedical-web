import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/data/blog-posts";

export const dynamic = "force-dynamic";

type ArticlePost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  body: string[];
};

async function getCreatedBlogPost(slug: string): Promise<ArticlePost | null> {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  const response = await fetch(
    `${url}/rest/v1/created_content?content_type=eq.blog&slug=eq.${encodeURIComponent(slug)}&select=slug,content&limit=1`,
    {
      cache: "no-store",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) return null;

  const rows = (await response.json()) as Array<{
    slug: string;
    content: {
      title?: string;
      date?: string;
      excerpt?: string;
      body?: string;
      primaryImage?: string;
    };
  }>;
  const row = rows[0];
  if (!row?.content.title) return null;

  return {
    slug: row.slug,
    title: row.content.title,
    date: row.content.date || "",
    excerpt: row.content.excerpt || "",
    image: row.content.primaryImage || "/blog-article.svg",
    body: (row.content.body || "").split("\n").filter(Boolean),
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug) || (await getCreatedBlogPost(slug));

  if (!post) notFound();

  return (
    <main className="bg-white text-[#213255]">
      <article>
        <header className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-20" data-editor-section="article-header">
          <Link
            href="/blog"
            className="text-sm font-bold text-[#58c3de] transition hover:text-[#213255]"
          >
            ← Volver al blog
          </Link>
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
            Artículo VaicMedical
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight sm:text-7xl">
            {post.title}
          </h1>
          <p className="mt-6 font-mono text-sm text-[#34466f]">{post.date}</p>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-[#34466f]">
            {post.excerpt}
          </p>
        </header>

        <section className="mx-auto max-w-6xl px-5 sm:px-8" data-editor-section="article-image">
          <div className="overflow-hidden rounded-[2rem] border border-[#d7e9ef] bg-[#eaf8fc] shadow-xl shadow-[#213255]/10">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={720}
              priority
              unoptimized={post.image.startsWith("data:")}
              className="h-auto w-full"
            />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8" data-editor-section="article-body">
          <div className="space-y-7 text-lg leading-9 text-[#34466f]">
            {post.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
