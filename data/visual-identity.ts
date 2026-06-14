export const VAIC_PALETTE = [
  { name: "Sin color", hex: "transparent" },
  { name: "Azul VaicMedical", hex: "#213255" },
  { name: "Azul medio", hex: "#34466F" },
  { name: "Azul profundo", hex: "#17243F" },
  { name: "Celeste VaicMedical", hex: "#58C3DE" },
  { name: "Celeste suave", hex: "#EAF8FC" },
  { name: "Celeste muy suave", hex: "#F6FBFD" },
  { name: "Borde celeste", hex: "#D7E9EF" },
  { name: "Blanco", hex: "#FFFFFF" },
] as const;

export type VisualIdentity = {
  allowCustomColors: boolean;
  customColors: Array<{ name: string; hex: string }>;
  fonts: Array<{ name: string; url: string }>;
  primaryFont: string;
  contentWidth: number;
  cornerRadius: number;
  shadowStrength: "none" | "soft" | "medium";
  social: {
    instagram: string;
    linkedin: string;
    facebook: string;
    youtube: string;
    whatsapp: string;
  };
};

export const DEFAULT_VISUAL_IDENTITY: VisualIdentity = {
  allowCustomColors: false,
  customColors: [],
  fonts: [],
  primaryFont: "Geist",
  contentWidth: 1440,
  cornerRadius: 12,
  shadowStrength: "soft",
  social: {
    instagram: "",
    linkedin: "",
    facebook: "",
    youtube: "",
    whatsapp: "",
  },
};

export function normalizeHex(value: string) {
  const trimmed = value.trim().toUpperCase();
  if (/^#[0-9A-F]{6}$/.test(trimmed)) return trimmed;
  return "";
}

