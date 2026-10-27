import type { Metadata } from "next";
import { Photo } from "@/components/ui/photo";
import { AccountForms } from "./account-forms";

export const metadata: Metadata = {
  title: "Sign in or create an account",
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <div className="grid lg:min-h-[calc(100dvh-7.25rem)] lg:grid-cols-2">
      <div className="relative hidden bg-sand lg:block">
        <Photo name="room-reading" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-12 text-white">
          <p className="max-w-sm font-display text-3xl leading-snug">
            Save rooms you love, track deliveries and reorder covers in two clicks.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-16 sm:px-10">
        <AccountForms />
      </div>
    </div>
  );
}
