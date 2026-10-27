"use client";

import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useDialog } from "@/lib/use-dialog";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  children: ReactNode;
  className?: string;
};

/** Centered dialog. Used by quick view; reusable for size guides, video, etc. */
export function Modal({ open, onClose, label, children, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(panelRef, open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8">
          <m.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className={cn(
              "relative max-h-[92dvh] w-full max-w-5xl overflow-y-auto bg-bg text-ink shadow-2xl outline-none",
              className,
            )}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-bg/80 transition-colors hover:bg-sand"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
