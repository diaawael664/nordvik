import { useSyncExternalStore } from "react";

/* A single shared one-second clock for every countdown on the page. */
const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    timer = window.setInterval(() => listeners.forEach((l) => l()), 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => Math.floor(Date.now() / 1000) * 1000;

/** Current time in ms, updated every second. `0` during static render/hydration. */
export const useNow = () => useSyncExternalStore(subscribe, getSnapshot, () => 0);
