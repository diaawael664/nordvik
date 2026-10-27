"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { getProductById } from "@/lib/catalog";
import { createPersistentStore } from "@/lib/persistent-store";

const store = createPersistentStore<string[]>("nordvik:wishlist", []);

type WishlistContextValue = {
  /** Saved product ids, most recent first. */
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const ids = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      has: (id) => ids.includes(id),
      toggle: (id) => {
        const product = !ids.includes(id) ? getProductById(id) : undefined;
        if (product) track("add_to_wishlist", { value: product.price, items: [{ product }] });
        store.set((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
      },
      remove: (id) => store.set((prev) => prev.filter((x) => x !== id)),
    }),
    [ids],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
