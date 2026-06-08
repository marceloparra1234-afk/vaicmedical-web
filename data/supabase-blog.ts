import "server-only";

import { blogPosts } from "@/data/blog-posts";

export type ManagedBlogPost = {
  id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  primaryImage: string;
  featured: boolean;
  createdAt?: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

function getFallbackPosts(): ManagedBlogPost[] {
  return blogPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    body: post.body.join("\n"),
    primaryImage: post.image,
    featured: false,
  }));
}

export async function getManagedBlogPosts() {
  const config = getSupabaseConfig();
  if (!config) return getFallbackPosts();

  const response = await fetch(
    `${config.url}/rest/v1/created_content?content_type=eq.blog&select=id,slug,title:content-%3E%3Etitle,date:content-%3E%3Edate,excerpt:content-%3E%3Eexcerpt,primary_image:content-%3E%3EprimaryImage,featured:content-%3Efeatured,created_at&order=created_at.desc`,
    {
      cache: "no-store",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) return getFallbackPosts();

  const rows = (await response.json()) as Array<{
    id: string;
    slug: string;
    title: string | null;
    date: string | null;
    excerpt: string | null;
    primary_image: string | null;
    featured: boolean | null;
    created_at: string;
  }>;

  const stored = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title || "Publicación sin título",
    date: row.date || "",
    excerpt: row.excerpt || "",
    body: "",
    primaryImage: row.primary_image || "/blog-article.svg",
    featured: Boolean(row.featured),
    createdAt: row.created_at,
  }));

  if (!stored.length) return getFallbackPosts();

  return stored.sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );
}

export async function getManagedBlogPost(slug: string) {
  const config = getSupabaseConfig();
  if (!config) {
    return getFallbackPosts().find((post) => post.slug === slug) || null;
  }

  const response = await fetch(
    `${config.url}/rest/v1/created_content?content_type=eq.blog&slug=eq.${encodeURIComponent(slug)}&select=id,slug,content,created_at&limit=1`,
    {
      cache: "no-store",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
    },
  );
  if (!response.ok) return null;

  const rows = (await response.json()) as Array<{
    id: string;
    slug: string;
    content: Partial<ManagedBlogPost>;
    created_at: string;
  }>;
  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.content.title || "Publicación sin título",
    date: row.content.date || "",
    excerpt: row.content.excerpt || "",
    body: row.content.body || "",
    primaryImage: row.content.primaryImage || "/blog-article.svg",
    featured: Boolean(row.content.featured),
    createdAt: row.created_at,
  };
}
