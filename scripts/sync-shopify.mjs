/**
 * Sync products and collections from a Shopify store into data/shopify/catalog.ts.
 *
 *   npm run catalog:shopify
 *
 * Reads two environment variables (put them in .env.local):
 *   SHOPIFY_STOREFRONT_URL    e.g. https://your-store.myshopify.com/api/2026-07/graphql.json
 *                             (use a currently supported API version)
 *   SHOPIFY_STOREFRONT_TOKEN  Storefront API access token (public, read-only)
 *
 * Try it without an account against Shopify's public demo furniture store:
 *   SHOPIFY_STOREFRONT_URL=https://furniture.mock.shop/api npm run catalog:shopify
 *
 * Then set `catalogSource: "shopify"` in data/site.ts and rebuild.
 * Products are mapped to the template's Product type (see data/products.ts).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/* ── Config ─────────────────────────────────────────────────────────────── */

// Minimal .env.local reader so the script has no dependencies.
const envFile = join(process.cwd(), ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const endpoint = process.env.SHOPIFY_STOREFRONT_URL;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
if (!endpoint) {
  console.error("Set SHOPIFY_STOREFRONT_URL (see the comment at the top of scripts/sync-shopify.mjs).");
  process.exit(1);
}

async function gql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-Shopify-Storefront-Access-Token": token } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify responded ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data;
}

/* ── Fetch ──────────────────────────────────────────────────────────────── */

const PRODUCTS = `
query Products($after: String) {
  products(first: 100, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id handle title description productType vendor tags createdAt availableForSale
      images(first: 6) { nodes { url } }
      options { name optionValues { name swatch { color } } }
      collections(first: 5) { nodes { handle } }
      variants(first: 100) {
        nodes {
          id sku availableForSale quantityAvailable
          selectedOptions { name value }
          price { amount }
          compareAtPrice { amount }
        }
      }
    }
  }
}`;

const COLLECTIONS = `
{
  shop { paymentSettings { currencyCode } }
  collections(first: 50) { nodes { handle title description image { url } } }
}`;

const nodes = [];
for (let after = null, page = 0; page < 50; page++) {
  const data = await gql(PRODUCTS, { after });
  nodes.push(...data.products.nodes);
  if (!data.products.pageInfo.hasNextPage) break;
  after = data.products.pageInfo.endCursor;
}
const { collections, shop } = await gql(COLLECTIONS);

/* ── Map to the template's types ────────────────────────────────────────── */

const COLOR_OPTION = /(colou?r|finish|fabric|upholstery)/i;
const MATERIAL_OPTION = /^material$/i;
const KNOWN_MATERIALS = [
  "Oak",
  "Walnut",
  "Ash",
  "Beech",
  "Pine",
  "Teak",
  "Linen",
  "Wool",
  "Velvet",
  "Bouclé",
  "Leather",
  "Cotton",
  "Steel",
  "Brass",
  "Aluminum",
  "Ceramic",
  "Stoneware",
  "Glass",
  "Marble",
  "Rattan",
  "Cane",
  "Jute",
];

/** Color family for the shop filter, guessed from the value name. */
function family(name) {
  const n = name.toLowerCase();
  // Order matters: "Ebonized Ash" is black, "White Oak" is wood.
  const rules = [
    [/black|ebon|charcoal|onyx/, "Black"],
    [/walnut|espresso|chocolate|brown|cognac|tan|leather/, "Brown"],
    [/oak|ash|beech|natural|wood|teak|maple|birch|pine/, "Wood"],
    [/white|ivory|chalk|bone|snow|cream/, "White"],
    [/gray|grey|stone|fog|slate|graphite/, "Gray"],
    [/green|sage|olive|moss|forest/, "Green"],
    [/rust|terracotta|orange|clay|copper/, "Rust"],
    [/yellow|mustard|saffron|ochre/, "Yellow"],
    [/pink|blush|rose/, "Pink"],
    [/brass|gold|bronze/, "Brass"],
  ];
  return rules.find(([re]) => re.test(n))?.[1] ?? "Beige";
}

/** Neutral swatch used when Shopify has no swatch color for a value. */
const FAMILY_HEX = {
  Black: "#1F1E1C",
  White: "#F1EEE8",
  Gray: "#9C9890",
  Green: "#2F5A4C",
  Rust: "#B4532A",
  Yellow: "#D9A520",
  Pink: "#D4A9A0",
  Brass: "#B08A4F",
  Brown: "#7A4E33",
  Wood: "#C9A57A",
  Beige: "#D8CCB8",
};

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-");
const num = (m) => (m ? Number(m.amount) : 0);
const firstSentence = (t) => (t.match(/^.*?[.!?](\s|$)/)?.[0] ?? t).trim();

const usedCategories = new Map();

