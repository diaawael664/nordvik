/**
 * SHOP FILTERS
 * Color families shown as swatches in the shop sidebar. Each product color
 * in data/products.ts names one of these in its `family` field.
 */
export const colorFamilies = [
  { name: "White", hex: "#F3EFE8" },
  { name: "Beige", hex: "#D8CCB8" },
  { name: "Wood", hex: "#C9A57A" },
  { name: "Brown", hex: "#7A4E33" },
  { name: "Rust", hex: "#B4532A" },
  { name: "Yellow", hex: "#D9A520" },
  { name: "Pink", hex: "#D4A9A0" },
  { name: "Green", hex: "#2F5A4C" },
  { name: "Gray", hex: "#9C9890" },
  { name: "Black", hex: "#1F1E1C" },
  { name: "Brass", hex: "#B08A4F" },
] as const;

export type ColorFamily = (typeof colorFamilies)[number]["name"];

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

/** Products shown before "Load more" on the shop page. */
export const pageSize = 9;
