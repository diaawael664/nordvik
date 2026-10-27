"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { Dimension } from "@/components/ui/dimension";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/utils";

const toInches = (cm: number) => (cm / 2.54).toFixed(1).replace(/\.0$/, "");

/**
 * The product's measurements drawn on its photo (the template's signature
 * dimension lines) next to a table, with a cm / inch toggle.
 */
export function SpecSheet({ product }: { product: Product }) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const d = product.dimensions;
  const fmt = (cm: number) => (unit === "cm" ? `${cm} cm` : `${toInches(cm)} in`);

  const rows: [string, string][] = [
    ["Width", fmt(d.width)],
    ["Depth", fmt(d.depth)],
    ["Height", fmt(d.height)],
    ...(d.seatHeight ? ([["Seat height", fmt(d.seatHeight)]] as [string, string][]) : []),
    ["Weight", unit === "cm" ? `${product.weightKg} kg` : `${Math.round(product.weightKg * 2.205)} lb`],
  ];

  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-16">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Photo name={product.images[0]} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        <Dimension label={`W ${fmt(d.width)}`} className="absolute inset-x-8 bottom-6" />
        <Dimension axis="y" label={`H ${fmt(d.height)}`} className="absolute top-8 right-6 bottom-14" />
      </div>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-2xl">Dimensions</h3>
          <div className="flex border border-line font-mono text-xs" role="group" aria-label="Units">
            {(["cm", "in"] as const).map((u) => (
              <button
                key={u}
                type="button"
                aria-pressed={unit === u}
                onClick={() => setUnit(u)}
                className={cn("h-8 px-3 uppercase transition-colors", unit === u ? "bg-ink text-bg" : "hover:bg-sand")}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <caption className="sr-only">
            {product.name} dimensions in {unit === "cm" ? "centimeters" : "inches"}
          </caption>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-b border-line">
                <th scope="row" className="py-3.5 text-left font-normal text-muted">
                  {label}
                </th>
                <td className="py-3.5 text-right font-mono tabular-nums">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          Measure doorways, stairwells and lifts before ordering. Our team can advise on access by email.
        </p>
      </div>
    </div>
  );
}
