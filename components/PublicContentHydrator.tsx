"use client";

import { useEffect } from "react";
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

export function PublicContentHydrator() {
  const pathname = usePathname();

  useEffect(() => {
    const pageKey =
      pageKeys[pathname] ||
      (pathname.startsWith("/catalogo/") ? "catalogo-productos-vista" : "");
    if (!pageKey) return;

    let cancelled = false;
    function loadContent() {
      fetch(`/api/site-content?pageKey=${encodeURIComponent(pageKey)}`, {
        cache: "no-store",
      })
        .then(async (response) => (response.ok ? response.json() : null))
        .then((result) => {
          if (cancelled || !result?.content) return;
          const selectors = sectionSelectors[pageKey] || {};
          Object.entries(result.content as Record<string, PreviewContent>).forEach(
            ([section, content]) => {
              const selector = selectors[section];
              if (!selector || !content) return;
              document.querySelectorAll<HTMLElement>(selector).forEach((target) => {
                applyContentToTarget(target, content);
              });
            },
          );
          if (pageKey === "inicio") void loadHomeLinkedSections();
        })
        .catch(() => undefined);
    }

    async function loadHomeLinkedSections() {
      const links = [
        ["nosotros", "Hero principal", "[data-editor-section='nosotros']"],
        ["servicios", "Hero principal", "[data-editor-section='servicios']"],
        ["blog", "Hero principal", "[data-editor-section='blog']"],
        ["catalogo", "Hero principal", "[data-editor-section='catalogo']"],
      ] as const;
      const results = await Promise.all(
        links.map(async ([linkedPage]) => {
          const response = await fetch(
            `/api/site-content?pageKey=${encodeURIComponent(linkedPage)}`,
            { cache: "no-store" },
          );
          return response.ok ? response.json() : null;
        }),
      );
      results.forEach((result, index) => {
        const [, section, selector] = links[index];
        const linkedContent = result?.content?.[section] as PreviewContent | undefined;
        if (!linkedContent) return;
        document.querySelectorAll<HTMLElement>(selector).forEach((target) => {
          applyContentToTarget(target, linkedContent);
        });
      });
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
  }, [pathname]);

  return null;
}
