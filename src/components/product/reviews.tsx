"use client";

import { BadgeCheck, Star } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Product } from "@/lib/catalog";
import { getReviews } from "@data/reviews";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/controls";
import { Rating } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

/** Approximate star distribution for the demo summary bars, derived from the average. */
function distribution(avg: number) {
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const five = clamp(0.15 + (avg - 4) * 0.75);
  const four = clamp((1 - five) * 0.7);
  const three = (1 - five - four) * 0.6;
  const two = (1 - five - four - three) * 0.6;
  return [five, four, three, two, 1 - five - four - three - two];
}

export function Reviews({ product }: { product: Product }) {
  const reviews = getReviews(product);
  const [writing, setWriting] = useState(false);
  const dist = distribution(product.rating);
  const hasRatings = product.reviewCount > 0;

  return (
    <div className="grid gap-12 lg:grid-cols-[18rem_1fr] lg:gap-20">
      <div>
        {!hasRatings && <p className="font-display text-2xl">No reviews yet</p>}
        {hasRatings && <p className="font-display text-6xl leading-none">{product.rating.toFixed(1)}</p>}
        {hasRatings && <Rating value={product.rating} className="mt-3" />}
        <p className="mt-2 text-sm text-muted">
          {hasRatings ? `Based on ${product.reviewCount} reviews` : "Be the first to review this piece."}
        </p>
        <ul className={cn("mt-6 space-y-2", !hasRatings && "hidden")} aria-label="Rating breakdown">
          {dist.map((share, i) => (
            <li key={i} className="flex items-center gap-3 text-xs">
              <span className="w-8 font-mono">{5 - i} ★</span>
              <span className="h-1 flex-1 bg-sand">
                <span className="block h-full bg-wood" style={{ width: `${share * 100}%` }} />
              </span>
              <span className="w-9 text-right font-mono text-muted">{Math.round(share * 100)}%</span>
            </li>
          ))}
        </ul>
        <Button variant="outline" className="mt-8 w-full" onClick={() => setWriting((w) => !w)} aria-expanded={writing}>
          {writing ? "Cancel" : "Write a review"}
        </Button>
      </div>

      <div>
        {writing && <ReviewForm productName={product.name} onDone={() => setWriting(false)} />}
        <ul className="divide-y divide-line">
          {reviews.map((r) => (
            <li key={r.author + r.date} className="py-8 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Rating value={r.rating} />
                <time dateTime={r.date} className="font-mono text-[11px] text-muted">
                  {dateFmt.format(new Date(r.date))}
                </time>
              </div>
              <h4 className="mt-4 font-sans text-base font-semibold">{r.title}</h4>
              <p className="mt-2 leading-relaxed text-muted">{r.body}</p>
              <p className="mt-4 flex items-center gap-2 text-sm">
                {r.author} <span className="text-muted">· {r.location}</span>
                {r.verified && (
                  <span className="flex items-center gap-1 text-xs text-accent">
                    <BadgeCheck className="size-3.5" /> Verified buyer
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Demo form: validates input and shows a confirmation. Connect to your reviews provider. */
function ReviewForm({ productName, onDone }: { productName: string; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!rating) next.rating = "Choose a star rating.";
    if (!String(data.get("title")).trim()) next.title = "Add a short title.";
    if (String(data.get("body")).trim().length < 20) next.body = "Write at least 20 characters.";
    if (!String(data.get("name")).trim()) next.name = "Enter the name to show with your review.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className="mb-10 border border-line bg-surface p-6" role="status">
        <p className="font-display text-xl">Thanks for reviewing the {productName}</p>
        <p className="mt-2 text-sm text-muted">
          Your review will appear here once our team has checked it, usually within two days.
        </p>
        <Button variant="link" className="mt-3" onClick={onDone}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mb-12 space-y-5 border border-line bg-surface p-6 sm:p-8">
      <fieldset>
        <legend className="mb-2 text-sm">
          Your rating <span aria-hidden>*</span>
        </legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" name="rating" value={n} className="peer sr-only" onChange={() => setRating(n)} />
              <Star
                className={cn(
                  "size-7 rounded-sm peer-focus-visible:outline-2 peer-focus-visible:outline-accent",
                  n <= rating ? "fill-wood text-wood" : "text-line",
                )}
                strokeWidth={1.25}
              />
              <span className="sr-only">
                {n} star{n > 1 && "s"}
              </span>
            </label>
          ))}
        </div>
        {errors.rating && <p className="mt-2 text-xs text-wood">{errors.rating}</p>}
      </fieldset>
      <Field label="Title" name="title" required error={errors.title} placeholder="Sum it up in a few words" />
      <div>
        <label htmlFor="review-body" className="mb-2 block text-sm">
          Review{" "}
          <span className="text-muted" aria-hidden>
            *
          </span>
        </label>
        <textarea
          id="review-body"
          name="body"
          rows={4}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? "review-body-msg" : undefined}
          className={cn(
            "w-full rounded-base border bg-bg px-4 py-3 text-sm outline-none focus:border-ink",
            errors.body ? "border-wood" : "border-line",
          )}
          placeholder="How does it look, feel and hold up?"
        />
        {errors.body && (
          <p id="review-body-msg" className="mt-2 text-xs text-wood">
            {errors.body}
          </p>
        )}
      </div>
      <Field label="Display name" name="name" required error={errors.name} autoComplete="given-name" />
      <Button type="submit">Submit review</Button>
    </form>
  );
}
