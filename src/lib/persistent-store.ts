/**
 * A tiny localStorage-backed store for useSyncExternalStore.
 *
 * The server (and the first client render) always see `initial`, so the
 * static HTML never mismatches; React then re-renders with the saved value.
 * Changes sync across browser tabs through the `storage` event.
 */
export function createPersistentStore<T>(key: string, initial: T) {
  let value: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    if (value !== undefined) return value;
    try {
      const raw = window.localStorage.getItem(key);
      value = raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      value = initial;
    }
    return value;
  };

  const emit = () => listeners.forEach((l) => l());

  const onStorage = (e: StorageEvent) => {
    if (e.key !== key) return;
    value = undefined;
    emit();
  };

  return {
    getSnapshot: read,
    getServerSnapshot: () => initial,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
    set(next: T | ((prev: T) => T)) {
      value = typeof next === "function" ? (next as (prev: T) => T)(read()) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Private mode or full storage: keep the in-memory value only.
      }
      emit();
    },
  };
}
