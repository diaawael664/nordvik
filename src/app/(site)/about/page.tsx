import type { Metadata } from "next";
import { about } from "@data/about";
import { PressStrip, StorySplit, Testimonials } from "@/components/sections/home-sections";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About us",
  description: "A Copenhagen joinery since 1987. How we design, build and deliver furniture made to be repaired.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <>
      <Container className="pt-12 md:pt-16">
        <p className="eyebrow mb-5">{about.hero.eyebrow}</p>
        <h1 className="display-xl max-w-5xl">{about.hero.title}</h1>
      </Container>
      <div className="mx-auto mt-12 max-w-site sm:px-6 lg:px-10">
        <div className="relative aspect-[16/9] overflow-hidden bg-sand sm:aspect-[21/9]">
          <Photo name={about.hero.image} fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>

      <Container className="grid gap-10 py-20 md:grid-cols-12 md:py-28">
        <p className="eyebrow md:col-span-3">Since 1987</p>
        <div className="space-y-6 text-xl leading-relaxed md:col-span-8 md:text-2xl md:leading-relaxed">
          {about.story.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Container>

      <section aria-label="Nordvik in numbers" className="border-y border-line">
        <Container>
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {about.stats.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "flex flex-col-reverse py-10 lg:py-14",
                  i % 2 === 1 ? "border-l border-line pl-6" : "pr-6",
                  i > 1 && "border-t border-line lg:border-t-0",
                  i === 2 && "lg:border-l lg:pl-6",
                )}
              >
                <dt className="mt-2 text-sm text-muted">{s.label}</dt>
                <dd className="font-display text-5xl tracking-tight md:text-6xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <p className="eyebrow mb-4">What we believe</p>
        <h2 className="display-md max-w-2xl">Four rules we don&apos;t break</h2>
        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((v, i) => (
            <li key={v.title}>
              <Reveal delay={i * 0.08} className="border-t border-ink pt-6">
                <h3 className="font-display text-2xl">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>

      <StorySplit />

      {/* A real sequence, so the steps are numbered. */}
      <Container className="py-20 md:py-28">
        <p className="eyebrow mb-4">From drawing to doorstep</p>
        <h2 className="display-md max-w-2xl">How a piece is made</h2>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {about.process.map((p, i) => (
            <li key={p.step} className="border-t border-line pt-6">
              <span className="font-mono text-xs text-muted">
                Step {i + 1} of {about.process.length}
              </span>
              <h3 className="mt-3 font-display text-2xl">{p.step}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
            </li>
          ))}
        </ol>
      </Container>

      <figure className="bg-inverse text-on-inverse">
        <Container className="py-20 text-center md:py-28">
          <blockquote className="mx-auto max-w-4xl font-display text-3xl leading-snug md:text-5xl">
            “{about.quote.text}”
          </blockquote>
          <figcaption className="mt-8 font-mono text-xs tracking-[0.16em] uppercase opacity-70">
            {about.quote.author}
          </figcaption>
        </Container>
      </figure>

      <Container className="py-20 md:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">The people</p>
            <h2 className="display-md">Who makes it</h2>
          </div>
          <ButtonLink href="/contact/" variant="link">
            Work with us
          </ButtonLink>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {about.team.map((m, i) => (
            <li key={m.name}>
              <Reveal delay={i * 0.08}>
                <div className="group relative aspect-[4/5] overflow-hidden bg-sand">
                  <Photo
                    name={m.image}
                    alt={`${m.name}, ${m.role}`}
                    fill
                    sizes="(min-width: 1024px) 24vw, 50vw"
                    className="object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                <p className="mt-4 font-display text-xl">{m.name}</p>
                <p className="text-sm text-muted">{m.role}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>

      <Testimonials />
      <PressStrip />
    </>
  );
}
