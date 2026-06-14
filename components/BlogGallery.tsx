"use client";

import Image from "next/image";
import { useState } from "react";

export function BlogGallery({
  title,
  primaryImage,
  secondaryImages,
}: {
  title: string;
  primaryImage: string;
  secondaryImages: Array<{ id?: string; url: string; name?: string }>;
}) {
  const images = [
    primaryImage,
    ...secondaryImages.map((image) => image.url).filter(Boolean),
  ].filter(Boolean);
  const [activeImage, setActiveImage] = useState(images[0] || "/blog-article.svg");

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-[#d7e9ef] bg-[#eaf8fc] shadow-xl shadow-[#213255]/10">
        <Image
          alt={title}
          className="object-cover"
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1150px"
          src={activeImage}
        />
      </div>
      {images.length > 1 && (
        <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
          {images.map((image, index) => (
            <button
              aria-label={`Ver imagen ${index + 1} de ${title}`}
              aria-pressed={activeImage === image}
              className={`relative h-24 overflow-hidden rounded-xl bg-white ${
                activeImage === image
                  ? "border-2 border-[#58c3de]"
                  : "border border-[#d7e9ef]"
              }`}
              key={`${image}-${index}`}
              onClick={() => setActiveImage(image)}
              type="button"
            >
              <Image
                alt={`${title}, imagen ${index + 1}`}
                className="object-cover"
                fill
                sizes="160px"
                src={image}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
