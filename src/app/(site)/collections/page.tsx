import type { Metadata } from "next";
import { collections } from "@data/collections";
import { ShopTheRoom } from "@/components/product/shop-the-room";
import { Newsletter } from "@/components/sections/newsletter";
import { Container, PageHeader } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Rooms styled with Nordvik furniture. Tap any marker to shop the piece.",
  alternates: { canonical: "/collections/" },
};

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Lookbook · Autumn 2026"
        title="Rooms to live in, pieces to shop"
        text="Four rooms styled by our design team. Tap a marker on any photo to see the piece and add it to your cart."
      >
        <nav aria-label="Jump to a room" className="mt-8 flex flex-wrap gap-2">
          {collections.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className="h-9 rounded-full border border-line px-4 text-sm leading-[2.15rem] transition-colors hover:border-ink"
            >
              {c.title}
            </a>
          ))}
        </nav>
      </PageHeader>
      <Container className="space-y-24 pb-24 md:space-y-32">
        {collections.map((c, i) => (
          <section key={c.slug} id={c.slug} aria-label={c.title} className="scroll-mt-28 border-t border-line pt-12">
            {/* The first room is on screen at load, so it isn't faded in. */}
            {i === 0 ? (
              <ShopTheRoom collection={c} priority headingLevel="h2" />
            ) : (
              <Reveal>
                <ShopTheRoom collection={c} headingLevel="h2" />
              </Reveal>
            )}
          </section>
        ))}
      </Container>
      <Newsletter variant="band" />
    </>
  );
}
