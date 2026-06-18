import "server-only";

export type ManagedBlogPost = {
  id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  primaryImage: string;
  secondaryImages: Array<{ id?: string; url: string; name?: string; type?: string }>;
  featured: boolean;
  createdAt?: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

export async function getManagedBlogPosts() {
  const config = getSupabaseConfig();
  if (!config) return [];

  const response = await fetch(
    `${config.url}/rest/v1/created_content?content_type=eq.blog&select=id,slug,title:content-%3E%3Etitle,date:content-%3E%3Edate,excerpt:content-%3E%3Eexcerpt,primary_image:content-%3E%3EprimaryImage,secondary_images:content-%3EsecondaryImages,featured:content-%3Efeatured,created_at&order=created_at.desc`,
    {
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) return [];

  const rows = (await response.json()) as Array<{
    id: string;
    slug: string;
    title: string | null;
    date: string | null;
    excerpt: string | null;
    primary_image: string | null;
    secondary_images: ManagedBlogPost["secondaryImages"] | null;
    featured: boolean | null;
    created_at: string;
  }>;

  return rows
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title || "Publicación sin título",
      date: row.date || "",
      excerpt: row.excerpt || "",
      body: "",
      primaryImage: row.primary_image || "/blog-article.svg",
      secondaryImages: row.secondary_images || [],
      featured: Boolean(row.featured),
      createdAt: row.created_at,
    }))
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}

export async function getManagedBlogPost(slug: string) {
  const config = getSupabaseConfig();
  if (!config) return null;

  const response = await fetch(
    `${config.url}/rest/v1/created_content?content_type=eq.blog&slug=eq.${encodeURIComponent(slug)}&select=id,slug,content,created_at&limit=1`,
    {
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
      cache: "no-store",
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
    secondaryImages: row.content.secondaryImages || [],
    featured: Boolean(row.content.featured),
    createdAt: row.created_at,
  };
}
