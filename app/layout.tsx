import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import {
  DEFAULT_VISUAL_IDENTITY,
  type VisualIdentity,
} from "@/data/visual-identity";
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
  const stored = await getSiteContentBundle<
    Partial<VisualIdentity> | Record<string, unknown>
  >(["visual-identity", "ventana-emergente"]);
  const storedIdentity = stored["visual-identity"] as Partial<VisualIdentity> | null;
  const popupContent = stored["ventana-emergente"] as Record<string, unknown> | null;
  const visualIdentity: VisualIdentity = storedIdentity
    ? {
        ...DEFAULT_VISUAL_IDENTITY,
        ...storedIdentity,
        social: { ...DEFAULT_VISUAL_IDENTITY.social, ...storedIdentity.social },
      }
    : DEFAULT_VISUAL_IDENTITY;

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteShell popupContent={popupContent} visualIdentity={visualIdentity}>{children}</SiteShell>
      </body>
    </html>
  );
}
