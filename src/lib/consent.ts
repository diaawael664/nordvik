import { useSyncExternalStore } from "react";
import { createPersistentStore } from "./persistent-store";

/** Visitor's cookie choices. `null` = not decided yet (show the banner). */
export type Consent = { analytics: boolean; marketing: boolean; decidedAt: string } | null;

export const consentStore = createPersistentStore<Consent>("nordvik:consent", null);

export const useConsent = () =>
  useSyncExternalStore(consentStore.subscribe, consentStore.getSnapshot, consentStore.getServerSnapshot);

export const setConsent = (analytics: boolean, marketing: boolean) =>
  consentStore.set({ analytics, marketing, decidedAt: new Date().toISOString() });
