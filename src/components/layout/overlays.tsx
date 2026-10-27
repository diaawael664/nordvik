"use client";

/**
 * Global overlays: search, mobile menu and mini cart. Rendered once in the
 * root layout and opened through `useUI().open(...)`.
 */
import { ArrowRight, ChevronDown, Search, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getCategory } from "@/lib/catalog";
import { mainNav } from "@data/navigation";
import { products } from "@/lib/catalog";
import { site } from "@data/site";
import { CheckoutButton } from "@/components/cart/checkout-button";
import { ButtonLink } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/controls";
import { Drawer } from "@/components/ui/drawer";
import { Photo } from "@/components/ui/photo";
import { Price } from "@/components/ui/primitives";
import { useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import { track } from "@/lib/analytics";
import { cn, formatPrice } from "@/lib/utils";
import { ThemeToggle } from "./brand";

/* ── Search ──────────────────────────────────────────────────────────────── */

const popular = ["Sofa", "Oak", "Pendant", "Bouclé", "Rug"];

/** Matches name, category, material and color names; every word must match. */
export function searchProducts(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return products.filter((p) => {
    const haystack = [p.name, getCategory(p.category)?.name, ...p.materials, ...p.colors.map((c) => c.name)]
      .join(" ")
      .toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

export function SearchOverlay() {
  const { panel, close } = useUI();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchProducts(query), [query]);

  const submit = (q: string) => {
    track("search", { search_term: q });
    close();
    router.push(`/shop/?q=${encodeURIComponent(q)}`);
  };

  return (
    <Drawer open={panel === "search"} onClose={close} title="Search" side="top">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) submit(query.trim());
          }}
          className="flex items-center gap-3 border-b border-ink pb-3"
        >
          <Search className="size-5 shrink-0 text-muted" strokeWidth={1.5} />
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            data-autofocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sofas, oak, lighting…"
            autoComplete="off"
            className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-muted/60 sm:text-3xl [&::-webkit-search-cancel-button]:appearance-none"
          />
        </form>

        {query.trim() === "" ? (
          <div className="mt-8">
            <p className="eyebrow mb-4">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {popular.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="h-9 rounded-full border border-line px-4 text-sm transition-colors hover:border-ink"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="mt-8 text-muted">
            No products match “{query}”. Try a material such as oak or linen, or browse{" "}
            <Link href="/shop/" onClick={close} className="text-ink underline underline-offset-4">
              all products
            </Link>
            .
          </p>
        ) : (
          <div className="mt-8">
            <p className="eyebrow mb-4" aria-live="polite">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>
            <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {results.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <Link href={`/product/${p.slug}/`} onClick={close} className="group flex items-center gap-4">
                    <span className="relative size-16 shrink-0 overflow-hidden bg-sand">
                      <Photo name={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium group-hover:underline">{p.name}</span>
                      <span className="text-sm text-muted">{formatPrice(p.price)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {results.length > 6 && (
              <button
                type="button"
                onClick={() => submit(query)}
                className="mt-6 inline-flex items-center gap-2 text-sm underline underline-offset-4"
              >
                See all {results.length} results <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}

/* ── Mobile menu ─────────────────────────────────────────────────────────── */

export function MobileMenu() {
  const { panel, close } = useUI();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Drawer
      open={panel === "menu"}
      onClose={close}
      title="Menu"
      side="left"
      footer={
        <div className="flex items-center justify-between text-sm">
          <Link href="/account/" onClick={close} className="underline underline-offset-4">
            Sign in / Register
          </Link>
          <ThemeToggle />
        </div>
      }
    >
      <nav aria-label="Mobile">
        <ul className="divide-y divide-line">
          {mainNav.map((item) => (
            <li key={item.label}>
              {item.mega ? (
                <>
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                    aria-expanded={expanded === item.label}
                    className="flex w-full items-center justify-between px-5 py-4 font-display text-xl"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn("size-4 transition-transform", expanded === item.label && "rotate-180")}
                    />
                  </button>
                  {expanded === item.label && (
                    <div className="space-y-6 px-5 pb-6">
                      {item.mega.columns.map((col) => (
                        <div key={col.title}>
                          <p className="eyebrow mb-3">{col.title}</p>
                          <ul className="space-y-2.5">
                            {col.links.map((l) => (
                              <li key={l.label}>
                                <Link href={l.href} onClick={close} className="text-[15px]">
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href} onClick={close} className="block px-5 py-4 font-display text-xl">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </Drawer>
  );
}

/* ── Mini cart ───────────────────────────────────────────────────────────── */

export function MiniCart() {
  const { panel, close } = useUI();
  const { lines, subtotal, toFreeShipping, setQuantity, remove, count } = useCart();
  const progress = Math.min(100, (subtotal / site.freeShippingThreshold) * 100);

  return (
    <Drawer
      open={panel === "cart"}
      onClose={close}
      title={count ? `Your cart (${count})` : "Your cart"}
      footer={
        lines.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm">Subtotal</span>
              <span className="font-display text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted">Shipping and taxes are calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href="/cart/" variant="outline" onClick={close}>
                View cart
              </ButtonLink>
              <CheckoutButton onNavigate={close} />
            </div>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-5 px-8 py-16 text-center">
          <ShoppingBag className="size-10 text-muted" strokeWidth={1} />
          <div>
            <p className="font-display text-2xl">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted">Start with our best sellers, or browse by room.</p>
          </div>
          <ButtonLink href="/shop/" onClick={close}>
            Shop all products
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="border-b border-line px-5 py-4 sm:px-6">
            <p className="text-sm">
              {toFreeShipping > 0 ? (
                <>
                  Add <strong className="font-semibold">{formatPrice(toFreeShipping)}</strong> for free delivery
                </>
              ) : (
                "Your order ships free"
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
          <ul className="divide-y divide-line">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-4 px-5 py-5 sm:px-6">
                <Link
                  href={`/product/${line.product.slug}/`}
                  onClick={close}
                  className="relative h-24 w-20 shrink-0 overflow-hidden bg-sand"
                >
                  <Photo
                    name={line.product.images[0]}
                    alt={line.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <Link
                      href={`/product/${line.product.slug}/`}
                      onClick={close}
                      className="text-sm font-medium hover:underline"
                    >
                      {line.product.name}
                    </Link>
                    <Price price={line.lineTotal} size="sm" />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {[line.color, ...Object.values(line.options ?? {})].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QuantityStepper
                      size="sm"
                      value={line.quantity}
                      min={0}
                      onChange={(q) => setQuantity(line.key, q)}
                      label={`Quantity of ${line.product.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => remove(line.key)}
                      className="grid size-9 place-items-center text-muted transition-colors hover:text-ink"
                      aria-label={`Remove ${line.product.name}`}
                    >
                      <Trash2 className="size-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Drawer>
  );
}
