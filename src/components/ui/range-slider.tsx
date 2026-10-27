"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

type RangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  /** Called when the user releases a handle (not on every pixel of drag). */
  onCommit: (value: [number, number]) => void;
  label: string;
};

const thumb =
  "pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent outline-none " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-bg " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-bg " +
  "focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-webkit-slider-thumb]:outline-accent";

/** Two-handle price slider built from two native range inputs (keyboard and screen-reader friendly). */
export function RangeSlider({ min, max, step = 50, value, onCommit, label }: RangeSliderProps) {
  const [draft, setDraft] = useState(value);
  const [synced, setSynced] = useState(value);
  // Follow external changes (e.g. "Clear all") without an effect.
  if (synced[0] !== value[0] || synced[1] !== value[1]) {
    setSynced(value);
    setDraft(value);
  }

  const [lo, hi] = draft;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const commit = () => onCommit(draft);

  return (
    <div role="group" aria-label={label}>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-ink"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label="Minimum price"
          aria-valuetext={formatPrice(lo)}
          onChange={(e) => setDraft([Math.min(Number(e.target.value), hi - step), hi])}
          onPointerUp={commit}
          onKeyUp={commit}
          className={thumb}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label="Maximum price"
          aria-valuetext={formatPrice(hi)}
          onChange={(e) => setDraft([lo, Math.max(Number(e.target.value), lo + step)])}
          onPointerUp={commit}
          onKeyUp={commit}
          className={thumb}
        />
      </div>
      <div className="mt-3 flex justify-between font-mono text-xs text-muted">
        <span>{formatPrice(lo)}</span>
        <span>{formatPrice(hi)}</span>
      </div>
    </div>
  );
}
