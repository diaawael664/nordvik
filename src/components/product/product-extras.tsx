"use client";

/**
 * Product-page add-ons: back-in-stock alerts, delivery estimate, fabric
 * swatches, "Complete the look" sets and recently viewed products.
 * All are demo implementations backed by localStorage; each notes where to
 * connect a real service.
 */
import { Bell, Check, MapPin, Palette } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { bundles } from "@data/bundles";
import { ProductCarousel } from "@/components/product/product-carousel";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/controls";
import { Modal } from "@/components/ui/modal";
import { Photo } from "@/components/ui/photo";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import { track } from "@/lib/analytics";
import { getProduct, getProductById, products, type Product } from "@/lib/catalog";
import { estimateArrival, isZip } from "@/lib/delivery";
import { createPersistentStore } from "@/lib/persistent-store";
import {
  MAX_SWATCHES,
  clearSwatches,
  requestRestock,
  toggleSwatch,
  useRecentlyViewed,
  useRestockRequests,
  useSwatchTray,
} from "@/lib/stores";
import { useHydrated } from "@/lib/use-hydrated";
import { cn, formatPrice } from "@/lib/utils";
import { email as emailRule, focusFirstError, formValues, required, validate } from "@/lib/validate";
import { defaultSelection } from "./product-card";

/* ── Back in stock ───────────────────────────────────────────────────────── */

/** Shown instead of "Add to cart" when a product is sold out. Connect to your email tool. */
export function BackInStock({ product }: { product: Product }) {
  const requests = useRestockRequests();
  const hydrated = useHydrated();
  const [error, setError] = useState("");
  const saved = hydrated ? requests[product.id] : undefined;

  if (saved) {
    return (
      <p className="flex items-start gap-2 border border-line bg-surface p-4 text-sm" role="status">
        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
        <span>
          We&apos;ll email <strong>{saved}</strong> as soon as the {product.name} is back.
        </span>
      </p>
    );
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("email") ?? "");
    const msg = emailRule(value, {});
    setError(msg);
    if (msg) return;
    requestRestock(product.id, value.trim());
    track("generate_lead", { lead_type: "back_in_stock", items: [{ product }] });
  };

  return (
    <form onSubmit={submit} noValidate className="border border-line bg-surface p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-medium">
        <Bell className="size-4 text-accent" /> Get an email when it&apos;s back
      </p>
      <div className="flex gap-2">
        <label htmlFor={`restock-${product.id}`} className="sr-only">
          Email address
        </label>
        <input
          id={`restock-${product.id}`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `restock-${product.id}-msg` : undefined}
          className={cn(
            "h-11 min-w-0 flex-1 rounded-base border bg-bg px-3 text-sm outline-none focus:border-ink",
            error ? "border-wood" : "border-line",
          )}
        />
        <Button type="submit">Notify me</Button>
      </div>
      {error && (
        <p id={`restock-${product.id}-msg`} className="mt-2 text-xs text-wood">
          {error}
        </p>
      )}
    </form>
  );
}

/* ── Delivery estimate ───────────────────────────────────────────────────── */

const zipStore = createPersistentStore<string>("nordhaus:zip", "");
const dateFmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });

export function DeliveryEstimate({ product }: { product: Product }) {
  const savedZip = useSyncExternalStore(zipStore.subscribe, zipStore.getSnapshot, zipStore.getServerSnapshot);
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState("");
  const zip = draft ?? savedZip;
  const hydrated = useHydrated();
  const range = hydrated && isZip(savedZip) ? estimateArrival(product.leadTime, savedZip) : null;

  if (product.stock === 0) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isZip(zip)) return setError("Enter a 5-digit ZIP code.");
    setError("");
    zipStore.set(zip.trim());
    setDraft(null);
  };

  return (
    <div className="text-sm">
      {range ? (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <MapPin className="size-4 text-accent" strokeWidth={1.5} />
          <span>
            Arrives <strong>{dateFmt.format(range[0])}</strong> – <strong>{dateFmt.format(range[1])}</strong> to{" "}
            {savedZip}
          </span>
          <button type="button" onClick={() => zipStore.set("")} className="text-xs text-muted underline">
            Change
          </button>
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-wrap items-center gap-2">
          <label htmlFor={`zip-${product.id}`} className="flex items-center gap-2 text-muted">
            <MapPin className="size-4 text-accent" strokeWidth={1.5} /> Delivery date for ZIP
          </label>
          <input
            id={`zip-${product.id}`}
            inputMode="numeric"
            maxLength={5}
            value={zip}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
            placeholder="11211"
            aria-invalid={error ? true : undefined}
            className="h-9 w-24 rounded-base border border-line bg-surface px-3 font-mono text-sm outline-none focus:border-ink"
          />
          <button type="submit" className="h-9 border border-ink px-3 text-xs hover:bg-ink hover:text-bg">
            Check
          </button>
          {error && <span className="w-full text-xs text-wood">{error}</span>}
        </form>
      )}
    </div>
  );
}

/* ── Fabric swatches ─────────────────────────────────────────────────────── */

const FABRICS = ["Velvet", "Bouclé", "Linen", "Wool", "Leather", "Cotton"];
export const hasFabric = (p: Product) => p.materials.some((m) => FABRICS.includes(m));