const products = nodes.map((p) => {
  const variants = p.variants.nodes;
  const base = Math.min(...variants.map((v) => num(v.price)));
  const compare = Math.max(...variants.map((v) => num(v.compareAtPrice)));

  const colorOpt = p.options.find((o) => COLOR_OPTION.test(o.name));
  const colors = (colorOpt?.optionValues ?? []).map((v) => ({
    name: v.name,
    hex: v.swatch?.color ?? FAMILY_HEX[family(v.name)],
    family: family(v.name),
  }));

  // Every other option becomes a selector; price delta = cheapest variant with that value − base price.
  const options = p.options
    .filter((o) => o !== colorOpt && !(o.optionValues.length === 1 && o.optionValues[0].name === "Default Title"))
    .map((o) => ({
      name: o.name,
      values: o.optionValues.map((v) => {
        const prices = variants
          .filter((x) => x.selectedOptions.some((s) => s.name === o.name && s.value === v.name))
          .map((x) => num(x.price));
        const delta = prices.length ? Math.round(Math.min(...prices) - base) : 0;
        return delta > 0 ? { label: v.name, priceDelta: delta } : { label: v.name };
      }),
    }));

  const materialOpt = p.options.find((o) => MATERIAL_OPTION.test(o.name));
  const materials = [
    ...new Set([
      ...(materialOpt?.optionValues.map((v) => v.name) ?? []),
      // Title and tags only: descriptions often mention materials of other pieces.
      ...KNOWN_MATERIALS.filter((m) => [p.title, ...p.tags].join(" ").toLowerCase().includes(m.toLowerCase())),
    ]),
  ];

  const categoryHandle = p.collections.nodes[0]?.handle ?? (p.productType ? slug(p.productType) : "all");
  usedCategories.set(categoryHandle, true);

  const stock = variants.reduce((sum, v) => sum + (v.quantityAvailable ?? (v.availableForSale ? 10 : 0)), 0);

  return {
    id: `sh-${p.id.split("/").pop()}`,
    slug: p.handle,
    name: p.title,
    category: categoryHandle,
    sku: variants[0]?.sku || p.handle.toUpperCase(),
    price: Math.round(base),
    ...(compare > base ? { compareAt: Math.round(compare) } : {}),
    rating: 0,
    reviewCount: 0,
    colors,
    ...(options.length ? { options } : {}),
    materials: materials.length ? materials : [p.productType || "Mixed"],
    images: p.images.nodes.map((i) => i.url),
    // Storefront API has no standard dimensions field; add them via metafields if you need them.
    dimensions: { width: 0, depth: 0, height: 0 },
    weightKg: 0,
    stock: p.availableForSale ? Math.max(stock, 1) : 0,
    leadTime: p.availableForSale ? "Ships in 2–4 days" : "Currently unavailable",
    designer: p.vendor,
    summary: firstSentence(p.description),
    description: p.description,
    details: p.tags.slice(0, 6),
    care: "",
    createdAt: p.createdAt.slice(0, 10),
    external: {
      platform: "shopify",
      productId: p.id,
      variants: variants.map((v) => {
        const color = colorOpt ? v.selectedOptions.find((s) => s.name === colorOpt.name)?.value : undefined;
        const opts = Object.fromEntries(
          v.selectedOptions
            .filter((s) => s.name !== colorOpt?.name && s.value !== "Default Title")
            .map((s) => [s.name, s.value]),
        );
        return { id: v.id, ...(color ? { color } : {}), options: opts, available: v.availableForSale };
      }),
    },
  };
});

const categories = collections.nodes
  .filter((c) => usedCategories.has(c.handle))
  .map((c) => ({
    slug: c.handle,
    name: c.title,
    description: firstSentence(c.description || `Shop ${c.title}.`),
    image: c.image?.url ?? products.find((p) => p.category === c.handle)?.images[0] ?? "",
  }))
  .filter((c) => c.image);

/* ── Write ──────────────────────────────────────────────────────────────── */

const out = `/**
 * GENERATED FILE — written by \`npm run catalog:shopify\` on ${new Date().toISOString()}.
 * Source: ${endpoint}
 * Do not edit by hand; re-run the sync instead.
 */
import type { Category } from "../categories";
import type { Product } from "../products";

export const syncedAt: string | null = ${JSON.stringify(new Date().toISOString())};

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};
`;
writeFileSync(join(process.cwd(), "data/shopify/catalog.ts"), out);
console.log(`Synced ${products.length} products and ${categories.length} categories from ${endpoint}`);
console.log(`Store currency: ${shop.paymentSettings.currencyCode}. Make sure \`currency\` in data/site.ts matches.`);
console.log('Next: set catalogSource: "shopify" in data/site.ts and run npm run build.');
