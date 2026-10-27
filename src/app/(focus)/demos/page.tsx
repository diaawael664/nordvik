import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ImageKey } from "@data/images";
import { site } from "@data/site";
import { Logo } from "@/components/layout/brand";
import { ButtonLink } from "@/components/ui/button";
import { Dimension } from "@/components/ui/dimension";
import { Photo } from "@/components/ui/photo";
import { Container } from "@/components/ui/primitives";
import { categories, products } from "@/lib/catalog";
import { PresetButtons } from "./preset-buttons";

/**
 * Demo hub for the marketplace listing: every layout, preset and key page in
 * one place. Demo only: `npm run package` leaves this page out of the download.
 * Preview screenshots come from `npm run marketplace` (public/previews/*.jpg);
 * until they exist, a photo is shown instead.
 */
export const metadata: Metadata = {
  title: "Template demos",
  description: `${site.name}: a furniture and home decor store template for Next.js. Browse every layout and page.`,
  robots: { index: false, follow: true },
};

type Preview = { name: string; href: string; label: string; note: string; fallback: ImageKey };

const homes: Preview[] = [
  {
    name: "home-classic",
    href: "/",
    label: "Classic",
    note: "Hero slider, categories, best sellers, deal countdown",
    fallback: "room-open-living",
  },
  {
    name: "home-editorial",
    href: "/home-editorial/",
    label: "Editorial",
    note: "Magazine layout, asymmetric grid, shop-the-room",
    fallback: "room-amber",
  },
  {
    name: "home-modern",
    href: "/home-modern/",
    label: "Modern",
    note: "Split hero, ticker, video band, collection tabs",
    fallback: "chair-swivel",
  },
];

const pages: Preview[] = [
  { name: "shop", href: "/shop/", label: "Shop", note: "Filters, price slider, grid/list", fallback: "sofa-taupe" },
  {
    name: "product",
    href: "/product/fjell-three-seat-sofa/",
    label: "Product",
    note: "Zoom, variants, dimensions, sets",
    fallback: "sofa-velvet-green",
  },
  { name: "collections", href: "/collections/", label: "Lookbook", note: "Clickable hotspots", fallback: "room-cream" },
  { name: "cart", href: "/cart/", label: "Cart", note: "Promo codes, delivery meter", fallback: "chair-dove" },
  {
    name: "checkout",
    href: "/checkout/",
    label: "Checkout",
    note: "Validation, payment methods",
    fallback: "cabinet-oak",
  },
  { name: "account", href: "/account/orders/", label: "Account", note: "Orders and tracking", fallback: "lamp-floor" },
  { name: "blog", href: "/blog/", label: "Journal", note: "MDX posts, categories", fallback: "room-reading" },
  { name: "about", href: "/about/", label: "About", note: "Story, values, team", fallback: "studio-exterior" },
  {
    name: "coming-soon",
    href: "/coming-soon/",
    label: "Coming soon",
    note: "Countdown and sign-up",
    fallback: "room-studio",
  },
];

const features = [
  {
    title: "Shop",
    items: [
      "Category pages with their own URLs",
      "Filters: price, color, material, stock",
      "Quick view, wishlist, search",
      "Grid, list, left/right/top filters",
    ],
  },
  {
    title: "Product",
    items: [
      "Zoom gallery, three layouts",
      "Variants with live price",
      "Dimensions drawn on the photo",
      "Delivery estimate by ZIP",
      "Back-in-stock, fabric swatches",
    ],
  },
  {
    title: "Checkout & account",
    items: [
      "Mini cart and cart page",
      "Promo codes, set discounts",
      "Checkout with card validation",
      "Orders, tracking, addresses",
    ],
  },
  {
    title: "Built for buyers",
    items: [
      "Rebrand in one file",
      "3 color presets + dark mode",
      "Shopify catalog and checkout",
      "GA4 events, cookie consent",
      "Playwright test suite",
    ],
  },
];

