"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Highlight = {
  slug: string;
  name: string;
  lineName: string;
  description: string;
  image: string;
  href: string;
};

export function HomeCatalogCarousel({ products }: { products: Highlight[] }) {
  const [index, setIndex] = useState(0);
  const visibleProducts = useMemo(() => {
    if (products.length === 0) return [];
    const visibleCount = Math.min(3, products.length);
    return Array.from({ length: visibleCount }, (_, offset) => products[(index + offset) % products.length]);
  }, [index, products]);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % products.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [products.length]);

  if (!products.length) {
    return (
      <p className="border border-[#d7e9ef] bg-[#f6fbfd] p-7 text-[#34466f] lg:col-span-3">
        Próximamente encontrarás nuestros productos.
      </p>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {visibleProducts.map((product, offset) => (
        <Link
          className="group overflow-hidden rounded-3xl border border-[#d7e9ef] bg-[#f6fbfd] transition hover:-translate-y-1 hover:border-[#58c3de] hover:bg-white hover:shadow-lg"
          href={product.href}
          key={`${product.slug}-${index}-${offset}`}
        >
          <div className="relative aspect-square border-b border-[#d7e9ef] bg-[#eaf8fc]">
            <Image
              alt={product.name}
              className="object-contain p-7 transition duration-300 group-hover:scale-105"
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              src={product.image}
              unoptimized={product.image.startsWith("data:")}
            />
          </div>
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58c3de]">
              {product.lineName}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[#213255]">
              {product.name}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#34466f]">
              {product.description}
            </p>
            <p className="mt-4 text-sm font-semibold text-[#58c3de]">
              Ver producto
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
