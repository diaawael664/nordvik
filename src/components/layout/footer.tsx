import Link from "next/link";
import { footerNav, legalNav } from "@data/navigation";
import { site } from "@data/site";
import { Container } from "@/components/ui/primitives";

const year = new Date().getFullYear();
const payments = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"];

export function Footer() {
  return (
    <footer className="bg-inverse text-on-inverse">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-12 pt-20 pb-10 md:grid-cols-6 lg:grid-cols-12">
        <div className="col-span-2 md:col-span-6 lg:col-span-4">
          <p className="font-display text-4xl tracking-tight">
            {site.name.toLowerCase()}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-75">{site.description}</p>
          <dl className="mt-8 space-y-1.5 text-sm">
            <div className="flex gap-3">
              <dt className="sr-only">Email</dt>
              <dd>
                <a href={`mailto:${site.contact.email}`} className="hover:underline">
                  {site.contact.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="sr-only">Phone</dt>
              <dd>
                <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`} className="hover:underline">
                  {site.contact.phone}
                </a>
              </dd>
            </div>
            <div className="flex gap-3 opacity-75">
              <dt className="sr-only">Opening hours</dt>
              <dd>{site.contact.hours}</dd>
            </div>
          </dl>
        </div>

        {footerNav.map((col) => (
          <nav key={col.title} aria-label={col.title} className="md:col-span-2">
            <p className="mb-5 font-mono text-[11px] tracking-[0.16em] uppercase opacity-60">{col.title}</p>
            <ul className="space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="opacity-85 transition-opacity hover:underline hover:opacity-100">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-2">
          <p className="mb-5 font-mono text-[11px] tracking-[0.16em] uppercase opacity-60">Follow</p>
          <ul className="space-y-3 text-sm">
            {site.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-85 hover:underline hover:opacity-100"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col gap-6 border-t border-on-inverse/15 py-8 text-xs md:flex-row md:items-center md:justify-between">
        <p className="opacity-70">
          © {year} {site.name}. All rights reserved.
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
          {payments.map((p) => (
            <li
              key={p}
              className="rounded-sm border border-on-inverse/20 px-2 py-1 font-mono text-[10px] tracking-wider opacity-80"
            >
              {p}
            </li>
          ))}
        </ul>
        <ul className="flex gap-5">
          {legalNav.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="opacity-70 hover:underline hover:opacity-100">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
