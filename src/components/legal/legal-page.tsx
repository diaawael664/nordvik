import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { getLegalPage, legalPages, type LegalPage } from "@data/legal";
import { site } from "@data/site";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** Replaces {store}, {email} and {url} with values from data/site.ts. */
const fill = (text: string) =>
  text.replaceAll("{store}", site.name).replaceAll("{email}", site.contact.email).replaceAll("{url}", site.url);

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

export function legalMetadata(slug: LegalPage["slug"]): Metadata {
  const page = getLegalPage(slug);
  return { title: page.title, description: fill(page.description), alternates: { canonical: `/${slug}/` } };
}

/** Shared layout for policy pages: title, contents list, sections, and links to the other policies. */
export function LegalPageView({ slug, extra }: { slug: LegalPage["slug"]; extra?: ReactNode }) {
  const page = getLegalPage(slug);
  return (
    <Container className="py-12 md:py-16">
      <p className="eyebrow mb-4">Policies</p>
      <h1 className="display-lg">{page.title}</h1>
      <p className="mt-4 font-mono text-xs text-muted">
        Last updated <time dateTime={page.updated}>{dateFmt.format(new Date(page.updated))}</time>
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-20">
        <nav aria-label="Policies" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:divide-y lg:divide-line lg:border-y lg:border-line">
            {legalPages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}/`}
                  aria-current={p.slug === slug ? "page" : undefined}
                  className={cn(
                    "block rounded-full border border-line px-4 py-2 text-sm lg:rounded-none lg:border-0 lg:px-0 lg:py-3",
                    p.slug === slug ? "font-semibold text-ink" : "hover:text-accent",
                  )}
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 hidden text-sm text-muted lg:block">On this page</p>
          <ul className="mt-2 hidden space-y-1.5 text-sm lg:block">
            {page.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted hover:text-ink">
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-[42rem]">
          <p className="text-lg leading-relaxed">{fill(page.intro)}</p>
          {extra}
          {page.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-28">
              <h2 id={`${s.id}-title`} className="mt-12 mb-4 font-display text-2xl">
                {s.heading}
              </h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 32)} className="my-4 leading-relaxed text-muted">
                  {fill(p)}
                </p>
              ))}
            </section>
          ))}
          <p className="mt-14 border-t border-line pt-6 text-sm text-muted">
            Questions? Email{" "}
            <a href={`mailto:${site.contact.email}`} className="text-ink underline underline-offset-4">
              {site.contact.email}
            </a>{" "}
            or visit our{" "}
            <Link href="/contact/" className="text-ink underline underline-offset-4">
              contact page
            </Link>
            .
          </p>
        </article>
      </div>
    </Container>
  );
}
