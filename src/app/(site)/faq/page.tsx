import type { Metadata } from "next";
import { faq } from "@data/faq";
import { site } from "@data/site";
import { AccordionItem } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description: "Answers about delivery, returns, warranty, care and payment.",
  alternates: { canonical: "/faq/" },
};

const slug = (t: string) => t.toLowerCase().replace(/[^a-z]+/g, "-");

export default function FaqPage() {
  // FAQPage structured data lets search engines show answers directly.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.flatMap((g) =>
      g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHeader
        eyebrow="Help center"
        title="Questions, answered"
        text="Delivery, returns, care and payment. Can't find what you need? Our team replies within one working day."
      />
      <Container className="grid gap-14 pb-24 lg:grid-cols-[16rem_1fr] lg:gap-20">
        <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:divide-y lg:divide-line lg:border-y lg:border-line">
            {faq.map((g) => (
              <li key={g.topic}>
                <a
                  href={`#${slug(g.topic)}`}
                  className="block rounded-full border border-line px-4 py-2 text-sm hover:border-ink lg:rounded-none lg:border-0 lg:px-0 lg:py-3 lg:hover:text-accent"
                >
                  {g.topic}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10 hidden bg-sand p-6 lg:block">
            <p className="font-display text-xl">Still need help?</p>
            <p className="mt-2 text-sm text-muted">
              {site.contact.email}
              <br />
              {site.contact.phone}
            </p>
          </div>
        </nav>
        <div className="space-y-16">
          {faq.map((g) => (
            <section
              key={g.topic}
              id={slug(g.topic)}
              aria-labelledby={`${slug(g.topic)}-title`}
              className="scroll-mt-28"
            >
              <h2 id={`${slug(g.topic)}-title`} className="mb-4 font-display text-3xl">
                {g.topic}
              </h2>
              <div className="border-t border-line">
                {g.items.map((i) => (
                  <AccordionItem key={i.q} title={i.q} name={slug(g.topic)}>
                    {i.a}
                  </AccordionItem>
                ))}
              </div>
            </section>
          ))}
          <div className="flex flex-col items-start gap-4 border border-line p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl">Didn&apos;t find your answer?</p>
              <p className="mt-1 text-muted">Send us a message and we&apos;ll reply within a working day.</p>
            </div>
            <ButtonLink href="/contact/">Contact us</ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
