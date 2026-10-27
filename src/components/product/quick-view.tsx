"use client";

import Link from "next/link";
import { useState } from "react";
import { getProduct, type Product } from "@/lib/catalog";
import { Dimension } from "@/components/ui/dimension";
import { Modal } from "@/components/ui/modal";
import { Photo } from "@/components/ui/photo";
import { useUI } from "@/context/ui-context";
import { cn } from "@/lib/utils";
import { PurchasePanel, useProductSelection } from "./purchase-panel";

/** Quick-view dialog, opened from any product card via `setQuickView(slug)`. */
export function QuickView() {
  const { quickView, setQuickView } = useUI();
  const product = quickView ? getProduct(quickView) : undefined;
  const close = () => setQuickView(null);

  return (
    <Modal open={Boolean(product)} onClose={close} label={product ? `Quick view: ${product.name}` : "Quick view"}>
      {/* Keyed so selections reset when another product is opened. */}
      {product && <QuickViewBody key={product.id} product={product} onClose={close} />}
    </Modal>
  );
}

function QuickViewBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const selection = useProductSelection(product);
  const [active, setActive] = useState(0);

  return (
    <div className="grid md:grid-cols-2">
      <div className="bg-sand">
        <div className="relative aspect-[4/5]">
          <Photo name={product.images[active]} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          {product.dimensions.width > 0 && (
            <Dimension label={`W ${product.dimensions.width} cm`} className="absolute inset-x-6 bottom-6" />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 p-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${product.images.length}`}
                aria-current={i === active}
                className={cn(
                  "relative size-16 overflow-hidden ring-offset-2 ring-offset-sand transition",
                  i === active ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100",
                )}
              >
                <Photo name={img} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6 p-6 sm:p-10">
        <div>
          <p className="eyebrow mb-3">{product.designer}</p>
          <h2 className="display-md">{product.name}</h2>
          <p className="mt-4 leading-relaxed text-muted">{product.summary}</p>
        </div>
        <PurchasePanel product={product} selection={selection} onAdded={onClose} />
        <Link href={`/product/${product.slug}/`} onClick={onClose} className="text-sm underline underline-offset-4">
          View full details
        </Link>
      </div>
    </div>
  );
}
