import { CookieSettingsButton } from "@/components/legal/cookie-settings-button";
import { LegalPageView, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("cookies");

export default function Page() {
  return <LegalPageView slug="cookies" extra={<CookieSettingsButton />} />;
}
