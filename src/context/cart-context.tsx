"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { getProductById, type Product } from "@/lib/catalog";
import { bundles, type Bundle } from "@data/bundles";
import { site } from "@data/site";
import { track } from "@/lib/analytics";
import { createPersistentStore } from "@/lib/persistent-store";

/** One cart row. A product in two colors is two lines. */
export type CartLine = {
  /** productId + chosen options; identifies the line. */
  key: string;
  productId: string;
  color?: string;
  /** Extra selections, e.g. { Size: "200 × 300 cm" }. */
  options?: Record<string, string>;
  quantity: number;
};

export type CartLineView = CartLine & { product: Product; unitPrice: number; lineTotal: number };

export type PromoCode = (typeof site.promoCodes)[number];

const store = createPersistentStore<CartLine[]>("nordhaus:cart", []);
const promoStore = createPersistentStore<string | null>("nordhaus:promo", null);

const lineKey = (productId: string, color?: string, options?: Record<string, string>) =>
  [productId, color ?? "", ...Object.entries(options ?? {}).map(([k, v]) => `${k}=${v}`)].join("|");

/** Base price plus any option price deltas. */
export function unitPrice(product: Product, options?: Record<string, string>) {
  let price = product.price;
  for (const opt of product.options ?? []) {
    const chosen = opt.values.find((v) => v.label === options?.[opt.name]);
    price += chosen?.priceDelta ?? 0;
  }
  return price;
}

const findPromo = (code: string | null) =>
  code ? site.promoCodes.find((p) => p.code.toLowerCase() === code.trim().toLowerCase()) : undefined;

type CartContextValue = {
  lines: CartLineView[];
  count: number;
  subtotal: number;
  /** Applied promo code, if any. */
  promo?: PromoCode;
  discount: number;
  /** "Complete the look" sets fully in the cart, with their saving. */
  bundleSavings: { bundle: Bundle; amount: number }[];
  shipping: number;
  /** Estimated tax on (subtotal − discount + shipping). Demo only. */
  tax: number;
  total: number;
  /** How much more to spend for free delivery (0 once reached). */
  toFreeShipping: number;
  add: (input: Omit<CartLine, "key" | "quantity"> & { quantity?: number }) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  /** Returns false if the code is not recognized. */
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const promoCode = useSyncExternalStore(promoStore.subscribe, promoStore.getSnapshot, promoStore.getServerSnapshot);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLineView[] = raw.flatMap((line) => {
      const product = getProductById(line.productId);
      if (!product) return []; // product was removed from the catalog
      const price = unitPrice(product, line.options);
      return [{ ...line, product, unitPrice: price, lineTotal: price * line.quantity }];
    });
    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    // A set's discount applies to one of each of its products.
    const bundleSavings = bundles.flatMap((bundle) => {
      const matched = bundle.products.map((slug) => lines.find((l) => l.product.slug === slug));
      if (matched.some((l) => !l)) return [];
      const base = matched.reduce((sum, l) => sum + (l?.unitPrice ?? 0), 0);
      return [{ bundle, amount: Math.round(base * bundle.percent) / 100 }];
    });
    const setDiscount = bundleSavings.reduce((sum, b) => sum + b.amount, 0);
    const promo = findPromo(promoCode);
    const discount = promo ? Math.round((subtotal - setDiscount) * promo.percent) / 100 : 0;
    // Free delivery is based on the pre-discount subtotal, as shown in the meter.
    const reached = subtotal >= site.freeShippingThreshold;
    const shipping = subtotal === 0 || reached ? 0 : site.shippingFee;
    const tax = Math.round((subtotal - setDiscount - discount + shipping) * site.taxRate * 100) / 100;

    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal,
      promo,
      discount,
      bundleSavings,
      shipping,
      tax,
      total: subtotal - setDiscount - discount + shipping + tax,
      toFreeShipping: reached ? 0 : site.freeShippingThreshold - subtotal,
      add: ({ productId, color, options, quantity = 1 }) => {
        const key = lineKey(productId, color, options);
        const product = getProductById(productId);
        if (product) {
          const price = unitPrice(product, options);
          track("add_to_cart", { value: price * quantity, items: [{ product, quantity, color, unitPrice: price }] });
        }
        store.set((prev) => {
          const existing = prev.find((l) => l.key === key);
          if (existing) {
            return prev.map((l) => (l.key === key ? { ...l, quantity: l.quantity + quantity } : l));
          }
          return [...prev, { key, productId, color, options, quantity }];
        });
      },
      setQuantity: (key, quantity) =>
        store.set((prev) =>
          quantity <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, quantity } : l)),
        ),
      remove: (key) => {
        const line = lines.find((l) => l.key === key);
        if (line) track("remove_from_cart", { value: line.lineTotal, items: [{ ...line, unitPrice: line.unitPrice }] });
        store.set((prev) => prev.filter((l) => l.key !== key));
      },
      clear: () => {
        store.set([]);
        promoStore.set(null);
      },
      applyPromo: (code) => {
        const found = findPromo(code);
        if (found) promoStore.set(found.code);
        return Boolean(found);
      },
      removePromo: () => promoStore.set(null),
    };
  }, [raw, promoCode]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
