import type { Metadata } from "next";
import { modern } from "@data/home";
import { bestSellers, getProduct } from "@/lib/catalog";
import { CollectionShowcase } from "@/components/sections/collection-showcase";
import {
  CategoryTiles,
  DealSection,
  ProductRail,
  SocialGallery,
  Testimonials,
} from "@/components/sections/home-sections";
import { Newsletter } from "@/components/sections/newsletter";
import { VideoBand } from "@/components/sections/video-band";
import { ButtonLink } from "@/components/ui/button";
import { Dimension } from "@/components/ui/dimension";
import { Photo } from "@/components/ui/photo";
import { Price, Rating } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Sit down. Stay a while.",
  description: modern.hero.text,
  alternates: { canonical: "/home-modern/" },
};

/**
 * Home 3 — Bold modern.
 * Split hero, a ticker, background video and a tabbed collection showcase.
 */
export default function HomeModern() {
  const hero = modern.hero;
  const product = getProduct(hero.product);
  const ticker = [...modern.ticker, ...modern.ticker];

  return (
    <>
      {/* ── Split hero ── */}
      <section className="grid lg:min-h-[calc(100svh-7.25rem)] lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-12 bg-accent px-4 py-14 text-on-accent sm:px-10 lg:px-14 lg:py-16 xl:px-20">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-85">{hero.eyebrow}</p>
          <div>
            <h1 className="font-display text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.9] tracking-[-0.04em]">
              {hero.title}
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed opacity-90">{hero.text}</p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {/* Falls back to the shop if the featured product isn't in the catalog. */}
              <ButtonLink href={product ? hero.cta.href : "/shop/"} size="lg" variant="light">
                {product ? hero.cta.label : "Shop the collection"}
              </ButtonLink>
              <ButtonLink
                href={hero.secondary.href}
                variant="link"
                className="text-on-accent decoration-on-accent/50 hover:decoration-on-accent"
              >
                {hero.secondary.label}
              </ButtonLink>
            </div>
          </div>
          {product && (
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-on-accent/25 pt-6 text-sm">
              <div>
                <p className="font-medium">{product.name}</p>
                <Rating
                  value={product.rating}
                  count={product.reviewCount}
                  className="mt-1 text-on-accent/80 [&_.text-wood]:text-on-accent"
                />
              </div>
              <Price
                price={product.price}
                compareAt={product.compareAt}
                tone="inverse"
                className="font-display text-2xl"
              />
            </div>
          )}
        </div>
        <div className="relative min-h-[70svh] bg-sand lg:min-h-0">
          <Photo name={hero.image} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          {product && (
            <>
              <Dimension
                label={`W ${product.dimensions.width} cm`}
                className="absolute right-8 bottom-8 left-8 lg:right-14 lg:left-14"
              />
              <Dimension
                axis="y"
                label={`H ${product.dimensions.height} cm`}
                className="absolute top-8 right-6 bottom-16 hidden sm:flex"
              />
            </>
          )}
        </div>
      </section>

      {/* ── Ticker ── */}
      <div aria-hidden className="overflow-hidden bg-ink py-5 text-bg">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] motion-reduce:animate-none">
          {ticker.map((word, i) => (
            <span key={i} className="flex items-center font-display text-3xl whitespace-nowrap md:text-4xl">
              <span className="px-8">{word}</span>
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">{modern.ticker.join(". ")}.</p>

      <CategoryTiles title="Find your piece" eyebrow="Browse" slugs={["sofas", "chairs", "lighting", "decor"]} />

      <VideoBand {...modern.video} />

      <CollectionShowcase />

      <ProductRail eyebrow="Most loved" title="Best sellers" items={bestSellers()} className="border-t border-line" />

      <DealSection />
      <Testimonials />
      <SocialGallery />
      <Newsletter />
    </>
  );
}
