import type { Metadata } from "next";
import { bestSellers, products } from "@/lib/catalog";
import { colors } from "@theme";
import { ProductCard } from "@/components/product/product-card";
import { ProductCarousel } from "@/components/product/product-carousel";
import { FeaturesBar } from "@/components/sections/features-bar";
import { Newsletter } from "@/components/sections/newsletter";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dimension } from "@/components/ui/dimension";
import { Photo } from "@/components/ui/photo";
import { Badge, Container, Price, Rating, SectionHeading } from "@/components/ui/primitives";
import { InteractiveDemo } from "./interactive-demo";

export const metadata: Metadata = {
  title: "UI elements",
  description:
    "Every reusable component in the Nordhaus template: tokens, type, buttons, product cards and form controls.",
};

const swatchNames: { key: keyof typeof colors.light; label: string }[] = [
  { key: "bg", label: "Linen — bg" },
  { key: "surface", label: "Surface" },
  { key: "sand", label: "Sand" },
  { key: "line", label: "Line" },
  { key: "muted", label: "Muted" },
  { key: "ink", label: "Charcoal — ink" },
  { key: "wood", label: "Walnut — wood" },
  { key: "accent", label: "Fjord pine — accent" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-14 md:grid md:grid-cols-12 md:gap-10">
      <h2 className="eyebrow mb-8 md:col-span-3 md:mb-0">{title}</h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

export default function ElementsPage() {
  const [sofa, chair, lamp] = [products[0], products[5], products[13]];

  return (
    <>
      <Container className="pt-14 pb-6 md:pt-20">
        <p className="eyebrow mb-4">Design system</p>
        <h1 className="display-lg max-w-3xl">The pieces this store is built from.</h1>
        <p className="mt-6 max-w-xl leading-relaxed text-muted">
          Every color and font below comes from <code className="font-mono text-sm text-ink">theme.config.ts</code>.
          Change a value there and each component on this page, and across the site, updates with it.
        </p>
      </Container>

      <Container>
        <Block title="Color tokens">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {swatchNames.map(({ key, label }) => (
              <li key={key}>
                <div className="aspect-[4/3] border border-line" style={{ background: `var(--${key})` }} />
                <p className="mt-2 text-sm">{label}</p>
                <p className="font-mono text-[11px] text-muted uppercase">
                  {colors.light[key]} / {colors.dark[key]}
                </p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Typography">
          <div className="space-y-6">
            <p className="display-xl">Made to be lived with</p>
            <p className="display-lg">Solid oak, slow made</p>
            <p className="display-md">Three generations of joinery</p>
            <p className="max-w-prose text-lg leading-relaxed">
              Manrope sets body copy and interface text. It stays legible at small sizes and has open counters that suit
              long product descriptions.
            </p>
            <p className="eyebrow">IBM Plex Mono · eyebrows, dimensions, SKUs</p>
          </div>
        </Block>

        <Block title="Signature — dimension line">
          <p className="mb-8 max-w-prose text-muted">
            Measurements drawn the way a furniture spec sheet draws them. On product cards the width draws in when the
            card is hovered; on product pages it labels every axis.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden bg-sand">
              <Photo name="sofa-velvet-green" fill sizes="(min-width: 768px) 35vw, 100vw" className="object-cover" />
              <Dimension label="W 214 cm" className="absolute inset-x-6 bottom-5" />
              <Dimension axis="y" label="H 78 cm" className="absolute inset-y-6 right-5" />
            </div>
            <div className="group relative grid aspect-[4/3] place-items-center bg-surface">
              <p className="text-sm text-muted">Hover this panel</p>
              <Dimension
                tone="plain"
                reveal="hover"
                label="W 120 cm"
                className="absolute inset-x-8 bottom-8 text-ink"
              />
              <Dimension
                tone="plain"
                reveal="hover"
                axis="y"
                label="H 75 cm"
                className="absolute inset-y-8 left-8 text-ink"
              />
            </div>
          </div>
        </Block>

        <Block title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Add to cart</Button>
            <Button variant="solid">Checkout</Button>
            <Button variant="outline">View cart</Button>
            <Button variant="ghost">Cancel</Button>
            <ButtonLink href="/shop/" variant="link">
              Shop all products
            </ButtonLink>
            <Button size="sm">Small</Button>
            <Button size="lg">Large button</Button>
            <Button disabled>Sold out</Button>
          </div>
        </Block>

        <Block title="Badges, price & rating">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex gap-2">
              <Badge tone="accent">New</Badge>
              <Badge tone="wood">−15%</Badge>
              <Badge>Bestseller</Badge>
            </div>
            <Price price={2450} compareAt={2890} />
            <Price price={1890} size="lg" className="font-display" />
            <Rating value={4.7} count={88} />
          </div>
        </Block>

        <Block title="Form controls">
          <InteractiveDemo />
        </Block>

        <Block title="Product cards">
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
            <ProductCard product={sofa} />
            <ProductCard product={chair} />
            <ProductCard product={lamp} />
          </div>
          <div className="mt-14">
            <ProductCard product={products[1]} layout="list" />
          </div>
        </Block>
      </Container>

      <Container className="border-t border-line py-20">
        <SectionHeading
          eyebrow="Carousel"
          title="Best sellers"
          action={
            <ButtonLink href="/shop/" variant="link">
              Shop all
            </ButtonLink>
          }
        />
        <ProductCarousel products={[...bestSellers(), ...products.slice(13, 17)]} label="Best sellers" />
      </Container>

      <FeaturesBar />
      <div className="py-20">
        <Newsletter />
      </div>
    </>
  );
}
