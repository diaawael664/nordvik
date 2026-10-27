/**
 * CHECKOUT HANDOFF
 * ─────────────────────────────────────────────────────────────────────────────
 * `site.checkoutMode` decides what the Checkout buttons do:
 *
 *   "demo"    — open the built-in /checkout/ page (UI only, no payment)
 *   "shopify" — create a cart through the Shopify Storefront API and send the
 *               shopper to Shopify's hosted, PCI-compliant checkout
 *
 * Shopify mode needs two public environment variables (.env.local):
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL    same URL used by the catalog sync
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN  Storefront token (safe to expose: read + cart only)
 *
 * Other platforms: add a branch to `startCheckout` that returns a redirect URL
 * (e.g. a Stripe Checkout session URL created by your own API).
 */
import { site } from "@data/site";
import type { CartLineView } from "@/context/cart-context";

export type CheckoutResult = { type: "internal"; href: string } | { type: "redirect"; url: string };

/** Finds the platform variant matching a cart line's color and options. */
function variantId(line: CartLineView) {
  const variants = line.product.external?.variants ?? [];
  const match = variants.find(
    (v) =>
      (!v.color || v.color === line.color) && Object.entries(v.options).every(([k, val]) => line.options?.[k] === val),
  );
  return match?.id ?? variants[0]?.id;
}

async function shopifyCheckout(lines: CartLineView[]): Promise<CheckoutResult> {
  const endpoint = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
  if (!endpoint) throw new Error("Set NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL to use Shopify checkout.");

  const cartLines = lines.flatMap((l) => {
    const id = variantId(l);
    return id ? [{ merchandiseId: id, quantity: l.quantity }] : [];
  });
  if (cartLines.length !== lines.length) {
    throw new Error("Some cart items have no Shopify variant. Re-run `npm run catalog:shopify`.");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-Shopify-Storefront-Access-Token": token } : {}),
    },
    body: JSON.stringify({
      query: `mutation CreateCart($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) { cart { checkoutUrl } userErrors { message } }
      }`,
      variables: { lines: cartLines },
    }),
  });
  const json = await res.json();
  const result = json.data?.cartCreate;
  if (!result?.cart?.checkoutUrl) {
    throw new Error(result?.userErrors?.[0]?.message ?? "Shopify could not create a checkout.");
  }
  return { type: "redirect", url: result.cart.checkoutUrl };
}

/** Called by every Checkout button. */
export async function startCheckout(lines: CartLineView[]): Promise<CheckoutResult> {
  if (site.checkoutMode === "shopify") return shopifyCheckout(lines);
  return { type: "internal", href: "/checkout/" };
}
