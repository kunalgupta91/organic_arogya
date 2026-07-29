"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ImageGallery({
  images,
  productName,
}: {
  images: { url: string; alt: string | null }[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? { url: "/product-placeholder.svg", alt: productName };

  return (
    <div>
      <div className="bg-muted border-border relative aspect-square overflow-hidden rounded-xl border">
        <Image
          src={active.url}
          alt={active.alt ?? productName}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
                i === activeIndex ? "border-primary-500" : "border-transparent",
              )}
            >
              <Image src={img.url} alt={img.alt ?? productName} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
