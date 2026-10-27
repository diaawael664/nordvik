"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { getCategory } from "@/lib/catalog";
import { Dimension } from "@/components/ui/dimension";
import { Photo } from "@/components/ui/photo";
import { Badge, Price } from "@/components/ui/primitives";
import { SwatchGroup } from "@/components/ui/controls";
import { useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import { cn, percentOff } from "@/lib/utils";
import { WishlistButton } from "./wishlist-button";

type ProductCardProps = {
  product: Product;
  /** "grid" (default, portrait) or "list" (horizontal, for the shop list view). */
  layout?: "grid" | "list";
  /** Set on above-the-fold cards to load the image eagerly. */
  priority?: boolean;
  sizes?: string;
};

/** Default selections used by "Add to cart" from a card. */
export function defaultSelection(product: Product) {
  return {
    color: product.colors[0]?.name,
    options: Object.fromEntries((product.options ?? []).map((o) => [o.name, o.values[0].label])),
  };
}

export function ProductCard({ product, layout = "grid", priority, sizes }: ProductCardProps) {
  const { add } = useCart();
  const { open, setQuickView, notify } = useUI();
  const href = `/product/${product.slug}/`;
  const soldOut = product.stock === 0;
  const [first, second] = product.images;

  const addToCart = () => {
    add({ productId: product.id, ...defaultSelection(product) });
    notify(`Added ${product.name} to your cart`);
    open("cart");
  };

  return (
    <article
      className={cn(
        "group relative",
        layout === "list" &&
          "grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]",
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Photo
          name={first}
          alt=""
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"}
          className={cn(
            "object-cover transition-[opacity,transform] duration-700 ease-soft group-hover:scale-[1.03]",
            second && "group-hover:opacity-0",
          )}
        />
        {second && (
          <Photo
            name={second}
            alt=""
            fill
            sizes={sizes ?? "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"}
            className="object-cover opacity-0 transition-opacity duration-700 ease-soft group-hover:opacity-100"
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {soldOut && <Badge>Sold out</Badge>}
          {product.isNew && <Badge tone="accent">New</Badge>}
          {product.compareAt && <Badge tone="wood">−{percentOff(product.compareAt, product.price)}%</Badge>}
          {product.isBestseller && !product.isNew && !product.compareAt && <Badge>Bestseller</Badge>}
        </div>

        <WishlistButton productId={product.id} productName={product.name} className="absolute top-3 right-3 z-10" />

        {/* Signature: the piece's width drawn in like a spec drawing on hover. */}
        {product.dimensions.width > 0 && (
          <Dimension
            reveal="hover"
            label={`W ${product.dimensions.width} cm`}
            className="absolute inset-x-5 bottom-[4.25rem] hidden md:flex"
          />
        )}

        {/* Phones: one compact add button (no hover on touch screens). */}
        {!soldOut && (
          <button
            type="button"
            onClick={addToCart}
            aria-label={`Add ${product.name} to cart`}
            className="absolute right-3 bottom-3 z-10 grid size-10 place-items-center rounded-full bg-ink text-bg md:hidden"
          >
            <ShoppingBag className="size-4" strokeWidth={1.5} />
          </button>
        )}

        {/* Tablet and up: revealed on hover or keyboard focus. */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-3 gap-2 opacity-0 transition-all duration-500 ease-soft group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
          <button
            type="button"
            onClick={addToCart}
            disabled={soldOut}
            aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}
            className="h-10 flex-1 bg-ink text-xs font-medium tracking-wide whitespace-nowrap text-bg transition-colors hover:bg-accent hover:text-on-accent disabled:bg-surface disabled:text-muted"
          >
            {soldOut ? "Sold out" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={() => setQuickView(product.slug)}
            className="h-10 bg-bg/90 px-4 text-xs font-medium tracking-wide backdrop-blur transition-colors hover:bg-bg"
            aria-label={`Quick view ${product.name}`}
          >
            Quick view
          </button>
        </div>
      </div>

      <div className={cn("pt-4", layout === "list" && "flex flex-col justify-center pt-0")}>
        <p className="eyebrow mb-1.5">{getCategory(product.category)?.name}</p>
        <h3 className="font-sans text-[15px] leading-snug font-medium">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:underline"
          >
            {product.name}
          </Link>
        </h3>
        {layout === "list" && <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{product.summary}</p>}
        <div className="mt-2 flex items-center justify-between gap-3">
          <Price price={product.price} compareAt={product.compareAt} size="sm" />
          {product.colors.length > 1 && <SwatchGroup colors={product.colors} size="sm" />}
        </div>
      </div>
    </article>
  );
}
