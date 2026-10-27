/**
 * ANALYTICS EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * The template fires standard e-commerce events in Google Analytics 4 format:
 *
 *   view_item · view_item_list · add_to_cart · remove_from_cart · add_to_wishlist
 *   begin_checkout · purchase · search · sign_up · generate_lead
 *
 * Each event is pushed to `window.dataLayer` (read by Google Tag Manager, GA4,
 * Meta Pixel via GTM, etc.) and also dispatched as a `nordvik:track` DOM event
 * for any other tool. Nothing is sent until the visitor accepts analytics
 * cookies, unless `site.analytics.requireConsent` is false.
 *
 * To connect GA4: paste your GTM container snippet into src/app/layout.tsx,
 * or listen for the DOM event:
 *   window.addEventListener("nordvik:track", (e) => console.log(e.detail));
 */
import { site } from "@data/site";
import { consentStore } from "./consent";

type Item = {
  product: { id: string; name: string; category: string; price: number };
  quantity?: number;
  color?: string;
  unitPrice?: number;
};

export type TrackPayload = {
  value?: number;
  items?: Item[];
  search_term?: string;
  transaction_id?: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const toGa4 = (i: Item) => ({
  item_id: i.product.id,
  item_name: i.product.name,
  item_category: i.product.category,
  item_variant: i.color,
  price: i.unitPrice ?? i.product.price,
  quantity: i.quantity ?? 1,
});

export function track(event: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;
  if (site.analytics.requireConsent && !consentStore.getSnapshot()?.analytics) return;

  const { items, ...rest } = payload;
  const ecommerce = { currency: site.currency, ...rest, ...(items ? { items: items.map(toGa4) } : {}) };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ ecommerce: null }); // GA4 recommends clearing the previous ecommerce object
  window.dataLayer.push({ event, ecommerce });
  window.dispatchEvent(new CustomEvent("nordvik:track", { detail: { event, ecommerce } }));
  if (site.analytics.debug) console.info("[track]", event, ecommerce);
}
