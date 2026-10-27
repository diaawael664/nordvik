"use client";

import { useState } from "react";
import { site } from "@data/site";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Container } from "@/components/ui/primitives";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter signup. Demo only: validates the address and shows a
 * confirmation. Connect `onSubmit` to your email provider's API.
 */
export function Newsletter({ variant = "split" }: { variant?: "split" | "band" | "inline" }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email)) {
      setError("Enter an email address like name@example.com.");
      return;
    }
    setError("");
    setDone(true);
    track("generate_lead", { lead_type: "newsletter" });
  };

  const form = done ? (
    <p className="text-base" role="status">
      You’re subscribed. The next letter arrives at <strong>{email}</strong> at the start of the month.
    </p>
  ) : (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex border-b border-current pb-1">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="h-12 flex-1 bg-transparent text-base outline-none placeholder:text-current placeholder:opacity-60"
        />
        <Button type="submit" variant="ghost" className="px-3 text-current hover:bg-transparent hover:underline">
          Subscribe
        </Button>
      </div>
      <p
        id="newsletter-error"
        className={cn(
          "mt-2 min-h-5 text-xs",
          error ? (variant === "inline" ? "font-semibold" : "text-wood") : "opacity-60",
        )}
      >
        {error || "No spam. Unsubscribe with one click."}
      </p>
    </form>
  );

  // Just the form, for custom layouts such as the Coming Soon page.
  if (variant === "inline") return form;

  if (variant === "band") {
    return (
      <section aria-labelledby="newsletter-title" className="bg-sand py-20">
        <Container className="flex flex-col items-center text-center">
          <p className="eyebrow mb-4">Newsletter</p>
          <h2 id="newsletter-title" className="display-md max-w-xl">
            {site.newsletter.title}
          </h2>
          <p className="mt-4 mb-8 max-w-md text-muted">{site.newsletter.text}</p>
          {form}
        </Container>
      </section>
    );
  }

  return (
    <section aria-labelledby="newsletter-title" className="grid bg-sand md:grid-cols-2">
      <div className="relative min-h-72 md:min-h-[32rem]">
        <Photo name={site.newsletter.image} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center px-4 py-16 sm:px-10 lg:px-20">
        <p className="eyebrow mb-4">Newsletter</p>
        <h2 id="newsletter-title" className="display-md max-w-md">
          {site.newsletter.title}
        </h2>
        <p className="mt-4 mb-10 max-w-md leading-relaxed text-muted">{site.newsletter.text}</p>
        {form}
      </div>
    </section>
  );
}
