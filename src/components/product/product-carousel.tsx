"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "./product-card";

type ProductCarouselProps = {
  products: Product[];
  /** Accessible name, e.g. "Best sellers". */
  label: string;
};

/**
 * Horizontally scrolling product row: native scroll-snap (touch, trackpad and
 * keyboard friendly) plus previous/next buttons on larger screens.
 */
export function ProductCarousel({ products, label }: ProductCarouselProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const card = row.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : row.clientWidth * 0.8;
    row.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section aria-label={label} className="relative">
      <div
        ref={rowRef}
        tabIndex={0}
        aria-label={`${label}, scrollable`}
        className="snap-row -mx-4 auto-cols-[72%] gap-4 px-4 pb-2 outline-offset-4 sm:-mx-6 sm:auto-cols-[42%] sm:gap-6 sm:px-6 lg:mx-0 lg:auto-cols-[calc((100%-4.5rem)/4)] lg:px-0"
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 42vw, 72vw" />
        ))}
      </div>
      <div className="mt-8 hidden justify-end gap-2 lg:flex">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-ink"
          aria-label={`Previous ${label}`}
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-ink"
          aria-label={`Next ${label}`}
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
