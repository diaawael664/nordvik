/**
 * Shop filtering and sorting. Pure functions: the shop page keeps filter state
 * in the URL (/shop/sofas/?color=Green&sort=price-asc) so results are
 * shareable and survive a refresh.
 */
import type { ColorFamily, SortValue } from "@data/filters";
import { products, type Product } from "@/lib/catalog";

export type Filters = {
  category: string | null;
  query: string;
  colors: ColorFamily[];
  materials: string[];
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  onSale: boolean;
  sort: SortValue;
  view: "grid" | "list";
};

export const defaultFilters: Filters = {
  category: null,
  query: "",
  colors: [],
  materials: [],
  minPrice: null,
  maxPrice: null,
  inStock: false,
  onSale: false,
  sort: "featured",
  view: "grid",
};

/** Bounds for the price slider, rounded out to the nearest $50. */
export const priceBounds = {
  min: Math.floor(Math.min(...products.map((p) => p.price)) / 50) * 50,
  max: Math.ceil(Math.max(...products.map((p) => p.price)) / 50) * 50,
};

/** Every material in the catalog, alphabetically. */
export const allMaterials = [...new Set(products.flatMap((p) => p.materials))].sort();

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const num = (v: string | null) => (v && Number.isFinite(Number(v)) ? Number(v) : null);

export function parseFilters(params: URLSearchParams): Filters {
  return {
    category: params.get("category"),
    query: params.get("q") ?? "",
    colors: list(params.get("color")) as ColorFamily[],
    materials: list(params.get("material")),
    minPrice: num(params.get("min")),
    maxPrice: num(params.get("max")),
    inStock: params.get("stock") === "in",
    onSale: params.get("sale") === "1",
    sort: (params.get("sort") as SortValue) ?? "featured",
    view: params.get("view") === "list" ? "list" : "grid",
  };
}

/** Filters → query string; defaults are omitted to keep URLs short. */
export function serializeFilters(f: Filters) {
  const p = new URLSearchParams();
  if (f.category) p.set("category", f.category);
  if (f.query) p.set("q", f.query);
  if (f.colors.length) p.set("color", f.colors.join(","));
  if (f.materials.length) p.set("material", f.materials.join(","));
  if (f.minPrice !== null && f.minPrice > priceBounds.min) p.set("min", String(f.minPrice));
  if (f.maxPrice !== null && f.maxPrice < priceBounds.max) p.set("max", String(f.maxPrice));
  if (f.inStock) p.set("stock", "in");
  if (f.onSale) p.set("sale", "1");
  if (f.sort !== "featured") p.set("sort", f.sort);
  if (f.view !== "grid") p.set("view", f.view);
  return p.toString();
}

const matchesQuery = (p: Product, q: string) => {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [p.name, p.category, p.summary, ...p.materials, ...p.colors.map((c) => c.name)]
    .join(" ")
    .toLowerCase();
  return words.every((w) => haystack.includes(w));
};

/** Everything except category and sort — used to count matches per category. */
function passesRefinements(p: Product, f: Filters) {
  if (f.query && !matchesQuery(p, f.query)) return false;
  if (f.colors.length && !p.colors.some((c) => f.colors.includes(c.family))) return false;
  if (f.materials.length && !p.materials.some((m) => f.materials.includes(m))) return false;
  if (f.minPrice !== null && p.price < f.minPrice) return false;
  if (f.maxPrice !== null && p.price > f.maxPrice) return false;
  if (f.inStock && p.stock === 0) return false;
  if (f.onSale && !p.compareAt) return false;
  return true;
}

const sorters: Record<SortValue, (a: Product, b: Product) => number> = {
  // Featured: best sellers first, then catalog order.
  featured: (a, b) => Number(Boolean(b.isBestseller)) - Number(Boolean(a.isBestseller)),
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
};

export function applyFilters(f: Filters): Product[] {
  return products
    .filter((p) => (!f.category || p.category === f.category) && passesRefinements(p, f))
    .sort(sorters[f.sort] ?? sorters.featured);
}

/** Result count per category under the current refinements. */
export function categoryCounts(f: Filters): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of products) if (passesRefinements(p, f)) counts[p.category] = (counts[p.category] ?? 0) + 1;
  return counts;
}

/** Number of active refinements (for the mobile "Filters (3)" button). */
export const activeCount = (f: Filters) =>
  f.colors.length +
  f.materials.length +
  Number(f.minPrice !== null || f.maxPrice !== null) +
  Number(f.inStock) +
  Number(f.onSale);
