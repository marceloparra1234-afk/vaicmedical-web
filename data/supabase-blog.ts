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
    `${config.url}/rest/v1/created_content?content_type=eq.blog&select=id,slug,content,created_at&order=created_at.desc`,
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
    content: Partial<ManagedBlogPost>;
    created_at: string;
  }>;

  const stored = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.content.title || "Publicación sin título",
    date: row.content.date || "",
    excerpt: row.content.excerpt || "",
    body: row.content.body || "",
    primaryImage: row.content.primaryImage || "/blog-article.svg",
    featured: Boolean(row.content.featured),
    createdAt: row.created_at,
  }));

  if (!stored.length) return getFallbackPosts();

  return stored.sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );
}

export async function getManagedBlogPost(slug: string) {
  const posts = await getManagedBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}
