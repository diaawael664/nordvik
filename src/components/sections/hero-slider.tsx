"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HeroSlide } from "@data/home";
import { getProduct } from "@/lib/catalog";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/utils";

const INTERVAL = 7000;

/**
 * Full-width hero slider. Autoplays every 7 s, pauses on hover and focus, and
 * has a visible pause control (WCAG 2.2.2). The first slide is server-rendered
 * and loaded eagerly so it is the page's fast LCP image.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  // The first slide paints immediately (good LCP); text animates only after a change.
  const [changed, setChanged] = useState(false);
  const running = playing && !hovered && slides.length > 1;

  const go = useCallback(
    (to: number) => {
      setChanged(true);
      setIndex((to + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, index, go]);

  const slide = slides[index];
  const product = slide.featuredProduct ? getProduct(slide.featuredProduct) : undefined;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative h-[min(88svh,920px)] min-h-[560px] overflow-hidden bg-inverse text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <AnimatePresence initial={false}>
        <m.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          <m.div
            className="absolute inset-0"
            initial={changed ? { scale: 1.06 } : false}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "linear" }}
          >
            {/* Quality 50: the scrim hides compression, and the hero is the page's largest download. */}
            <Photo name={slide.image} fill priority={index === 0} quality={50} sizes="100vw" className="object-cover" />
          </m.div>
          {/* Scrims keep white text and the overlay header legible on any photo. */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10 md:bg-gradient-to-r md:from-black/65 md:via-black/30 md:to-transparent" />
        </m.div>
      </AnimatePresence>

      <div className="relative mx-auto flex h-full max-w-site flex-col justify-end px-4 pb-28 sm:px-6 md:justify-center md:pb-0 lg:px-10">
        <div
          key={index}
          className="max-w-2xl"
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}`}
        >
          <m.p
            initial={changed ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-5 font-mono text-[11px] tracking-[0.18em] uppercase opacity-85"
          >
            {slide.eyebrow}
          </m.p>
          <m.h1
            initial={changed ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="display-xl"
          >
            {slide.title}
          </m.h1>
          <m.p
            initial={changed ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-6 max-w-md text-base leading-relaxed opacity-90 md:text-lg"
          >
            {slide.text}
          </m.p>
          <m.div
            initial={changed ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <ButtonLink href={slide.cta.href} size="lg" variant="light">
              {slide.cta.label}
            </ButtonLink>
            {slide.secondary && (
              <Link
                href={slide.secondary.href}
                className="text-sm underline decoration-white/50 underline-offset-[6px] hover:decoration-white"
              >
                {slide.secondary.label}
              </Link>
            )}
          </m.div>
        </div>
      </div>

      {/* Bottom bar: "On view" spec caption + slide controls */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-site items-end justify-between gap-6 px-4 pb-6 sm:px-6 md:pb-10 lg:px-10">
          {product && product.dimensions.width > 0 ? (
            <Link
              href={`/product/${product.slug}/`}
              className="group hidden max-w-xs border-l border-white/40 pl-4 text-white md:block"
            >
              <span className="block font-mono text-[10px] tracking-[0.16em] uppercase opacity-70">On view</span>
              <span className="mt-1 block text-sm group-hover:underline">{product.name}</span>
              <span className="mt-1 block font-mono text-[11px] tracking-wider opacity-80">
                W {product.dimensions.width} × D {product.dimensions.depth} × H {product.dimensions.height} cm
              </span>
            </Link>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-4">
            <ol className="flex items-center gap-3" aria-label="Choose slide">
              {slides.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Show slide ${i + 1}: ${s.title}`}
                    aria-current={i === index}
                    className="group flex h-8 items-center"
                  >
                    <span className="relative block h-px w-7 overflow-hidden bg-white/35 sm:w-14">
                      <span
                        key={`${index}-${running}`}
                        className={cn(
                          "absolute inset-y-0 left-0 bg-white",
                          i < index && "w-full",
                          i === index && (running ? "animate-[progress_7s_linear_forwards]" : "w-full"),
                          i > index && "w-0 group-hover:w-2",
                        )}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <span
              className="hidden font-mono text-[11px] tracking-wider whitespace-nowrap tabular-nums sm:inline"
              aria-hidden
            >
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => go(index - 1)}
                className="grid size-9 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-inverse"
                aria-label="Previous slide"
              >
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                className="grid size-9 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-inverse"
                aria-label="Next slide"
              >
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="grid size-9 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-inverse"
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              >
                {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
