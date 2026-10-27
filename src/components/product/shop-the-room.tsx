"use client";

import { AnimatePresence, m } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Collection } from "@data/collections";
import { getProduct } from "@/lib/catalog";
import { Photo } from "@/components/ui/photo";
import { Price } from "@/components/ui/primitives";
import { useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import { cn, formatPrice } from "@/lib/utils";
import { defaultSelection } from "./product-card";

type ShopTheRoomProps = {
  collection: Collection;
  /** Show the numbered product list next to/below the image. */
  showList?: boolean;
  priority?: boolean;
  sizes?: string;
  /** Heading level for the collection title, to fit the page's outline. */
  headingLevel?: "h2" | "h3";
};

/**
 * A room photo with clickable hotspots. Each marker opens a small product
 * card; the numbered list repeats the same products for touch and screen
 * reader users.
 */
export function ShopTheRoom({
  collection,
  showList = true,
  priority,
  sizes = "(min-width: 1024px) 66vw, 100vw",
  headingLevel: Heading = "h3",
}: ShopTheRoomProps) {
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { add } = useCart();
  const { open: openPanel, notify } = useUI();
  const spots = collection.hotspots.flatMap((h) => {
    const product = getProduct(h.product);
    return product ? [{ ...h, product }] : [];
  });

  // Close on Escape or a click outside the image.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const addToCart = (i: number) => {
    const p = spots[i].product;
    add({ productId: p.id, ...defaultSelection(p) });
    notify(`Added ${p.name} to your cart`);
    setOpen(null);
    openPanel("cart");
  };

  return (
    <div className={cn(showList && "grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:gap-12")}>
      <div ref={rootRef} className="relative bg-sand" style={{ aspectRatio: collection.ratio }}>
        <Photo name={collection.image} fill priority={priority} sizes={sizes} className="object-cover" />
        {spots.map((s, i) => {
          const isOpen = open === i;
          const flip = s.x > 60; // open the card to the left near the right edge
          const below = s.y < 35;
          return (
            <div key={`${s.product.id}-${i}`} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(isOpen ? null : i);
                }}
                aria-expanded={isOpen}
                aria-label={`${i + 1}. ${s.product.name}`}
                className={cn(
                  "relative grid size-9 -translate-1/2 place-items-center rounded-full bg-white text-inverse shadow-lg transition-transform hover:scale-110",
                  !isOpen &&
                    "motion-safe:after:absolute motion-safe:after:inset-0 motion-safe:after:animate-ping motion-safe:after:rounded-full motion-safe:after:bg-white/60",
                )}
              >
                <Plus
                  className={cn("relative z-10 size-4 transition-transform", isOpen && "rotate-45")}
                  strokeWidth={2}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <m.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "absolute z-20 w-60 bg-bg p-3 text-ink shadow-xl sm:w-64",
                      flip ? "right-6" : "left-6",
                      below ? "top-2" : "bottom-2",
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link href={`/product/${s.product.slug}/`} className="group flex gap-3">
                      <span className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-sand">
                        <Photo name={s.product.images[0]} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium group-hover:underline">{s.product.name}</span>
                        <Price price={s.product.price} compareAt={s.product.compareAt} size="sm" className="mt-1" />
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => addToCart(i)}
                      disabled={s.product.stock === 0}
                      className="mt-3 h-9 w-full bg-ink text-xs font-medium text-bg transition-colors hover:bg-accent hover:text-on-accent disabled:opacity-50"
                    >
                      {s.product.stock === 0 ? "Sold out" : "Add to cart"}
                    </button>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {showList && (
        <div>
          <p className="eyebrow mb-3">{collection.eyebrow}</p>
          <Heading className="display-md">{collection.title}</Heading>
          <p className="mt-4 leading-relaxed text-muted">{collection.description}</p>
          <ol className="mt-8 divide-y divide-line border-y border-line">
            {spots.map((s, i) => (
              <li key={`${s.product.id}-${i}`}>
                <Link
                  href={`/product/${s.product.slug}/`}
                  onMouseEnter={() => setOpen(i)}
                  className="group flex items-center gap-4 py-3"
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] transition-colors",
                      open === i ? "border-ink bg-ink text-bg" : "border-line",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm group-hover:underline">{s.product.name}</span>
                  <Price price={s.product.price} compareAt={s.product.compareAt} size="sm" />
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">
            Complete look:{" "}
            <span className="font-mono text-ink">
              {formatPrice(
                [...new Map(spots.map((s) => [s.product.id, s.product])).values()].reduce((sum, p) => sum + p.price, 0),
              )}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
