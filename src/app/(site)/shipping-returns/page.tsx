import { LegalPageView, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("shipping-returns");

export default function Page() {
  return <LegalPageView slug="shipping-returns" />;
}
