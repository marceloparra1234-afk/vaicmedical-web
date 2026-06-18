"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import type { PreviewContent } from "@/components/admin/ClientPagePreview";
import {
  applyContentToTarget,
  sectionSelectors,
} from "@/components/admin/LiveClientPreview";

const pageKeys: Record<string, string> = {
  "/": "inicio",
  "/nosotros": "nosotros",
  "/servicios": "servicios",
  "/blog": "blog",
  "/catalogo": "catalogo",
  "/contacto": "contacto",
};

export function PublicContentHydrator({
  initialContent = {},
}: {
  initialContent?: Record<string, Record<string, PreviewContent> | null>;
}) {
  const pathname = usePathname();
  const pageKey =
    pageKeys[pathname] ||
    (pathname.startsWith("/catalogo/") ? "catalogo-productos-vista" : "");

  useLayoutEffect(() => {
    const content = pageKey ? initialContent[pageKey] : null;
    if (!pageKey || !content) return;
    applyPageContent(pageKey, content);
  }, [initialContent, pageKey]);

  useEffect(() => {
    if (!pageKey) return;

    let cancelled = false;
    function loadContent() {
      fetch(`/api/site-content?pageKey=${encodeURIComponent(pageKey)}`, {
        cache: "no-store",
      })
        .then(async (response) => (response.ok ? response.json() : null))
        .then((result) => {
          if (cancelled || !result?.content) return;
          applyPageContent(pageKey, result.content as Record<string, PreviewContent>);
        })
        .catch(() => undefined);
    }

    function handleContentUpdated(event: StorageEvent | Event) {
      if (
        event instanceof StorageEvent &&
        event.key === "vaicmedical:content-updated" &&
        !event.newValue?.startsWith(`${pageKey}:`)
      ) {
        return;
      }
      loadContent();
    }

    loadContent();
    window.addEventListener("storage", handleContentUpdated);
    window.addEventListener("vaicmedical:content-updated", handleContentUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", handleContentUpdated);
      window.removeEventListener("vaicmedical:content-updated", handleContentUpdated);
    };
  }, [pageKey]);

  return null;
}

function applyPageContent(pageKey: string, content: Record<string, PreviewContent>) {
  const selectors = sectionSelectors[pageKey] || {};
  Object.entries(content).forEach(([section, sectionContent]) => {
    const selector = selectors[section];
    if (!selector || !sectionContent) return;
    document.querySelectorAll<HTMLElement>(selector).forEach((target) => {
      applyContentToTarget(target, sectionContent);
    });
  });
}
