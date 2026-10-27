"use client";

import { AnimatePresence, m } from "framer-motion";
import { Check } from "lucide-react";
import { useUI } from "@/context/ui-context";

/** Short confirmations ("Added … to your cart"), announced to screen readers. */
export function Toaster() {
  const { toasts } = useUI();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <m.p
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-2.5 bg-ink px-4 py-3 text-sm text-bg shadow-lg"
          >
            <Check className="size-4 text-accent" />
            {t.message}
          </m.p>
        ))}
      </AnimatePresence>
    </div>
  );
}
