import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManagedBlogPost } from "@/data/supabase-blog";

export const dynamic = "force-dynamic";

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getManagedBlogPost(slug);

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
              src={post.primaryImage}
              alt={post.title}
              width={1200}
              height={720}
              priority
              unoptimized={post.primaryImage.startsWith("data:")}
              className="h-auto w-full"
            />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8" data-editor-section="article-body">
          <div className="space-y-7 text-lg leading-9 text-[#34466f]">
            {post.body.split("\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
