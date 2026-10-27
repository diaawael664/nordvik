"use client";

import { Lock, Tag, X } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { site } from "@data/site";
import { useCart } from "@/context/cart-context";
import { cn, formatPrice } from "@/lib/utils";

/** Two-decimal money for totals (prices elsewhere are whole numbers). */
const money = (n: number) =>
  new Intl.NumberFormat(site.locale, { style: "currency", currency: site.currency }).format(n);

/** Totals block shared by the cart and checkout pages. */
export function OrderTotals({ className }: { className?: string }) {
  const { subtotal, discount, promo, bundleSavings, shipping, tax, total } = useCart();
  const row = (label: ReactNode, value: string, muted = false) => (
    <div className={cn("flex justify-between gap-4 text-sm", muted && "text-muted")}>
      <dt>{label}</dt>
      <dd className="font-mono tabular-nums">{value}</dd>
    </div>
  );
  return (
    <dl className={cn("space-y-3", className)}>
      {row("Subtotal", money(subtotal))}
      {bundleSavings.map((b) => (
        <div key={b.bundle.id}>{row(`Set saving: ${b.bundle.title}`, `−${money(b.amount)}`)}</div>
      ))}
      {promo && row(`Discount (${promo.code})`, `−${money(discount)}`)}
      {row("Delivery", shipping === 0 ? "Free" : money(shipping))}
      {row(`Estimated tax (${Math.round(site.taxRate * 100)}%)`, money(tax), true)}
      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <dt className="text-base">Total</dt>
        <dd className="font-display text-2xl tabular-nums">{money(total)}</dd>
      </div>
    </dl>
  );
}

/** Promo code entry. Demo codes live in data/site.ts. */
export function PromoForm() {
  const { promo, applyPromo, removePromo } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (promo) {
    return (
      <div className="flex items-center justify-between gap-3 border border-dashed border-accent/60 px-4 py-3 text-sm">
        <span className="flex items-center gap-2">
          <Tag className="size-4 text-accent" strokeWidth={1.5} />
          <span>
            <strong className="font-mono">{promo.code}</strong> — {promo.description}
          </span>
        </span>
        <button
          type="button"
          onClick={removePromo}
          aria-label={`Remove code ${promo.code}`}
          className="text-muted hover:text-ink"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return setError("Enter a code.");
    if (!applyPromo(code)) return setError(`“${code.trim()}” isn't a valid code. Check the spelling and try again.`);
    setError("");
    setCode("");
  };

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="promo" className="mb-2 block text-sm">
        Discount code
      </label>
      <div className="flex gap-2">
        <input
          id="promo"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. WELCOME10"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "promo-msg" : "promo-hint"}
          className={cn(
            "h-11 min-w-0 flex-1 rounded-base border bg-surface px-3 font-mono text-sm uppercase outline-none placeholder:normal-case focus:border-ink",
            error ? "border-wood" : "border-line",
          )}
        />
        <button
          type="submit"
          className="h-11 shrink-0 border border-ink px-4 text-sm transition-colors hover:bg-ink hover:text-bg"
        >
          Apply
        </button>
      </div>
      <p id={error ? "promo-msg" : "promo-hint"} className={cn("mt-2 text-xs", error ? "text-wood" : "text-muted")}>
        {error || "Try WELCOME10 for 10% off (demo)."}
      </p>
    </form>
  );
}

export function SecureNote() {
  return (
    <p className="flex items-center justify-center gap-2 text-xs text-muted">
      <Lock className="size-3.5" strokeWidth={1.5} /> Secure, encrypted checkout
    </p>
  );
}

export function FreeShippingMeter() {
  const { subtotal, toFreeShipping } = useCart();
  const progress = Math.min(100, (subtotal / site.freeShippingThreshold) * 100);
  return (
    <div>
      <p className="text-sm">
        {toFreeShipping > 0 ? (
          <>
            You&apos;re <strong className="font-semibold">{formatPrice(toFreeShipping)}</strong> away from free delivery
          </>
        ) : (
          "Your order qualifies for free white-glove delivery"
        )}
      </p>
      <div
        className="mt-3 h-1 overflow-hidden bg-sand"
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
