"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SitePopup } from "@/components/SitePopup";
import { PublicContentHydrator } from "@/components/PublicContentHydrator";
import {
  DEFAULT_VISUAL_IDENTITY,
  type VisualIdentity,
} from "@/data/visual-identity";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Blog", href: "/blog" },
  { label: "Catálogo", href: "/catalogo" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
        {title}
      </h4>
      <ul className="mt-5 space-y-3 text-sm text-white/70">
        {links.map((link) => (
          <li key={link.label}>
            <Link className="transition hover:text-[#58c3de]" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteShell({
  children,
  visualIdentity = DEFAULT_VISUAL_IDENTITY,
  popupContent,
}: {
  children: React.ReactNode;
  visualIdentity?: VisualIdentity;
  popupContent?: Record<string, unknown> | null;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const socialLinks = Object.entries(visualIdentity.social).filter(([, href]) => href.trim());
  const selectedFont = visualIdentity.fonts.find((font) => font.name === visualIdentity.primaryFont);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f6fbfd] text-[#213255]"
      style={{
        ["--site-content-width" as string]: `${visualIdentity.contentWidth}px`,
        ["--site-radius" as string]: `${visualIdentity.cornerRadius}px`,
        fontFamily: selectedFont ? `"VaicCustom", Arial, sans-serif` : undefined,
      }}
    >
      {selectedFont && (
        <style>{`@font-face{font-family:"VaicCustom";src:url("${selectedFont.url}");font-display:swap;}`}</style>
      )}
      <PublicContentHydrator />
      <header className="sticky top-0 z-20 border-b border-[#d7e9ef] bg-[#f6fbfd]/92 backdrop-blur">
        <nav className="flex items-center justify-between px-6 py-4 sm:px-10 lg:px-14">
          <Link className="block" href="/" aria-label="VaicMedical inicio">
            <Image
              src="/brand/vaicmedical-logo.svg"
              alt="VaicMedical"
              width={240}
              height={43}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <div className="flex items-center gap-7 text-base font-medium text-[#213255]">
              {navItems.map((item) => (
                <Link
                  className="transition hover:text-[#58c3de]"
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              className="rounded-full bg-[#213255] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#34466f]"
              href="/contacto"
            >
              Contacto
            </Link>
          </div>
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="bg-[#213255] text-white">
        <div className="mx-auto grid w-full max-w-[var(--site-content-width)] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:py-14">
          <div>
            <Link className="inline-block" href="/" aria-label="VaicMedical inicio">
              <Image
                src="/brand/vaicmedical-logo-white.svg"
                alt="VaicMedical"
                width={260}
                height={46}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
              Mantención, reparación y soporte técnico para equipos médicos que
              deben mantenerse operativos.
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3 text-white/80">
                {socialLinks.map(([network, href]) => (
                  <a
                    aria-label={network}
                    className="grid h-9 min-w-9 place-items-center rounded-full border border-white/15 px-2 text-[10px] font-bold uppercase transition hover:border-[#58C3DE] hover:text-[#58C3DE]"
                    href={href}
                    key={network}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {network.slice(0, 2)}
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterColumn
            title="Soluciones"
            links={[
              { label: "Catálogo", href: "/catalogo" },
              { label: "Servicios", href: "/servicios" },
              { label: "Mantención", href: "/servicios" },
            ]}
          />

          <FooterColumn
            title="VaicMedical"
            links={[
              { label: "Nosotros", href: "/nosotros" },
              { label: "Blog", href: "/blog" },
              { label: "Contacto", href: "/contacto" },
            ]}
          />

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#58c3de]">
              Contacto
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-white/70">
              <li>contacto@vaicmedical.cl</li>
              <li>Chile y Latinoamérica</li>
              <li>Atención técnica y comercial</li>
            </ul>
            <Link
              href="/contacto"
              className="mt-6 inline-flex rounded-xl bg-[#58c3de] px-5 py-3 text-sm font-bold text-[#213255] transition hover:bg-white"
            >
              Solicitar soporte
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-5 text-xs text-white/45 sm:px-8">
          <div className="mx-auto flex w-full max-w-[var(--site-content-width)] flex-col items-center justify-between gap-4 sm:flex-row">
            <span>2026 VaicMedical. Todos los derechos reservados.</span>
            <Link
              className="rounded-lg border border-white/15 px-4 py-2 font-semibold text-white/65 transition hover:border-[#58c3de] hover:text-[#58c3de]"
              href="/admin"
            >
              Editar página
            </Link>
          </div>
        </div>
      </footer>

      <SitePopup content={popupContent} />
    </div>
  );
}
