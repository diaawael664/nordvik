import type { Metadata } from "next";
import Link from "next/link";
import { sortedPosts } from "@data/blog";
import { getCollection } from "@data/collections";
import { editorial } from "@data/home";
import { getProduct } from "@/lib/catalog";
import { PostCard } from "@/components/blog/blog-parts";
import { ProductCard } from "@/components/product/product-card";
import { ShopTheRoom } from "@/components/product/shop-the-room";
import { FeaturesBar } from "@/components/sections/features-bar";
import { DealSection, PressStrip, sectionY } from "@/components/sections/home-sections";
import { Newsletter } from "@/components/sections/newsletter";
import { ButtonLink } from "@/components/ui/button";
import { Dimension } from "@/components/ui/dimension";
import { Photo } from "@/components/ui/photo";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "The Autumn Issue",
  description: editorial.intro,
  alternates: { canonical: "/home-editorial/" },
};

/**
 * Home 2 — Editorial / magazine.
 * Oversized type, an asymmetric image grid and a "Shop the room" lookbook.
 */
export default function HomeEditorial() {
  const room = getCollection(editorial.shopTheRoom);
  const editProducts = editorial.edit.flatMap((s) => getProduct(s) ?? []);
  const [lead, ...restEdit] = editProducts;
  const posts = sortedPosts().slice(0, 3);

  return (
    <>
      {/* ── Masthead ── */}
      <section className="overflow-hidden">
        <Container className="relative pt-10 pb-16 md:pt-14 md:pb-24">
          <div className="flex items-center justify-between border-b border-ink pb-4 font-mono text-[11px] tracking-[0.18em] uppercase">
            <span>{editorial.issue}</span>
            <span className="hidden sm:inline">Furniture · Light · Objects</span>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-6">
            <h1 className="font-display text-[clamp(3.5rem,12vw,11rem)] leading-[0.86] tracking-[-0.045em] md:col-span-7 md:row-start-1">
              {editorial.title.map((line, i) => (
                <span key={line} className={i === 1 ? "block pl-[8%] italic" : "block"}>
                  {line}
                </span>
              ))}
            </h1>

            <div className="relative md:col-span-5 md:col-start-8 md:row-span-2 md:row-start-1">
              <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                <Photo
                  name={editorial.heroImages[0]}
                  fill
                  priority
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-6 hidden aspect-square w-[45%] overflow-hidden border-8 border-bg bg-sand md:-left-24 md:block">
                <Photo name={editorial.heroImages[1]} fill sizes="18vw" className="object-cover" />
              </div>
            </div>

            <div className="md:col-span-5 md:row-start-2 md:self-end">
              <p className="max-w-sm text-lg leading-relaxed text-muted">{editorial.intro}</p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <ButtonLink href="/collections/" variant="solid" size="lg">
                  Read the lookbook
                </ButtonLink>
                <ButtonLink href="/shop/" variant="link">
                  Shop the issue
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── In this issue: asymmetric feature grid ── */}
      <section aria-labelledby="issue-title" className="border-t border-line">
        <Container className={sectionY}>
          <h2 id="issue-title" className="eyebrow mb-10">
            In this issue
          </h2>
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-12">
            {editorial.features.map((f, i) => {
              const layout = [
                "md:col-span-7",
                "md:col-span-4 md:col-start-9 md:mt-40",
                "md:col-span-5 md:col-start-3 md:-mt-24",
              ][i];
              const ratio = ["aspect-[4/3]", "aspect-[3/4]", "aspect-[4/5]"][i];
              return (
                <Reveal key={f.href} delay={i * 0.08} className={layout}>
                  <Link href={f.href} className="group block">
                    <div className={`relative ${ratio} overflow-hidden bg-sand`}>
                      <Photo
                        name={f.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-105"
                      />
                    </div>
                    <p className="eyebrow mt-5">{f.eyebrow}</p>
                    <h3 className="mt-2 font-display text-3xl leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 md:text-4xl">
                      {f.title}
                    </h3>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Shop the room ── */}
      {room && (
        <section aria-labelledby="room-title" className="bg-sand">
          <Container className={sectionY}>
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow mb-4">Shop the room</p>
                <h2 id="room-title" className="display-lg max-w-2xl">
                  Tap a piece to make it yours
                </h2>
              </div>
              <ButtonLink href="/collections/" variant="link">
                See every room
              </ButtonLink>
            </div>
            <ShopTheRoom collection={room} />
          </Container>
        </section>
      )}

      {/* ── Pull quote ── */}
      <section aria-label="From our head of design">
        <Container className={`grid items-center gap-12 md:grid-cols-12 ${sectionY}`}>
          <div className="relative aspect-[4/5] overflow-hidden bg-sand md:col-span-4">
            <Photo
              name={editorial.quote.image}
              alt={`${editorial.quote.author}, ${editorial.quote.role}`}
              fill
              sizes="(min-width: 768px) 30vw, 100vw"
              className="object-cover grayscale"
            />
          </div>
          <figure className="md:col-span-7 md:col-start-6">
            <blockquote className="font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] tracking-tight">
              “{editorial.quote.text}”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <Dimension tone="plain" label="" className="w-16 text-ink" />
              <span className="text-sm">
                <span className="font-semibold">{editorial.quote.author}</span>
                <span className="text-muted"> · {editorial.quote.role}</span>
              </span>
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* ── The edit: one lead product + four ── */}
      {lead && (
        <section aria-labelledby="edit-title" className="border-t border-line">
          <Container className={sectionY}>
            <div className="mb-12 flex items-end justify-between gap-6">
              <h2 id="edit-title" className="display-lg">
                The edit
              </h2>
              <ButtonLink href="/shop/" variant="link">
                Shop everything
              </ButtonLink>
            </div>
            <div className="grid gap-x-6 gap-y-12 lg:grid-cols-2">
              <ProductCard product={lead} sizes="(min-width: 1024px) 48vw, 100vw" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6">
                {restEdit.map((p) => (
                  <ProductCard key={p.id} product={p} sizes="(min-width: 1024px) 24vw, 50vw" />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      <DealSection />

      {/* ── From the journal ── */}
      <section aria-labelledby="journal-title">
        <Container className={sectionY}>
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 id="journal-title" className="display-lg">
              From the journal
            </h2>
            <ButtonLink href="/blog/" variant="link">
              All articles
            </ButtonLink>
          </div>
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </Container>
      </section>

      <PressStrip />
      <FeaturesBar className="border-t-0" />
      <Newsletter variant="band" />
    </>
  );
}
