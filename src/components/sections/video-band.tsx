"use client";

import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ImageKey } from "@data/images";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { useHydrated } from "@/lib/use-hydrated";
import { imageMode } from "@/lib/utils";

type VideoBandProps = {
  eyebrow: string;
  title: string;
  text: string;
  /** MP4 URL. Empty = poster image only. */
  src: string;
  poster: ImageKey;
  cta?: { label: string; href: string };
};

/**
 * Full-bleed background video with a text overlay.
 * - The file only starts downloading when the section scrolls into view.
 * - It pauses off-screen, and never autoplays for reduced-motion visitors.
 * - A visible pause button meets WCAG 2.2.2 (pause, stop, hide).
 */
export function VideoBand({ eyebrow, title, text, src, poster, cta }: VideoBandProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // The OS setting is unknown during the static render, so only apply it after
  // hydration; otherwise server and client markup would differ.
  const hydrated = useHydrated();
  const prefersReduced = useReducedMotion();
  const reduceMotion = hydrated && prefersReduced;
  const [inView, setInView] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const hasVideo = Boolean(src) && imageMode() !== "placeholder";
  const playing = hasVideo && inView && !userPaused && !reduceMotion;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !hasVideo) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [hasVideo]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  return (
    <section ref={sectionRef} aria-label={eyebrow} className="relative isolate overflow-hidden bg-inverse text-white">
      <Photo name={poster} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      {hasVideo && (inView || ready) && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 -z-10 size-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-black/45" />

      <div className="mx-auto flex min-h-[78svh] max-w-site flex-col justify-end px-4 py-16 sm:px-6 md:min-h-[86svh] md:py-24 lg:px-10">
        <p className="mb-5 font-mono text-[11px] tracking-[0.18em] uppercase opacity-85">{eyebrow}</p>
        <h2 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-tight">
          {title}
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <p className="max-w-sm text-lg opacity-90">{text}</p>
            {cta && (
              <ButtonLink href={cta.href} variant="light" size="lg">
                {cta.label}
              </ButtonLink>
            )}
          </div>
          {hasVideo && hydrated && !reduceMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs tracking-wide transition-colors hover:bg-white hover:text-inverse"
              aria-label={userPaused ? "Play background video" : "Pause background video"}
            >
              {userPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              {userPaused ? "Play" : "Pause"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
