import type { Metadata } from "next";
import { site } from "@data/site";
import { Newsletter } from "@/components/sections/newsletter";
import { Countdown } from "@/components/ui/countdown";
import { Photo } from "@/components/ui/photo";

export const metadata: Metadata = {
  title: "Coming soon",
  description: site.comingSoon.text,
};

/** Pre-launch landing page: no store navigation, just the announcement and a signup. */
export default function ComingSoonPage() {
  const cs = site.comingSoon;
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-inverse text-white">
      <Photo name={cs.image} fill priority sizes="100vw" className="object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />

      <div className="relative mx-auto flex w-full max-w-site flex-1 flex-col px-4 py-8 sm:px-6 lg:px-10">
        <p className="font-display text-3xl tracking-tight">
          {site.name.toLowerCase()}
          <span className="opacity-60">.</span>
        </p>

        <div className="my-auto max-w-3xl py-16">
          <p className="mb-6 font-mono text-[11px] tracking-[0.18em] uppercase opacity-80">Opening soon</p>
          <h1 className="display-xl">{cs.title}</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed opacity-85">{cs.text}</p>
          <Countdown endsAt={cs.launchAt} repeatEveryDays={cs.repeatEveryDays} className="mt-12" />
          <div className="mt-12 max-w-md">
            <Newsletter variant="inline" />
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <ul className="flex gap-6 text-sm">
            {site.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:underline hover:opacity-100"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${site.contact.email}`} className="text-sm opacity-80 hover:underline hover:opacity-100">
            {site.contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}
