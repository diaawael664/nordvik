import type { Metadata } from "next";
import { site } from "@data/site";
import { ShopView } from "./shop-view";

export const metadata: Metadata = {
  title: "Shop all furniture",
  description: `Sofas, chairs, tables, lighting and decor from ${site.name}. Filter by color, material and price.`,
  alternates: { canonical: "/shop/" },
};

/**
 * The static HTML lists every product (good for SEO and no-JS visitors);
 * the client then applies filters from the URL query string.
 */
export default function ShopPage() {
  return <ShopView />;
}
