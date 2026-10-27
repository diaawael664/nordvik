"use client";

import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@data/site";

/** Rotating messages from `site.announcements`. Pauses while hovered or focused. */
export function AnnouncementBar() {
  const messages = site.announcements;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || messages.length < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 5000);
    return () => window.clearInterval(t);
  }, [paused, messages.length]);

  if (messages.length === 0) return null;
  const go = (d: number) => setIndex((i) => (i + d + messages.length) % messages.length);

  return (
    <div
      className="bg-inverse text-on-inverse"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto flex h-9 max-w-site items-center justify-between px-2 sm:px-6">
        <button
          type="button"
          onClick={() => go(-1)}
          className="grid size-8 place-items-center opacity-70 hover:opacity-100"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <div className="relative h-full flex-1 overflow-hidden" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={index}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 grid place-items-center truncate px-2 text-center text-xs tracking-wide"
            >
              {messages[index]}
            </m.p>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="grid size-8 place-items-center opacity-70 hover:opacity-100"
          aria-label="Next announcement"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
