"use client";

import { Minus, Plus } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";
import type { ProductColor } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/* ── Quantity stepper ────────────────────────────────────────────────────── */

type QuantityProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Quantity",
}: QuantityProps) {
  const h = size === "sm" ? "h-9" : "h-12";
  const btn = cn(
    "grid place-items-center transition-colors hover:bg-sand disabled:opacity-40",
    size === "sm" ? "w-8" : "w-11",
  );
  return (
    <div className={cn("inline-flex items-stretch border border-line", h)} role="group" aria-label={label}>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, Math.round(n))));
        }}
        className="w-10 [appearance:textfield] bg-transparent text-center text-sm tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

/* ── Color swatches (radio group) ───────────────────────────────────────── */

type SwatchGroupProps = {
  colors: ProductColor[];
  value?: string;
  onChange?: (name: string) => void;
  size?: "sm" | "md";
  legend?: string;
};

/** Selectable color swatches. Without `onChange` they render as a static preview. */
export function SwatchGroup({ colors, value, onChange, size = "md", legend = "Color" }: SwatchGroupProps) {
  const name = useId();
  const dot = size === "sm" ? "size-3.5" : "size-8";

  if (!onChange) {
    return (
      <ul className="flex items-center gap-1.5" aria-label={`${colors.length} colors`}>
        {colors.map((c) => (
          <li
            key={c.name}
            title={c.name}
            className={cn(dot, "rounded-full ring-1 ring-ink/15")}
            style={{ background: c.hex }}
          />
        ))}
      </ul>
    );
  }

  return (
    <fieldset>
      <legend className="mb-3 text-sm">
        {legend}: <span className="text-muted">{value}</span>
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((c) => (
          <label key={c.name} className="relative cursor-pointer" title={c.name}>
            <input
              type="radio"
              name={name}
              value={c.name}
              checked={value === c.name}
              onChange={() => onChange(c.name)}
              className="peer sr-only"
            />
            <span
              className={cn(
                dot,
                "block rounded-full ring-1 ring-ink/15 ring-offset-2 ring-offset-bg transition-shadow peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent",
              )}
              style={{ background: c.hex }}
            />
            <span className="sr-only">{c.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ── Option pills (size, configuration…) ─────────────────────────────────── */

type OptionGroupProps = {
  legend: string;
  options: { label: string; note?: string }[];
  value?: string;
  onChange: (label: string) => void;
};

export function OptionGroup({ legend, options, value, onChange }: OptionGroupProps) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-3 text-sm">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.label} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.label}
              checked={value === o.label}
              onChange={() => onChange(o.label)}
              className="peer sr-only"
            />
            <span className="flex h-11 items-center gap-2 border border-line px-4 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-ink">
              {o.label}
              {o.note && <span className="font-mono text-[10px] opacity-70">{o.note}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ── Form fields ─────────────────────────────────────────────────────────── */

type FieldProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: ReactNode;
};

/** Labelled text input with error message wired to aria-describedby. */
export function Field({ label, error, hint, id, className, ...props }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-2 block text-sm">
        {label}
        {props.required && (
          <span className="text-muted" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? msgId : undefined}
        className={cn(
          "h-12 w-full rounded-base border bg-surface px-4 text-sm transition-colors outline-none placeholder:text-muted/70 focus:border-ink",
          error ? "border-wood" : "border-line",
        )}
        {...props}
      />
      {(error || hint) && (
        <p id={msgId} className={cn("mt-2 text-xs", error ? "text-wood" : "text-muted")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