/** "Order free swatches" button + dialog. Collects up to 6 colors across products. */
export function SwatchRequest({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const tray = useSwatchTray();
  const { notify } = useUI();
  if (!hasFabric(product)) return null;

  // Every fabric colorway in the catalog, this product's first.
  const all = [
    ...product.colors.map((c) => ({ ...c, product: product.name })),
    ...products
      .filter((p) => p.id !== product.id && hasFabric(p))
      .flatMap((p) => p.colors.map((c) => ({ ...c, product: p.name }))),
  ].filter((c, i, arr) => arr.findIndex((x) => x.name === c.name) === i);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = formValues(e.currentTarget);
    const next = validate(values, {
      name: [required("Enter your name.")],
      email: [required("Enter your email address."), emailRule],
      address: [required("Enter the address to post your swatches to.")],
    });
    if (tray.length === 0) next.swatches = "Choose at least one swatch.";
    setErrors(next);
    if (Object.keys(next).length) return focusFirstError(e.currentTarget, next);
    setSent(values.email);
    clearSwatches();
    notify("Swatches requested");
    track("generate_lead", { lead_type: "swatches" });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSent(null);
          setOpen(true);
        }}
        className="flex items-center gap-2 text-sm underline underline-offset-4"
      >
        <Palette className="size-4 text-accent" strokeWidth={1.5} /> Order up to {MAX_SWATCHES} free fabric swatches
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label="Order free fabric swatches" className="max-w-2xl">
        <div className="p-6 sm:p-10">
          <h2 className="display-md">Free fabric swatches</h2>
          {sent ? (
            <p className="mt-6 text-muted" role="status">
              Your swatches are on their way. We&apos;ll email <strong className="text-ink">{sent}</strong> when they
              ship, usually within two working days.
            </p>
          ) : (
            <form onSubmit={submit} noValidate>
              <p className="mt-3 text-muted">
                Pick up to {MAX_SWATCHES}. We post them free, so you can see the color in your own light.
              </p>
              <fieldset className="mt-6">
                <legend className="mb-3 text-sm">
                  {tray.length} of {MAX_SWATCHES} chosen
                </legend>
                <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {all.map((c) => {
                    const on = tray.some((t) => t.name === c.name);
                    const full = !on && tray.length >= MAX_SWATCHES;
                    return (
                      <li key={c.name}>
                        <button
                          type="button"
                          aria-pressed={on}
                          disabled={full}
                          onClick={() => toggleSwatch({ name: c.name, hex: c.hex, product: c.product })}
                          className={cn(
                            "w-full border p-2 text-left transition-colors disabled:opacity-40",
                            on ? "border-ink" : "border-line hover:border-ink",
                          )}
                        >
                          <span className="relative block aspect-square" style={{ background: c.hex }}>
                            {on && (
                              <Check className="absolute top-1 right-1 size-4 rounded-full bg-bg p-0.5 text-ink" />
                            )}
                          </span>
                          <span className="mt-2 block truncate text-xs">{c.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {errors.swatches && <p className="mt-2 text-xs text-wood">{errors.swatches}</p>}
              </fieldset>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" autoComplete="name" required error={errors.name} />
                <Field label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
                <Field
                  label="Postal address"
                  name="address"
                  autoComplete="street-address"
                  required
                  error={errors.address}
                  className="sm:col-span-2"
                />
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full">
                Send my swatches
              </Button>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}

/* ── Complete the look ───────────────────────────────────────────────────── */

export function CompleteTheLook({ product }: { product: Product }) {
  const { add } = useCart();
  const { open, notify } = useUI();
  const sets = bundles.filter((b) => b.products.includes(product.slug));
  if (sets.length === 0) return null;

  return (
    <section aria-label="Complete the look" className="mt-20 space-y-10 md:mt-28">
      {sets.map((set) => {
        const items = set.products.flatMap((s) => getProduct(s) ?? []);
        const full = items.reduce((sum, p) => sum + p.price, 0);
        const saving = Math.round((full * set.percent) / 100);
        const available = items.every((p) => p.stock > 0);
        return (
          <div key={set.id} className="border border-line p-6 sm:p-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-3">Complete the look · save {set.percent}%</p>
                <h2 className="display-md">{set.title}</h2>
              </div>
            </div>
            <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <ul className="grid grid-cols-3 gap-3 sm:gap-6">
                {items.map((p, i) => (
                  <li key={p.id} className="relative">
                    <Link href={`/product/${p.slug}/`} className="group block">
                      <span className="relative block aspect-[4/5] overflow-hidden bg-sand">
                        <Photo
                          name={p.images[0]}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 18vw, 30vw"
                          className="object-cover"
                        />
                      </span>
                      <span className="mt-3 block text-sm leading-snug group-hover:underline">{p.name}</span>
                      <span className="text-sm text-muted">{formatPrice(p.price)}</span>
                    </Link>
                    {i < items.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute top-[38%] -right-3 hidden font-display text-2xl text-muted sm:-right-5 sm:block"
                      >
                        +
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="lg:w-72">
                <p className="text-sm text-muted">
                  <s>{formatPrice(full)}</s>
                </p>
                <p className="font-display text-3xl">{formatPrice(full - saving)}</p>
                <p className="mt-1 text-sm text-accent">You save {formatPrice(saving)} on the set</p>
                <Button
                  size="lg"
                  className="mt-5 w-full"
                  disabled={!available}
                  onClick={() => {
                    items.forEach((p) => add({ productId: p.id, ...defaultSelection(p) }));
                    notify(`Added ${set.title.toLowerCase()} to your cart`);
                    open("cart");
                  }}
                >
                  {available ? "Add the set to cart" : "One piece is sold out"}
                </Button>
                <p className="mt-2 text-xs text-muted">The saving applies automatically in your cart.</p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* ── Recently viewed ─────────────────────────────────────────────────────── */

export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const ids = useRecentlyViewed();
  const hydrated = useHydrated();
  const items = ids.filter((id) => id !== exclude).flatMap((id) => getProductById(id) ?? []);
  if (!hydrated || items.length === 0) return null;
  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Your history" title="Recently viewed" />
        <ProductCarousel products={items.slice(0, 8)} label="Recently viewed" />
      </Container>
    </section>
  );
}
