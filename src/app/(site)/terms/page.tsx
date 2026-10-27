import { LegalPageView, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("terms");

export default function Page() {
  return <LegalPageView slug="terms" />;
}
