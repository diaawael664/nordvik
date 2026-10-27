import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** `false` during static render and hydration, `true` afterwards. */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
