"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { site } from "@data/site";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Photo } from "@/components/ui/photo";
import { useUI } from "@/context/ui-context";
import { track } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";
import { createPersistentStore } from "@/lib/persistent-store";
import { email as emailRule } from "@/lib/validate";

/** When the pop-up was last dismissed or completed (ISO date), per visitor. */
const seenStore = createPersistentStore<string | null>("nordhaus:newsletter-popup", null);

/**
 * Timed newsletter sign-up with a first-order offer.
 * - Waits `delaySeconds`, and never interrupts an open drawer or dialog.
 * - Waits for the cookie choice first, so the two never stack.
 * - Then stays away for `daysBetween` days.
 * Settings: `site.newsletter.popup` in data/site.ts.
 */
export function NewsletterPopup() {
  const cfg = site.newsletter.popup;
  const { panel, quickView } = useUI();
  const consent = useConsent();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const pathname = usePathname();
  // Never on distraction-free pages.
  const allowed = !pathname.startsWith("/checkout") && !pathname.startsWith("/coming-soon");
  const busy = panel !== null || quickView !== null;
  const consentDone = !site.analytics.cookieBanner || consent !== null;

  useEffect(() => {
    if (!cfg.enabled || !allowed || !consentDone || busy) return;
    const seen = seenStore.getSnapshot();
    if (seen && Date.now() - new Date(seen).getTime() < cfg.daysBetween * 86_400_000) return;
    const t = window.setTimeout(() => setOpen(true), cfg.delaySeconds * 1000);
    return () => window.clearTimeout(t);
  }, [cfg.enabled, cfg.daysBetween, cfg.delaySeconds, allowed, consentDone, busy]);

  const close = () => {
    seenStore.set(new Date().toISOString());
    setOpen(false);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("email") ?? "");
    const msg = emailRule(value, {});
    setError(msg);
    if (msg) return;
    setDone(true);
    seenStore.set(new Date().toISOString());
    track("generate_lead", { lead_type: "newsletter_popup" });
  };

  const code = site.promoCodes[0];

  return (
    <Modal open={open} onClose={close} label="Newsletter sign-up" className="max-w-3xl">
      <div className="grid sm:grid-cols-2">
        <div className="relative hidden min-h-96 bg-sand sm:block">
          <Photo name={site.newsletter.image} fill sizes="400px" className="object-cover" />
        </div>
        <div className="p-7 sm:p-10">
          <p className="eyebrow mb-3">{site.newsletter.title}</p>
          {done ? (
            <div role="status">
              <h2 className="display-md">Welcome in</h2>
              <p className="mt-3 text-muted">Use this code at checkout for {code.description.toLowerCase()}:</p>
              <p className="mt-5 border border-dashed border-accent px-4 py-3 text-center font-mono text-lg tracking-widest">
                {code.code}
              </p>
              <Button className="mt-6 w-full" onClick={close}>
                Start shopping
              </Button>
            </div>
          ) : (
            <>
              <h2 className="display-md">{cfg.offer}</h2>
              <p className="mt-3 leading-relaxed text-muted">{site.newsletter.text}</p>
              <form onSubmit={submit} noValidate className="mt-6 space-y-3">
                <label htmlFor="popup-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="popup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  data-autofocus
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "popup-email-msg" : undefined}
                  className="h-12 w-full rounded-base border border-line bg-surface px-4 text-sm outline-none focus:border-ink"
                />
                {error && (
                  <p id="popup-email-msg" className="text-xs text-wood">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" className="w-full">
                  Get my code
                </Button>
              </form>
              <button type="button" onClick={close} className="mt-4 text-xs text-muted underline underline-offset-4">
                No thanks
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
