"use client";

import Link from "next/link";
import { collections } from "@data/collections";
import { getProduct } from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";
import { ShopTheRoom } from "@/components/product/shop-the-room";
import { Container } from "@/components/ui/primitives";
import { Tabs } from "@/components/ui/tabs";

/** Tabbed collection showcase: one room photo with hotspots plus its products. */
export function CollectionShowcase({ title = "Shop by collection" }: { title?: string }) {
  return (
    <section aria-labelledby="showcase-title" className="py-20 md:py-28">
      <Container>
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">Collections</p>
            <h2 id="showcase-title" className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-tight">
              {title}
            </h2>
          </div>
          <Link href="/collections/" className="text-sm underline underline-offset-4">
            Open the lookbook
          </Link>
        </div>
        <Tabs
          tabs={collections.map((c) => {
            const items = [...new Set(c.hotspots.map((h) => h.product))].flatMap((s) => getProduct(s) ?? []);
            return {
              id: c.slug,
              label: c.title,
              content: (
                <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
                  <div>
                    <ShopTheRoom collection={c} showList={false} sizes="(min-width: 1024px) 58vw, 100vw" />
                    <p className="mt-5 max-w-xl text-muted">{c.description}</p>
                  </div>
                  <div className="grid grid-cols-2 content-start gap-x-4 gap-y-10 sm:gap-x-6">
                    {items.slice(0, 4).map((p) => (
                      <ProductCard key={p.id} product={p} sizes="(min-width: 1024px) 18vw, 50vw" />
                    ))}
                  </div>
                </div>
              ),
            };
          })}
        />
      </Container>
    </section>
  );
}