const hasPreview = (name: string) => existsSync(join(process.cwd(), "public/previews", `${name}.jpg`));

function PreviewCard({ p, large = false }: { p: Preview; large?: boolean }) {
  return (
    <Link href={p.href} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden border border-line bg-sand">
        {hasPreview(p.name) ? (
          <Image
            src={`/previews/${p.name}.jpg`}
            alt={`${p.label} page preview`}
            fill
            sizes={large ? "(min-width: 1024px) 32vw, 100vw" : "(min-width: 1024px) 24vw, 50vw"}
            className="object-cover object-top transition-transform duration-700 ease-soft group-hover:scale-[1.02]"
          />
        ) : (
          <Photo name={p.fallback} alt="" fill sizes="33vw" className="object-cover" />
        )}
      </div>
      <p
        className={`mt-4 font-display ${large ? "text-2xl" : "text-xl"} group-hover:underline group-hover:underline-offset-4`}
      >
        {p.label}
      </p>
      <p className="mt-1 text-sm text-muted">{p.note}</p>
    </Link>
  );
}

export default function DemosPage() {
  return (
    <>
      <header className="border-b border-line">
        <Container className="flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden text-sm underline-offset-4 hover:underline sm:inline">
              Live demo
            </Link>
            <ButtonLink href={site.demo.purchaseUrl} size="sm">
              Buy this template
            </ButtonLink>
          </div>
        </Container>
      </header>

      <Container className="py-16 md:py-24">
        <p className="eyebrow mb-5">Next.js 16 · TypeScript · Tailwind CSS 4</p>
        <h1 className="display-xl max-w-5xl">A furniture store template, made to be lived with.</h1>
        <Dimension tone="plain" label="3 homes · 3 presets · Shopify-ready" className="mt-10 max-w-xl text-muted" />
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
          Three home layouts, a complete shop with {products.length} demo products in {categories.length} categories,
          and every page a furniture store needs. Rebrand it in one file, connect Shopify, and deploy anywhere as a
          static site.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={site.demo.purchaseUrl} size="lg">
            Buy this template
          </ButtonLink>
          <ButtonLink href="#homes" size="lg" variant="outline">
            Browse the demos
          </ButtonLink>
        </div>
      </Container>

      <section id="homes" aria-labelledby="homes-title" className="scroll-mt-8 border-t border-line">
        <Container className="py-16 md:py-24">
          <p className="eyebrow mb-4">Home layouts</p>
          <h2 id="homes-title" className="display-md mb-12">
            Three ways to open the store
          </h2>
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {homes.map((p) => (
              <PreviewCard key={p.name} p={p} large />
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="presets-title" className="bg-sand">
        <Container className="py-16 md:py-24">
          <p className="eyebrow mb-4">Color presets</p>
          <h2 id="presets-title" className="display-md mb-4">
            One line to rebrand
          </h2>
          <p className="mb-12 max-w-xl text-muted">
            Each preset has a light and a dark palette, and every one passes WCAG AA contrast. Pick one to open the demo
            in it.
          </p>
          <PresetButtons />
        </Container>
      </section>

      <section aria-labelledby="pages-title">
        <Container className="py-16 md:py-24">
          <p className="eyebrow mb-4">Inner pages</p>
          <h2 id="pages-title" className="display-md mb-12">
            Every page a furniture store needs
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
            {pages.map((p) => (
              <PreviewCard key={p.name} p={p} />
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="features-title" className="border-t border-line">
        <Container className="py-16 md:py-24">
          <h2 id="features-title" className="display-md mb-12">
            What&apos;s included
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="border-t border-ink pt-6">
                <h3 className="font-display text-2xl">{f.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {f.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-inverse text-on-inverse">
        <Container className="flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <h2 className="display-md">Ready to open your store?</h2>
            <p className="mt-3 max-w-md opacity-80">Includes full documentation and an end-to-end test suite.</p>
          </div>
          <ButtonLink href={site.demo.purchaseUrl} size="lg" variant="light">
            Buy this template
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
