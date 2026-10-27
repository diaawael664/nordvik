"use client";

import { Button } from "@/components/ui/button";
import { consentStore, useConsent } from "@/lib/consent";
import { useHydrated } from "@/lib/use-hydrated";

/** Shows the visitor's current choice and reopens the cookie banner. */
export function CookieSettingsButton() {
  const consent = useConsent();
  const hydrated = useHydrated();
  const summary = !hydrated
    ? ""
    : !consent
      ? "You haven't chosen yet."
      : `Analytics: ${consent.analytics ? "on" : "off"}. Marketing: ${consent.marketing ? "on" : "off"}.`;

  return (
    <div className="my-8 flex flex-wrap items-center gap-4 border border-line bg-surface p-5">
      <Button variant="outline" onClick={() => consentStore.set(null)}>
        Change cookie settings
      </Button>
      <p className="text-sm text-muted" aria-live="polite">
        {summary}
      </p>
    </div>
  );
}
