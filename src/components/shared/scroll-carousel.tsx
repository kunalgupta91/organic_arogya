"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ScrollCarousel({
  title,
  viewAllHref,
  children,
}: {
  title: string;
  viewAllHref?: string;
  children: ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-primary-900 text-2xl sm:text-3xl">{title}</h2>
        <div className="flex items-center gap-4">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-primary-600 hidden text-sm font-medium hover:underline sm:inline"
            >
              View all
            </Link>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="border-border text-foreground hover:bg-muted flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="border-border text-foreground hover:bg-muted flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div ref={scrollerRef} className="scrollbar-none mt-8 flex gap-5 overflow-x-auto scroll-smooth pb-2">
        {children}
      </div>
    </div>
  );
}
