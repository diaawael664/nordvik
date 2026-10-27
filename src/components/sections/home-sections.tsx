/**
 * Reusable home-page sections. Each one reads its content from /data and can
 * be dropped into any page; all three home layouts mix these.
 */
import { ArrowUpRight, Camera } from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import { deal, gallery, press, socialHandle } from "@data/home";
import { getProduct, products, type Product } from "@/lib/catalog";
import { site } from "@data/site";
import { testimonials } from "@data/testimonials";
import { ProductCard } from "@/components/product/product-card";
import { ProductCarousel } from "@/components/product/product-carousel";
import { ButtonLink } from "@/components/ui/button";
import { Countdown } from "@/components/ui/countdown";
import { Dimension } from "@/components/ui/dimension";
import { Photo } from "@/components/ui/photo";
import { Container, Price, Rating, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { cn, formatPrice } from "@/lib/utils";

/** Vertical rhythm shared by every home section. */
export const sectionY = "py-20 md:py-28";

/* ── Category tiles ──────────────────────────────────────────────────────── */

export function CategoryTiles({
  slugs = categories.map((c) => c.slug),
  title = "Shop by room",
  eyebrow = "Categories",
}: {
  slugs?: string[];
  title?: string;
  eyebrow?: string;
}) {
  const picked = slugs.flatMap((s) => categories.filter((c) => c.slug === s));
  // A synced catalog may not have the demo's category slugs; show its own instead.
  const items = picked.length ? picked : categories.slice(0, 4);
  return (
    <section className={sectionY}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          action={
            <ButtonLink href="/shop/" variant="link">
              All categories
            </ButtonLink>
          }
        />
        <ul className="snap-row -mx-4 auto-cols-[62%] gap-4 px-4 sm:mx-0 sm:grid sm:grid-flow-row sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-4">
          {items.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <li key={c.slug}>
                <Reveal delay={i * 0.08}>
                  <Link href={`/shop/${c.slug}/`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                      <Photo
                        name={c.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 62vw"
                        className="object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-2xl">{c.name}</h3>
                      <span className="font-mono text-[11px] tracking-wider text-muted">
                        {count} {count === 1 ? "piece" : "pieces"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{c.description}</p>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/* ── Product rails & grids ───────────────────────────────────────────────── */

export function ProductRail({
  eyebrow,
  title,
  items,
  href = "/shop/",
  linkLabel = "Shop all",
  className,
}: {
  eyebrow: string;
  title: string;
  items: Product[];
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <section className={cn(sectionY, className)}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          action={
            <ButtonLink href={href} variant="link">
              {linkLabel}
            </ButtonLink>
          }
        />
        <ProductCarousel products={items} label={title} />
      </Container>
    </section>
  );
}

export function ProductGrid({
  eyebrow,
  title,
  items,
  href = "/shop/",
  linkLabel = "Shop all",
}: {
  eyebrow: string;
  title: string;
  items: Product[];
  href?: string;
  linkLabel?: string;
}) {
  return (
    <section className={sectionY}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <ButtonLink href={href} variant="outline" size="lg">
            {linkLabel}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/* ── Editorial split: brand story with a spec-sheet image ────────────────── */

export function StorySplit() {
  const chair = getProduct("vinge-lounge-chair");
  return (
    <section className="bg-sand">
      <Container className="grid items-center gap-12 py-20 md:grid-cols-2 md:gap-16 md:py-28 lg:gap-24">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            <Photo name="chair-wing" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            {chair && (
              <>
                <Dimension label={`W ${chair.dimensions.width} cm`} className="absolute inset-x-8 bottom-7" />
                <Dimension
                  axis="y"
                  label={`H ${chair.dimensions.height} cm`}
                  className="absolute top-10 bottom-16 left-6"
                />
              </>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mb-5">From the workshop</p>
          <h2 className="display-lg">Eleven prototypes for one chair.</h2>
          <div className="mt-6 max-w-md space-y-4 leading-relaxed text-muted">
            <p>
              The Vinge lounge chair is steam-bent from a single length of oak. Getting the curve to hold took two
              years, and every frame is still signed by the person who bent it.
            </p>
            <p>
              We work this way across the range: fewer pieces, made properly, from wood we can trace back to the forest.
            </p>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 border-t border-ink/15 pt-6">
            {[
              ["1987", "Workshop founded"],
              ["100%", "FSC-certified wood"],
              ["10 yr", "Frame warranty"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl">{value}</dd>
                <dd className="mt-1 text-xs text-muted">{label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/about/" variant="solid">
              Read our story
            </ButtonLink>
            {chair && (
              <ButtonLink href={`/product/${chair.slug}/`} variant="link">
                Shop the Vinge chair
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ── Limited-time deal ───────────────────────────────────────────────────── */

export function DealSection() {
  const product = getProduct(deal.product);
  if (!product) return null;
  return (
    <section className="bg-inverse text-on-inverse">
      <div className="mx-auto grid max-w-site lg:grid-cols-2">
        <div className="relative min-h-80 lg:min-h-[36rem]">
          <Photo name={deal.image} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-4 py-16 sm:px-10 lg:px-16 xl:px-24">
          <p className="mb-5 font-mono text-[11px] tracking-[0.18em] uppercase opacity-70">{deal.eyebrow}</p>
          <h2 className="display-lg">{deal.title}</h2>
          <p className="mt-5 max-w-md leading-relaxed opacity-80">{deal.text}</p>
          <Countdown endsAt={deal.endsAt} repeatEveryDays={deal.repeatEveryDays} className="mt-10" />
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink href={`/product/${product.slug}/`} size="lg" variant="light">
              Shop the offer
            </ButtonLink>
            <div>
              <Price price={product.price} compareAt={product.compareAt} tone="inverse" />
              {product.compareAt && (
                <p className="mt-1 text-xs opacity-70">You save {formatPrice(product.compareAt - product.price)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ────────────────────────────────────────────────────────── */

export function Testimonials() {
  return (
    <section className={sectionY}>
      <Container>
        <SectionHeading
          eyebrow="Reviews"
          title="Lived with, then written about"
          text={`4.8 out of 5 from more than 2,400 verified ${site.name} customers.`}
          align="center"
        />
        <ul className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => {
            const product = getProduct(t.product);
            return (
              <li key={t.name}>
                <Reveal
                  delay={(i % 2) * 0.1}
                  className="flex h-full flex-col border border-line bg-surface p-7 sm:p-10"
                >
                  <Rating value={t.rating} />
                  <blockquote className="mt-6 flex-1 font-display text-xl leading-snug sm:text-[1.4rem]">
                    “{t.quote}”
                  </blockquote>
                  <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
                    <p className="text-sm">
                      <span className="font-semibold">{t.name}</span>
                      <span className="block text-muted">{t.location}</span>
                    </p>
                    {product && (
                      <Link href={`/product/${product.slug}/`} className="group flex items-center gap-3 text-sm">
                        <span className="relative size-12 overflow-hidden bg-sand">
                          <Photo name={product.images[0]} alt="" fill sizes="48px" className="object-cover" />
                        </span>
                        <span className="group-hover:underline">{product.name}</span>
                      </Link>
                    )}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/* ── Press strip ─────────────────────────────────────────────────────────── */

const pressStyles = {
  serif: "font-display text-2xl",
  sans: "font-sans text-lg font-bold tracking-[0.2em]",
  italic: "font-display text-2xl italic",
  mono: "font-mono text-lg tracking-tight",
};

/** "As featured in" — scrolls slowly; static for reduced-motion visitors. */
export function PressStrip() {
  const row = press.map((p) => (
    <li key={p.name} className={cn("shrink-0 px-8 whitespace-nowrap text-muted sm:px-12", pressStyles[p.style])}>
      {p.name}
    </li>
  ));
  return (
    <section aria-label="As featured in" className="overflow-hidden border-y border-line py-10">
      <p className="eyebrow mb-6 text-center">As featured in</p>
      <div className="flex w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
        <ul className="flex items-center">{row}</ul>
        <ul className="flex items-center" aria-hidden>
          {row}
        </ul>
      </div>
    </section>
  );
}

/* ── Social gallery ──────────────────────────────────────────────────────── */

export function SocialGallery() {
  const instagram = site.social.find((s) => s.label === "Instagram")?.href ?? "#";
  return (
    <section className={sectionY}>
      <Container>
        <SectionHeading
          eyebrow="In your homes"
          title={`Tag ${socialHandle} to be featured`}
          action={
            <ButtonLink href={instagram} target="_blank" rel="noopener noreferrer" variant="link">
              Follow on Instagram
            </ButtonLink>
          }
        />
      </Container>
      <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
        {gallery.map((g) => (
          <li key={g.image}>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-sand"
            >
              <Photo
                name={g.image}
                fill
                sizes="(min-width: 1024px) 17vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Camera className="size-6" strokeWidth={1.5} />
                <span className="px-3 text-center text-xs">{g.caption}</span>
              </span>
              <span className="sr-only">View on Instagram: {g.caption}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Promo banners (two side-by-side) ────────────────────────────────────── */

export function PromoPair() {
  const promos = [
    { image: "room-bedroom-white", eyebrow: "Bedroom", title: "Slower mornings", href: "/shop/bedroom/" },
    { image: "room-dining-stair", eyebrow: "Lighting", title: "Glare-free evenings", href: "/shop/lighting/" },
  ] as const;
  return (
    <section className="pb-20 md:pb-28">
      <Container className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {promos.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1}>
            <Link href={p.href} className="group relative block aspect-[4/3] overflow-hidden bg-sand text-white">
              <Photo
                name={p.image}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 sm:inset-x-10 sm:bottom-10">
                <span>
                  <span className="block font-mono text-[11px] tracking-[0.18em] uppercase opacity-85">
                    {p.eyebrow}
                  </span>
                  <span className="mt-2 block font-display text-3xl sm:text-4xl">{p.title}</span>
                </span>
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/50 transition-colors group-hover:bg-white group-hover:text-inverse">
                  <ArrowUpRight className="size-5" strokeWidth={1.5} />
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
