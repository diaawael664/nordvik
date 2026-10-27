"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { bestSellers } from "@/lib/catalog";
import { CheckoutButton } from "@/components/cart/checkout-button";
import { FreeShippingMeter, OrderTotals, PromoForm, SecureNote } from "@/components/cart/order-summary";
import { ProductCarousel } from "@/components/product/product-carousel";
import { ButtonLink } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/controls";
import { Photo } from "@/components/ui/photo";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import { useWishlist } from "@/context/wishlist-context";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const hydrated = useHydrated();
  const { lines, count, setQuantity, remove } = useCart();
  const { has, toggle } = useWishlist();
  const { notify } = useUI();

  const recommendations = (
    <section className="mt-24 border-t border-line pt-16">
      <SectionHeading eyebrow="Before you go" title="Customers also bought" />
      <ProductCarousel products={bestSellers()} label="Customers also bought" />
    </section>
  );

  if (!hydrated) {
    return (
      <Container className="py-16">
        <h1 className="display-lg">Your cart</h1>
        <div className="mt-10 h-64 animate-pulse bg-sand/60" aria-label="Loading your cart" />
      </Container>
    );
  }

  if (lines.length === 0) {
    return (
      <Container className="py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <ShoppingBag className="size-12 text-muted" strokeWidth={1} />
          <h1 className="display-lg mt-6">Your cart is empty</h1>
          <p className="mt-4 max-w-md text-muted">
            Pieces you add will appear here. Start with our best sellers or browse by room.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop/" size="lg">
              Shop all products
            </ButtonLink>
            <ButtonLink href="/wishlist/" size="lg" variant="outline">
              View wishlist
            </ButtonLink>
          </div>
        </div>
        {recommendations}
      </Container>
    );
  }

  const moveToWishlist = (key: string, productId: string, name: string) => {
    if (!has(productId)) toggle(productId);
    remove(key);
    notify(`Moved ${name} to your wishlist`);
  };

  return (
    <Container className="py-12 md:py-16">
      <h1 className="display-lg">
        Your cart <span className="align-middle font-mono text-base text-muted">({count})</span>
      </h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
        <section aria-label="Items in your cart">
          <div className="hidden grid-cols-[1fr_12rem_7rem] gap-6 border-b border-line pb-3 font-mono text-[11px] tracking-wider text-muted uppercase md:grid">
            <span>Product</span>
            <span>Quantity</span>
            <span className="text-right">Total</span>
          </div>
          <ul className="divide-y divide-line border-b border-line">
            {lines.map((line) => {
              const href = `/product/${line.product.slug}/`;
              const variant = [line.color, ...Object.values(line.options ?? {})].filter(Boolean).join(" · ");
              return (
                <li
                  key={line.key}
                  className="grid grid-cols-[6rem_1fr] gap-x-5 gap-y-4 py-6 md:grid-cols-[1fr_12rem_7rem] md:items-center md:gap-6"
                >
                  <div className="row-span-3 flex gap-5 md:row-span-1 md:items-center">
                    <Link href={href} className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-sand md:w-28">
                      <Photo
                        name={line.product.images[0]}
                        alt={line.product.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="hidden md:block">
                      <LineInfo
                        href={href}
                        name={line.product.name}
                        variant={variant}
                        unit={line.unitPrice}
                        lead={line.product.leadTime}
                      />
                    </div>
                  </div>
                  <div className="md:hidden">
                    <LineInfo
                      href={href}
                      name={line.product.name}
                      variant={variant}
                      unit={line.unitPrice}
                      lead={line.product.leadTime}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:flex-col md:items-start">
                    <QuantityStepper
                      size="sm"
                      value={line.quantity}
                      min={0}
                      max={Math.max(1, line.product.stock)}
                      onChange={(q) => setQuantity(line.key, q)}
                      label={`Quantity of ${line.product.name}`}
                    />
                    <div className="flex gap-3 text-xs text-muted">
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        className="flex items-center gap-1 whitespace-nowrap hover:text-ink"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => moveToWishlist(line.key, line.productId, line.product.name)}
                        className="flex items-center gap-1 whitespace-nowrap hover:text-ink"
                      >
                        <Heart className="size-3.5" /> Save for later
                      </button>
                    </div>
                  </div>
                  <p className="col-start-2 font-display text-lg md:col-start-auto md:text-right">
                    {formatPrice(line.lineTotal)}
                  </p>
                </li>
              );
            })}
          </ul>
          <ButtonLink href="/shop/" variant="link" className="mt-6">
            Continue shopping
          </ButtonLink>
        </section>

        <aside aria-label="Order summary" className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-6 border border-line bg-surface p-6 sm:p-8">
            <h2 className="font-display text-2xl">Order summary</h2>
            <FreeShippingMeter />
            <PromoForm />
            <OrderTotals />
            <CheckoutButton />
            <SecureNote />
          </div>
        </aside>
      </div>

      {recommendations}
    </Container>
  );
}

function LineInfo({
  href,
  name,
  variant,
  unit,
  lead,
}: {
  href: string;
  name: string;
  variant: string;
  unit: number;
  lead: string;
}) {
  return (
    <div>
      <Link href={href} className="font-medium hover:underline">
        {name}
      </Link>
      {variant && <p className="mt-1 text-sm text-muted">{variant}</p>}
      <p className="mt-1 text-sm">{formatPrice(unit)}</p>
      <p className="mt-2 text-xs text-muted">{lead}</p>
    </div>
  );
}
