import type { Metadata } from "next";
import { WishlistView } from "./wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist",
  // Wishlist contents are per-visitor; keep the page out of search results.
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return <WishlistView />;
}
