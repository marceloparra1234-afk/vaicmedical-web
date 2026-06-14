"use client";

import { useLayoutEffect } from "react";
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
  contentByPage,
}: {
  contentByPage: Record<string, Record<string, PreviewContent> | null>;
}) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const pageKey =
      pageKeys[pathname] ||
      (pathname.startsWith("/catalogo/") ? "catalogo-productos-vista" : "");
    if (!pageKey) return;

    function applyPageContent() {
      const content = contentByPage[pageKey];
      if (!content) return;
      const selectors = sectionSelectors[pageKey] || {};
      Object.entries(content).forEach(([section, sectionContent]) => {
        const selector = selectors[section];
        if (!selector || !sectionContent) return;
        document.querySelectorAll<HTMLElement>(selector).forEach((target) => {
          applyContentToTarget(target, sectionContent);
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
      applyPageContent();
    }

    applyPageContent();
    window.addEventListener("storage", handleContentUpdated);
    window.addEventListener("vaicmedical:content-updated", handleContentUpdated);

    return () => {
      window.removeEventListener("storage", handleContentUpdated);
      window.removeEventListener("vaicmedical:content-updated", handleContentUpdated);
    };
  }, [contentByPage, pathname]);

  return null;
}
