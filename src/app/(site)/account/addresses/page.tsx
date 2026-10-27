import type { Metadata } from "next";
import { AddressesView } from "./addresses-view";

export const metadata: Metadata = { title: "Your addresses", robots: { index: false, follow: false } };

export default function AddressesPage() {
  return <AddressesView />;
}
