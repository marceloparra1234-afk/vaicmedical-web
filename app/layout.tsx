import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import {
  DEFAULT_VISUAL_IDENTITY,
  type VisualIdentity,
} from "@/data/visual-identity";
import type { PreviewContent } from "@/components/admin/ClientPagePreview";
import { getSiteContentBundle } from "@/lib/supabase-admin";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VaicMedical | Mantención y reparación de equipos médicos",
  description:
    "VaicMedical realiza mantención, reparación y soporte técnico para equipos médicos en instituciones de salud.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publicContentKeys = [
    "inicio",
    "nosotros",
    "servicios",
    "blog",
    "catalogo",
    "contacto",
    "catalogo-productos-vista",
  ];
  const stored = await getSiteContentBundle<
    Partial<VisualIdentity> | Record<string, unknown>
  >(["visual-identity", "ventana-emergente", ...publicContentKeys]);
  const storedIdentity = stored["visual-identity"] as Partial<VisualIdentity> | null;
  const popupContent = stored["ventana-emergente"] as Record<string, unknown> | null;
  const visualIdentity: VisualIdentity = storedIdentity
    ? {
        ...DEFAULT_VISUAL_IDENTITY,
        ...storedIdentity,
        fonts: mergeFonts(DEFAULT_VISUAL_IDENTITY.fonts, storedIdentity.fonts),
        social: { ...DEFAULT_VISUAL_IDENTITY.social, ...storedIdentity.social },
      }
    : DEFAULT_VISUAL_IDENTITY;
  const initialPublicContent = Object.fromEntries(
    publicContentKeys.map((key) => [
      key,
      stored[key] as Record<string, PreviewContent> | null,
    ]),
  );

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteShell
          initialPublicContent={initialPublicContent}
          popupContent={popupContent}
          visualIdentity={visualIdentity}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}

function mergeFonts(
  defaults: VisualIdentity["fonts"],
  stored: VisualIdentity["fonts"] | undefined,
) {
  const fonts = [...defaults];
  for (const font of stored || []) {
    if (!fonts.some((item) => item.url === font.url || item.name === font.name)) {
      fonts.push(font);
    }
  }
  return fonts;
}
