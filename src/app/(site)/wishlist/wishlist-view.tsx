"use client";

import { Heart, X } from "lucide-react";
import { getProductById, newArrivals } from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";
import { ProductCarousel } from "@/components/product/product-carousel";
import { ButtonLink } from "@/components/ui/button";
import { Container, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { useWishlist } from "@/context/wishlist-context";
import { useHydrated } from "@/lib/use-hydrated";

export function WishlistView() {
  const hydrated = useHydrated();
  const { ids, remove } = useWishlist();
  const items = ids.flatMap((id) => getProductById(id) ?? []);

  return (
    <>
      <PageHeader
        eyebrow="Saved for later"
        title="Your wishlist"
        text={
          hydrated && items.length > 0
            ? `${items.length} saved ${items.length === 1 ? "piece" : "pieces"}, kept on this device.`
            : undefined
        }
      />
      <Container className="pb-24">
        {!hydrated ? (
          <div className="h-80 animate-pulse bg-sand/60" aria-label="Loading your wishlist" />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-start gap-5 border border-dashed border-line px-6 py-16 sm:items-center sm:text-center">
            <Heart className="size-10 text-muted" strokeWidth={1} />
            <p className="font-display text-2xl">Nothing saved yet</p>
            <p className="max-w-md text-muted">Tap the heart on any product to keep it here while you decide.</p>
            <ButtonLink href="/shop/" size="lg">
              Browse the collection
            </ButtonLink>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {items.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="mt-3 flex items-center gap-1 text-xs text-muted hover:text-ink"
                  aria-label={`Remove ${p.name} from wishlist`}
                >
                  <X className="size-3.5" /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <section className="mt-24 border-t border-line pt-16">
          <SectionHeading eyebrow="Just in" title="New arrivals" />
          <ProductCarousel products={newArrivals()} label="New arrivals" />
        </section>
      </Container>
    </>
  );
}
