"use client";

import Image from "next/image";
import { MouseEvent, useState } from "react";

type ProductGalleryProps = {
  name: string;
  primaryImage: string;
  gallery: string[];
};

export function ProductGallery({
  name,
  primaryImage,
  gallery,
}: ProductGalleryProps) {
  const media = [primaryImage, ...gallery].filter(Boolean);
  const [activeImage, setActiveImage] = useState(media[0] || "");
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const currentImage = media.includes(activeImage) ? activeImage : media[0] || "";
  const activeIsVideo = isVideo(currentImage);

  if (!currentImage) return null;

  return (
    <div>
      <div
        className="relative min-h-[420px] overflow-hidden rounded-[28px] border border-[#d7e9ef] bg-white sm:min-h-[560px]"
        onMouseLeave={() => setZoom((current) => ({ ...current, active: false }))}
        onMouseMove={(event) => {
          if (activeIsVideo) return;
          setZoom(getZoomPosition(event));
        }}
      >
        {activeIsVideo ? (
          <video className="h-full min-h-[420px] w-full object-contain sm:min-h-[560px]" controls src={currentImage} />
        ) : (
          <>
            <Image alt={name} className="object-contain p-8 sm:p-14" fill priority sizes="(max-width: 1280px) 100vw, 65vw" src={currentImage} />
            {zoom.active && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute h-44 w-44 rounded-full border-4 border-white shadow-2xl ring-1 ring-[#58c3de]"
                style={{
                  backgroundImage: `url("${currentImage}")`,
                  backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "220%",
                  left: `calc(${zoom.x}% - 88px)`,
                  top: `calc(${zoom.y}% - 88px)`,
                }}
              />
            )}
          </>
        )}
      </div>

      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3.5">
        {media.map((image, index) => {
          const isActive = currentImage === image;

          return (
            <button
              aria-label={`Ver imagen ${index + 1} de ${name}`}
              aria-pressed={isActive}
              className={`relative h-[92px] overflow-hidden rounded-2xl bg-white transition ${
                isActive
                  ? "border-2 border-[#58c3de] shadow-sm"
                  : "border border-[#d7e9ef] hover:border-[#58c3de]"
              }`}
              key={`${image}-${index}`}
              onClick={() => setActiveImage(image)}
              type="button"
            >
              {isVideo(image) ? <span className="grid h-full place-items-center text-xs font-bold text-[#213255]">Video {index + 1}</span> : <Image alt={`${name}, vista ${index + 1}`} className="object-contain p-2" fill sizes="150px" src={image} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getZoomPosition(event: MouseEvent<HTMLDivElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
  const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
  return { active: true, x, y };
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}
