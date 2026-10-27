import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { site } from "@data/site";
import { stores } from "@data/stores";
import { Container, PageHeader } from "@/components/ui/primitives";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Questions about sizes, fabrics or delivery? Contact ${site.name} or visit a showroom.`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="We're here to help you choose"
        text="Ask about sizes, fabrics, delivery or an existing order. A real person replies within one working day."
      />
      <Container className="grid gap-16 pb-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-24">
        <section aria-labelledby="form-title">
          <h2 id="form-title" className="sr-only">
            Send a message
          </h2>
          <ContactForm />
        </section>
        <aside className="space-y-10">
          <div className="space-y-4">
            <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 hover:underline">
              <Mail className="size-5 text-accent" strokeWidth={1.5} /> {site.contact.email}
            </a>
            <a
              href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-3 hover:underline"
            >
              <Phone className="size-5 text-accent" strokeWidth={1.5} /> {site.contact.phone}
            </a>
            <p className="pl-8 text-sm text-muted">{site.contact.hours}</p>
          </div>
          <div className="bg-sand p-6">
            <p className="font-display text-xl">Looking for a quick answer?</p>
            <p className="mt-2 text-sm text-muted">Delivery times, returns and care are covered in our help center.</p>
            <Link href="/faq/" className="mt-3 inline-block text-sm underline underline-offset-4">
              Read the FAQ
            </Link>
          </div>
        </aside>
      </Container>

      <section aria-labelledby="stores-title" className="border-t border-line">
        <Container className="py-20">
          <h2 id="stores-title" className="display-md mb-12">
            Visit us
          </h2>
          <div className="grid gap-12 md:grid-cols-2">
            {stores.map((s) => (
              <article key={s.name}>
                <div className="aspect-[4/3] overflow-hidden border border-line bg-sand">
                  <iframe
                    src={s.map}
                    title={`Map showing ${s.name}`}
                    loading="lazy"
                    className="size-full grayscale-[0.6]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="mt-6 font-display text-2xl">{s.name}</h3>
                <div className="mt-3 grid gap-6 text-sm sm:grid-cols-2">
                  <address className="not-italic">
                    {s.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    <span className="mt-2 block text-muted">{s.phone}</span>
                  </address>
                  <ul className="text-muted">
                    {s.hours.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
