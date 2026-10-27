"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

/** Which overlay is open. Only one can be open at a time. */
type Panel = "cart" | "search" | "menu" | null;

type Toast = { id: number; message: string };

type UIContextValue = {
  panel: Panel;
  open: (panel: Exclude<Panel, null>) => void;
  close: () => void;
  /** Product slug shown in the quick-view modal, if any. */
  quickView: string | null;
  setQuickView: (slug: string | null) => void;
  toasts: Toast[];
  notify: (message: string) => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [quickView, setQuickView] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const notify = useCallback((message: string) => {
    const id = ++nextId.current;
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo<UIContextValue>(
    () => ({
      panel,
      open: (p) => setPanel(p),
      close: () => setPanel(null),
      quickView,
      setQuickView,
      toasts,
      notify,
    }),
    [panel, quickView, toasts, notify],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
