"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@data/site";
import { Button } from "@/components/ui/button";
import { setConsent, useConsent } from "@/lib/consent";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * Cookie consent banner. Analytics events (src/lib/analytics.ts) wait for the
 * visitor's choice. The cart and wishlist use browser storage that's strictly
 * necessary for the shop to work, so they don't need consent.
 * Turn the banner off with `site.analytics.cookieBanner = false`.
 */
export function CookieBanner() {
  const hydrated = useHydrated();
  const consent = useConsent();
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  if (!site.analytics.cookieBanner || !hydrated || consent) return null;

  return (
    <section
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-[55] max-w-md border border-line bg-bg p-5 text-ink shadow-2xl sm:right-auto sm:bottom-5 sm:left-5 sm:p-6"
    >
      <p className="font-display text-xl">Cookies, kept to a minimum</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        We use cookies to understand which pages help people choose, and to show relevant offers. Your cart works either
        way.{" "}
        <Link href="/cookies/" className="text-ink underline underline-offset-4">
          Cookie details
        </Link>
      </p>

      {customizing && (
        <fieldset className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
          <legend className="sr-only">Cookie categories</legend>
          <label className="flex items-center justify-between gap-4 text-muted">
            Necessary (cart, wishlist, preferences)
            <input type="checkbox" checked disabled className="size-4" />
          </label>
          <label className="flex items-center justify-between gap-4">
            Analytics: how the site is used
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            Marketing: offers on other sites
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
          </label>
        </fieldset>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {customizing ? (
          <Button size="sm" onClick={() => setConsent(analytics, marketing)}>
            Save choices
          </Button>
        ) : (
          <>
            <Button size="sm" onClick={() => setConsent(true, true)}>
              Accept all
            </Button>
            <Button size="sm" variant="outline" onClick={() => setConsent(false, false)}>
              Reject optional
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCustomizing(true)}>
              Customize
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
