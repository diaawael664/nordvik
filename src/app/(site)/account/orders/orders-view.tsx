"use client";

import { Check, Package, Truck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { orderStages, sampleOrders } from "@data/account";
import type { ImageRef } from "@data/images";
import { site } from "@data/site";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { getProduct, getProductById } from "@/lib/catalog";
import { useDemoOrders } from "@/lib/stores";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { AccountShell } from "../account-shell";

type OrderView = {
  id: string;
  date: string;
  status: number;
  total: number;
  carrier?: { name: string; tracking: string };
  items: { name: string; quantity: number; image?: ImageRef; href?: string; variant?: string }[];
};

const money = (n: number) =>
  new Intl.NumberFormat(site.locale, { style: "currency", currency: site.currency }).format(n);
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

/** Sample orders + orders placed in the demo checkout, newest first. */
function useOrders(): OrderView[] {
  const placed = useDemoOrders();
  const fromCheckout: OrderView[] = placed.map((o) => ({
    id: o.id,
    date: o.date,
    status: 0,
    total: o.total,
    items: o.items.map((i) => {
      const p = getProductById(i.productId);
      return {
        name: i.name,
        quantity: i.quantity,
        variant: i.variant,
        image: p?.images[0],
        href: p ? `/product/${p.slug}/` : undefined,
      };
    }),
  }));
  const samples: OrderView[] = sampleOrders.map((o) => ({
    ...o,
    items: o.items.flatMap((i) => {
      const p = getProduct(i.slug);
      return p ? [{ name: p.name, quantity: i.quantity, image: p.images[0], href: `/product/${p.slug}/` }] : [];
    }),
  }));
  return [...fromCheckout, ...samples];
}

export function OrdersView() {
  const hydrated = useHydrated();
  const orders = useOrders();
  const selectedId = useSearchParams().get("id");
  const selected = hydrated ? orders.find((o) => o.id === selectedId) : undefined;

  if (selected) {
    return (
      <AccountShell title={`Order ${selected.id}`}>
        <Link href="/account/orders/" className="text-sm underline underline-offset-4">
          ← All orders
        </Link>
        <Tracking order={selected} />
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {selected.items.map((i) => (
            <li key={i.name} className="flex items-center gap-4 py-4">
              {i.image && (
                <span className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-sand">
                  <Photo name={i.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
              )}
              <span className="flex-1">
                {i.href ? (
                  <Link href={i.href} className="font-medium hover:underline">
                    {i.name}
                  </Link>
                ) : (
                  <span className="font-medium">{i.name}</span>
                )}
                {i.variant && <span className="block text-sm text-muted">{i.variant}</span>}
              </span>
              <span className="font-mono text-sm text-muted">× {i.quantity}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex justify-between text-lg">
          <span>Total</span>
          <span className="font-display">{money(selected.total)}</span>
        </p>
      </AccountShell>
    );
  }

  return (
    <AccountShell title="Your orders">
      {!hydrated ? (
        <div className="h-64 animate-pulse bg-sand/60" aria-label="Loading orders" />
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="border border-line p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm">{o.id}</p>
                  <p className="mt-1 text-sm text-muted">
                    Placed {dateFmt.format(new Date(o.date))} · {money(o.total)}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs",
                    o.status === orderStages.length - 1 ? "bg-sand" : "bg-accent text-on-accent",
                  )}
                >
                  {orderStages[o.status]}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex -space-x-3">
                  {o.items.slice(0, 4).map((i) =>
                    i.image ? (
                      <span
                        key={i.name}
                        className="relative size-14 overflow-hidden rounded-full border-2 border-bg bg-sand"
                      >
                        <Photo name={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
                      </span>
                    ) : null,
                  )}
                </div>
                <ButtonLink href={`/account/orders/?id=${o.id}`} variant="outline" size="sm">
                  {o.status < orderStages.length - 1 ? "Track order" : "View order"}
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}

/** Delivery timeline: completed stages are filled, the current one is highlighted. */
function Tracking({ order }: { order: OrderView }) {
  const icons = [Package, Package, Truck, Truck, Check];
  return (
    <section aria-label="Delivery progress" className="mt-8 border border-line bg-surface p-6 sm:p-8">
      <p className="text-sm">
        Status: <strong>{orderStages[order.status]}</strong>
        {order.carrier && (
          <span className="text-muted">
            {" "}
            · {order.carrier.name}, tracking <span className="font-mono">{order.carrier.tracking}</span>
          </span>
        )}
      </p>
      <ol className="mt-8 grid gap-6 sm:grid-cols-5 sm:gap-0">
        {orderStages.map((stage, i) => {
          const done = i < order.status;
          const current = i === order.status;
          const Icon = icons[i];
          return (
            <li
              key={stage}
              className="relative flex items-center gap-4 sm:flex-col sm:text-center"
              aria-current={current ? "step" : undefined}
            >
              {i > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-5 right-1/2 hidden h-px w-full sm:block",
                    i <= order.status ? "bg-accent" : "bg-line",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border",
                  done && "border-accent bg-accent text-on-accent",
                  current && "border-accent bg-bg text-accent ring-4 ring-accent/15",
                  !done && !current && "border-line bg-bg text-muted",
                )}
              >
                <Icon className="size-4" strokeWidth={1.5} />
              </span>
              <span className={cn("text-sm sm:mt-3", !done && !current && "text-muted", current && "font-semibold")}>
                {stage}
              </span>
            </li>
          );
        })}
      </ol>
      {order.status < 2 && (
        <p className="mt-8 text-sm text-muted">
          We&apos;ll email you to book a delivery slot as soon as your pieces leave the workshop.
        </p>
      )}
    </section>
  );
}
