import "server-only";

import { getSupabaseAdminConfig, getSupabaseAdminHeaders } from "@/lib/supabase-admin";

export type ManagedCreatedContent = {
  id: string;
  slug: string;
  title?: string;
  excerpt?: string;
  body?: string;
  line?: string;
  primaryImage?: string;
  featured?: boolean;
  active?: boolean;
  brand?: string;
  model?: string;
  internalCode?: string;
  tags?: string;
  sublines?: string[];
  subline?: string;
  order?: number;
  certifications?: Array<{ id: string; name: string; url: string; type: string }>;
  technicalSheet?: { id: string; name: string; url: string; type: string } | null;
  deletedAt?: string;
  secondaryImages?: Array<{ id: string; name: string; url: string; type: string }>;
  videos?: Array<{ id: string; name: string; url: string; type: string }>;
  documents?: Array<{ id: string; name: string; url: string; type: string }>;
  createdAt: string;
};

export async function getManagedCreatedContent(
  type: "line" | "product",
): Promise<ManagedCreatedContent[]> {
  const config = getSupabaseAdminConfig();
  if (!config) return [];

  const response = await fetch(
    `${config.url}/rest/v1/created_content?content_type=eq.${type}&select=id,slug,content,created_at&order=created_at.desc`,
    {
      headers: getSupabaseAdminHeaders(config.serviceRoleKey),
      cache: "no-store",
    },
  );
  if (!response.ok) return [];

  const rows = (await response.json()) as Array<{
    id: string;
    slug: string;
    content: Omit<ManagedCreatedContent, "id" | "slug" | "createdAt">;
    created_at: string;
  }>;
  return rows.map((row) => ({
    ...row.content,
    id: row.id,
    slug: row.slug,
    createdAt: row.created_at,
  }));
}
