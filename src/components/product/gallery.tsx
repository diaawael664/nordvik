"use client";

import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { useState, type MouseEvent } from "react";
import type { ImageRef } from "@data/images";
import { Modal } from "@/components/ui/modal";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/utils";

const arrow = "pointer-events-auto grid size-10 place-items-center rounded-full bg-bg/85 backdrop-blur";

type GalleryProps = {
  images: ImageRef[];
  productName: string;
  active: number;
  onChange: (index: number) => void;
  /** "side" or "bottom" thumbnails, or "stacked" (every image large, desktop only). */
  layout?: "side" | "bottom" | "stacked";
};

/**
 * Product gallery: thumbnails, hover-to-zoom on desktop (the image follows the
 * pointer at 2×), and a full-screen lightbox on click.
 */
export function Gallery({ images, productName, active, onChange, layout = "side" }: GalleryProps) {
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const count = images.length;
  const go = (d: number) => onChange((active + d + count) % count);

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className={cn("flex flex-col-reverse gap-3", layout === "side" && "md:flex-row md:gap-4")}>
      {/* Stacked: all images in a column on desktop; each opens the lightbox. */}
      {layout === "stacked" && (
        <ul className="hidden flex-col gap-4 lg:flex" aria-label="Product images">
          {images.map((img, i) => (
            <li key={img}>
              <button
                type="button"
                onClick={() => {
                  onChange(i);
                  setLightbox(true);
                }}
                aria-label={`Open ${productName} image ${i + 1} full screen`}
                className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-sand"
              >
                <Photo
                  name={img}
                  alt={img.startsWith("https://") ? `${productName}, image ${i + 1}` : undefined}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
      {count > 1 && (
        <ul
          className={cn(
            "flex gap-2 overflow-x-auto",
            layout === "side" && "md:w-20 md:shrink-0 md:flex-col md:gap-3",
            layout === "stacked" && "lg:hidden",
          )}
          aria-label="Product images"
        >
          {images.map((img, i) => (
            <li key={img} className="shrink-0">
              <button
                type="button"
                onClick={() => onChange(i)}
                aria-label={`Show image ${i + 1} of ${count}`}
                aria-current={i === active}
                className={cn(
                  "relative block aspect-[4/5] w-16 overflow-hidden bg-sand transition md:w-full",
                  i === active ? "ring-1 ring-ink ring-offset-2 ring-offset-bg" : "opacity-60 hover:opacity-100",
                )}
              >
                <Photo name={img} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={cn("relative flex-1", layout === "stacked" && "lg:hidden")}>
        <button
          type="button"
          onClick={() => setLightbox(true)}
          onMouseMove={onMove}
          onMouseLeave={() => setZoom(null)}
          aria-label={`Open ${productName} image ${active + 1} full screen`}
          className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-sand"
        >
          <Photo
            name={images[active]}
            alt={images[active].startsWith("https://") ? `${productName}, image ${active + 1}` : undefined}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out"
            style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
          <span className="absolute right-4 bottom-4 grid size-10 place-items-center rounded-full bg-bg/85 backdrop-blur transition-opacity group-hover:opacity-0">
            <Expand className="size-4" strokeWidth={1.5} />
          </span>
        </button>
        {count > 1 && (
          <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between md:hidden">
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={arrow}>
              <ArrowLeft className="size-4" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className={arrow}>
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      <Modal
        open={lightbox}
        onClose={() => setLightbox(false)}
        label={`${productName} images`}
        className="max-w-6xl bg-sand"
      >
        <div className="relative aspect-[4/5] max-h-[88dvh] w-full sm:aspect-[4/3]">
          <Photo name={images[active]} fill sizes="90vw" className="object-contain" />
        </div>
        {count > 1 && (
          <div className="flex items-center justify-between border-t border-line bg-bg px-4 py-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex items-center gap-2 text-sm"
              aria-label="Previous image"
            >
              <ArrowLeft className="size-4" /> Prev
            </button>
            <span className="font-mono text-xs text-muted">
              {active + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex items-center gap-2 text-sm"
              aria-label="Next image"
            >
              Next <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
