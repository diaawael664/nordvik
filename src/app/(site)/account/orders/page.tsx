import type { Metadata } from "next";
import { Suspense } from "react";
import { OrdersView } from "./orders-view";

export const metadata: Metadata = { title: "Your orders", robots: { index: false, follow: false } };

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersView />
    </Suspense>
  );
}
