/**
 * CATALOG — the single place components read products and categories from.
 * ─────────────────────────────────────────────────────────────────────────────
 * `site.catalogSource` chooses where the data comes from:
 *
 *   "local"   — data/products.ts and data/categories.ts (the demo catalog)
 *   "shopify" — data/shopify/catalog.ts, generated at build time by
 *               `npm run catalog:shopify` from your Shopify Storefront API
 *
 * Because the catalog is resolved at build time, the site stays a static
 * export: no server, and no API calls when a visitor browses.
 *
 * To connect another platform (Medusa, Saleor, BigCommerce, a CMS), write a
 * script that outputs the same `Product` / `Category` shape and point this
 * file at it. Nothing else in the template needs to change.
 */
import { categories as localCategories, type Category } from "@data/categories";
import { products as localProducts, type Product } from "@data/products";
import * as shopify from "@data/shopify/catalog";
import { site } from "@data/site";

export type { Category } from "@data/categories";
export type { Dimensions, Product, ProductColor, ProductOption } from "@data/products";

const fromShopify = site.catalogSource === "shopify" && shopify.products.length > 0;

export const products: Product[] = fromShopify ? shopify.products : localProducts;
export const categories: Category[] = fromShopify && shopify.categories.length ? shopify.categories : localCategories;

/* ── Lookups ──────────────────────────────────────────────────────────────── */

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

/* ── Curated lists ────────────────────────────────────────────────────────── */

export const bestSellers = () => {
  const flagged = products.filter((p) => p.isBestseller);
  // Synced catalogs may not flag best sellers; fall back to top-rated.
  return flagged.length ? flagged : [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
};
export const newArrivals = () => [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
export const onSale = () => products.filter((p) => p.compareAt);
