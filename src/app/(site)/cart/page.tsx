import type { Metadata } from "next";
import { RecentlyViewed } from "@/components/product/product-extras";
import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Your cart",
  // Cart contents are per-visitor; keep the page out of search results.
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <CartView />
      <RecentlyViewed />
    </>
  );
}
