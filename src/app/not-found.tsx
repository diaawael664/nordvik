import type { Metadata } from "next";
import { bestSellers } from "@/lib/catalog";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProductCarousel } from "@/components/product/product-carousel";
import { ButtonLink } from "@/components/ui/button";
import { Dimension } from "@/components/ui/dimension";
import { Container, SectionHeading } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** 404 page. Static export writes it to /404.html, which hosts serve for unknown URLs. */
export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        <Container className="py-20 md:py-28">
          <div className="relative max-w-3xl">
            <p className="eyebrow mb-6">Error 404</p>
            <h1 className="display-xl">This page has moved out.</h1>
            <Dimension tone="plain" label="0 × 0 × 0 cm" className="mt-8 max-w-md text-muted" />
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
              The link may be old, or the piece may no longer be in our collection. Try the shop, or start again from
              the home page.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/shop/" size="lg">
                Shop all products
              </ButtonLink>
              <ButtonLink href="/" size="lg" variant="outline">
                Go to the home page
              </ButtonLink>
            </div>
          </div>
        </Container>
        <Container className="border-t border-line py-20">
          <SectionHeading eyebrow="Popular right now" title="Best sellers" />
          <ProductCarousel products={bestSellers()} label="Best sellers" />
        </Container>
      </main>
      <Footer />
    </>
  );
}
