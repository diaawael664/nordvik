/**
 * Small per-visitor stores kept in localStorage (demo behavior). Each has a
 * hook for components and plain functions for event handlers.
 */
import { useSyncExternalStore } from "react";
import { createPersistentStore } from "./persistent-store";

function hookFor<T>(store: ReturnType<typeof createPersistentStore<T>>) {
  return () => useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

/* ── Recently viewed (product ids, newest first) ────────────────────────── */

const recent = createPersistentStore<string[]>("nordhaus:recent", []);
export const useRecentlyViewed = hookFor(recent);
export const addRecentlyViewed = (id: string) =>
  recent.set((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 12));

/* ── Orders placed in the demo checkout ─────────────────────────────────── */

export type DemoOrder = {
  id: string;
  date: string;
  total: number;
  email: string;
  delivery: string;
  address: string;
  items: { productId: string; name: string; quantity: number; variant: string; price: number }[];
};

const orders = createPersistentStore<DemoOrder[]>("nordhaus:orders", []);
export const useDemoOrders = hookFor(orders);
export const addDemoOrder = (o: DemoOrder) => orders.set((prev) => [o, ...prev]);

/* ── Back-in-stock requests (product id → email) ────────────────────────── */

const restock = createPersistentStore<Record<string, string>>("nordhaus:restock", {});
export const useRestockRequests = hookFor(restock);
export const requestRestock = (productId: string, email: string) =>
  restock.set((prev) => ({ ...prev, [productId]: email }));

/* ── Fabric swatch tray (color names, max 6) ────────────────────────────── */

export const MAX_SWATCHES = 6;
export type Swatch = { name: string; hex: string; product: string };
const swatches = createPersistentStore<Swatch[]>("nordhaus:swatches", []);
export const useSwatchTray = hookFor(swatches);
export const toggleSwatch = (s: Swatch) =>
  swatches.set((prev) =>
    prev.some((x) => x.name === s.name)
      ? prev.filter((x) => x.name !== s.name)
      : prev.length >= MAX_SWATCHES
        ? prev
        : [...prev, s],
  );
export const clearSwatches = () => swatches.set([]);
