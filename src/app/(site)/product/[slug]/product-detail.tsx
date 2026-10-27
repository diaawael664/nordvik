"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getCategory } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { site } from "@data/site";
import { Gallery } from "@/components/product/gallery";
import { CompleteTheLook } from "@/components/product/product-extras";
import { PurchasePanel, useProductSelection } from "@/components/product/purchase-panel";
import { Reviews } from "@/components/product/reviews";
import { SpecSheet } from "@/components/product/spec-sheet";
import { Photo } from "@/components/ui/photo";
import { Tabs } from "@/components/ui/tabs";
import { useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import { track } from "@/lib/analytics";
import { useLayoutSettings } from "@/lib/layout-settings";
import { addRecentlyViewed } from "@/lib/stores";
import { formatPrice } from "@/lib/utils";

/** Interactive part of the product page: gallery, options, tabs and the mobile sticky bar. */
export function ProductDetail({ product }: { product: Product }) {
  const selection = useProductSelection(product);
  const settings = useLayoutSettings();
  const [imageIndex, setImageIndex] = useState(0);
  const purchaseRef = useRef<HTMLDivElement>(null);
  const [purchaseVisible, setPurchaseVisible] = useState(true);

  // Colorways with their own photo put it first in the gallery.
  const colorImage = product.colors.find((c) => c.name === selection.color)?.image;
  const images = colorImage ? [colorImage, ...product.images.filter((i) => i !== colorImage)] : product.images;

  const setColor = (name: string) => {
    selection.setColor(name);
    if (product.colors.find((c) => c.name === name)?.image) setImageIndex(0);
  };

  // Remember the visit and report the product view.
  useEffect(() => {
    addRecentlyViewed(product.id);
    track("view_item", { value: product.price, items: [{ product }] });
  }, [product]);

  useEffect(() => {
    const el = purchaseRef.current;
    if (!el) return;
    // Hidden = scrolled past it (above the viewport), not "not reached yet".
    const io = new IntersectionObserver(([entry]) =>
      setPurchaseVisible(entry.isIntersecting || entry.boundingClientRect.top > 0),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
        <Gallery
          images={images}
          productName={product.name}
          active={imageIndex}
          onChange={setImageIndex}
          layout={settings.productGallery}
        />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-4">
            {getCategory(product.category)?.name} · Designed by {product.designer}
          </p>
          <h1 className="display-lg">{product.name}</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">{product.summary}</p>
          <div ref={purchaseRef} className="mt-9">
            <PurchasePanel product={product} selection={{ ...selection, setColor }} extras />
          </div>
          <dl className="mt-10 grid grid-cols-3 border-t border-line pt-6 text-xs">
            <div>
              <dt className="text-muted">SKU</dt>
              <dd className="mt-1 font-mono">{product.sku}</dd>
            </div>
            <div>
              <dt className="text-muted">Materials</dt>
              <dd className="mt-1">{product.materials.join(", ")}</dd>
            </div>
            {product.dimensions.width > 0 && (
              <div>
                <dt className="text-muted">Dimensions</dt>
                <dd className="mt-1 font-mono">
                  {product.dimensions.width}×{product.dimensions.depth}×{product.dimensions.height} cm
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <Tabs
        className="mt-20 md:mt-28"
        tabs={[
          {
            id: "description",
            label: "Description",
            content: (
              <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                <p className="text-lg leading-relaxed">{product.description}</p>
                <ul className="space-y-3 text-sm">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-3 border-b border-line pb-3">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          },
          { id: "dimensions", label: "Dimensions", content: <SpecSheet product={product} /> },
          {
            id: "care",
            label: "Materials & care",
            content: (
              <div className="grid gap-8 md:grid-cols-2 md:gap-16">
                <div>
                  <h3 className="font-display text-2xl">Materials</h3>
                  <p className="mt-3 leading-relaxed text-muted">{product.materials.join(", ")}.</p>
                </div>
                <div>
                  <h3 className="font-display text-2xl">Care</h3>
                  <p className="mt-3 leading-relaxed text-muted">{product.care}</p>
                </div>
              </div>
            ),
          },
          {
            id: "shipping",
            label: "Shipping & returns",
            content: (
              <div className="grid gap-8 md:grid-cols-3">
                {site.shippingInfo.map((s) => (
                  <div key={s.title}>
                    <h3 className="font-display text-xl">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
                  </div>
                ))}
              </div>
            ),
          },
          { id: "reviews", label: `Reviews (${product.reviewCount})`, content: <Reviews product={product} /> },
        ].filter((t) =>
          t.id === "dimensions" ? product.dimensions.width > 0 : t.id === "care" ? Boolean(product.care) : true,
        )}
      />

      <CompleteTheLook product={product} />

      <StickyBar product={product} visible={!purchaseVisible} selection={selection} image={images[0]} />
    </>
  );
}

/** Mobile/tablet bar that appears once the main add-to-cart button scrolls away. */
function StickyBar({
  product,
  visible,
  selection,
  image,
}: {
  product: Product;
  visible: boolean;
  selection: ReturnType<typeof useProductSelection>;
  image: Product["images"][number];
}) {
  const { add } = useCart();
  const { open, notify } = useUI();
  const soldOut = product.stock === 0;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur lg:hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="relative size-12 shrink-0 overflow-hidden bg-sand">
              <Photo name={image} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="truncate text-xs text-muted">
                {formatPrice(selection.price)}
                {selection.color && ` · ${selection.color}`}
              </p>
            </div>
            <button
              type="button"
              disabled={soldOut}
              onClick={() => {
                add({
                  productId: product.id,
                  color: selection.color,
                  options: selection.options,
                  quantity: selection.quantity,
                });
                notify(`Added ${product.name} to your cart`);
                open("cart");
              }}
              className="h-11 shrink-0 bg-accent px-5 text-sm font-medium text-on-accent disabled:opacity-50"
            >
              {soldOut ? "Sold out" : "Add to cart"}
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
