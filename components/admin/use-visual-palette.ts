"use client";

import { useEffect, useState } from "react";
import { VAIC_PALETTE, type VisualIdentity } from "@/data/visual-identity";

type PaletteOption = { name: string; hex: string };

let palettePromise: Promise<PaletteOption[]> | null = null;

function loadPalette() {
  palettePromise ??= fetch("/api/admin/content?pageKey=visual-identity")
    .then(async (response) => (response.ok ? response.json() : null))
    .then((result) => {
      const identity = result?.content as Partial<VisualIdentity> | undefined;
      return identity?.allowCustomColors
        ? [...VAIC_PALETTE, ...(identity.customColors ?? [])]
        : [...VAIC_PALETTE];
    })
    .catch(() => [...VAIC_PALETTE]);
  return palettePromise;
}

export function useVisualPalette() {
  const [palette, setPalette] = useState<PaletteOption[]>([...VAIC_PALETTE]);

  useEffect(() => {
    void loadPalette().then(setPalette);
  }, []);

  return palette;
}

