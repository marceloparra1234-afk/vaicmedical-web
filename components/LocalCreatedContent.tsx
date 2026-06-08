"use client";

import { useEffect, useState } from "react";

type CreatedItem = {
  id: string;
  slug: string;
  title: string;
  line?: string;
  date?: string;
  excerpt: string;
  body: string;
  brand?: string;
  model?: string;
  internalCode?: string;
  tags?: string;
  primaryImage: string;
  createdAt: string;
};

function readItems(key: string) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]") as CreatedItem[];
  } catch {
    return [];
  }
}

function mergeItems(primary: CreatedItem[], fallback: CreatedItem[]) {
  const seen = new Set(primary.map((item) => item.slug || item.id));
  return [
    ...primary,
    ...fallback.filter((item) => !seen.has(item.slug || item.id)),
  ];
}

function useCreatedItems(type: "blog" | "line" | "product", key: string) {
  const [items, setItems] = useState<CreatedItem[]>([]);

  useEffect(() => {
    async function load() {
      const localItems = readItems(key);

      try {
        const response = await fetch(`/api/admin/created-content?type=${type}`);
        if (!response.ok) {
          setItems(localItems);
          return;
        }

        const result = (await response.json()) as { items?: CreatedItem[] };
        setItems(mergeItems(result.items || [], localItems));
      } catch {
        setItems(localItems);
      }
    }

    load();
    window.addEventListener("storage", load);
    window.addEventListener("vaicmedical-content-created", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("vaicmedical-content-created", load);
    };
  }, [key, type]);

  return items;
}

export function LocalCreatedBlogPosts() {
  const posts = useCreatedItems("blog", "vaicmedical-created-blog");

  if (!posts.length) return null;

  return (
    <>
      {posts.map((post) => (
        <article
          className="group rounded-3xl border border-[#d7e9ef] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#213255]/10"
          key={post.id}
        >
          <div
            className="mb-6 aspect-[16/9] rounded-2xl border border-[#d7e9ef] bg-[#eaf8fc] bg-cover bg-center"
            style={{ backgroundImage: post.primaryImage ? `url("${post.primaryImage}")` : undefined }}
          />
          <p className="font-mono text-xs font-semibold text-[#58c3de]">
            PUBLICACION LOCAL
          </p>
          <h2 className="mt-5 text-xl font-semibold leading-7 text-[#213255]">
            {post.title}
          </h2>
          <p className="mt-4 leading-7 text-[#34466f]">{post.excerpt}</p>
          <p className="mt-6 text-sm font-semibold text-[#213255]">
            Vista creada en editor local
          </p>
        </article>
      ))}
    </>
  );
}

export function LocalCreatedCatalogSections() {
  const lines = useCreatedItems("line", "vaicmedical-created-lines");
  const products = useCreatedItems("product", "vaicmedical-created-products");

  if (!lines.length && !products.length) return null;

  return (
    <>
      {lines.map((line, index) => (
        <section
          className="scroll-mt-28 overflow-hidden rounded-[32px] border border-[#d7e9ef] bg-white shadow-sm"
          data-editor-section="linea-local"
          id={line.slug}
          key={line.id}
        >
          <div className="grid gap-8 bg-[#213255] p-7 text-white sm:p-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
                Linea local {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                {line.title}
              </h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-[#dff7fb]">{line.excerpt}</p>
              <p className="mt-4 rounded-2xl border border-white/15 bg-white/8 px-5 py-4 text-sm leading-6 text-white/85">
                {line.body}
              </p>
            </div>
          </div>
        </section>
      ))}

      {products.length > 0 && (
        <section className="overflow-hidden rounded-[32px] border border-[#d7e9ef] bg-white shadow-sm">
          <div className="bg-[#213255] p-7 text-white sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
              Productos locales
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Productos creados desde el editor
            </h2>
          </div>
          <div className="grid gap-5 bg-[#f8fdfe] p-5 sm:p-7 lg:grid-cols-3">
            {products.map((product, index) => (
              <article
                className="group overflow-hidden rounded-[26px] border border-[#d7e9ef] bg-white shadow-sm"
                key={product.id}
              >
                <div
                  className="relative aspect-square bg-[#eaf8fc] bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: product.primaryImage ? `url("${product.primaryImage}")` : undefined }}
                >
                  <div className="absolute left-6 top-6 rounded-full bg-[#213255] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                    {product.line || "Producto"}
                  </div>
                  <div className="absolute right-7 top-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-semibold text-[#58c3de] shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-[#213255]">
                    {product.title}
                  </h3>
                  <p className="mt-4 min-h-24 leading-7 text-[#34466f]">
                    {product.excerpt}
                  </p>
                  <p className="mt-6 text-sm font-semibold text-[#58c3de]">
                    Vista creada en editor local
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
