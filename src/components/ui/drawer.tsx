"use client";

import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useDialog } from "@/lib/use-dialog";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right" | "top";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

const offscreen = { left: { x: "-100%" }, right: { x: "100%" }, top: { y: "-100%" } };

/** Slide-in panel with a backdrop. Used by the mini cart, mobile menu and search. */
export function Drawer({ open, onClose, title, side = "right", children, footer, className }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(panelRef, open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <m.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={cn(
              "absolute flex flex-col bg-bg text-ink shadow-2xl outline-none",
              side === "top" ? "inset-x-0 top-0 max-h-[90dvh]" : "inset-y-0 w-full max-w-md",
              side === "left" && "left-0",
              side === "right" && "right-0",
              className,
            )}
            initial={offscreen[side]}
            animate={{ x: 0, y: 0 }}
            exit={offscreen[side]}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <h2 className="font-display text-xl">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 grid size-10 place-items-center rounded-full transition-colors hover:bg-sand"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
            {footer && <div className="border-t border-line px-5 py-5 sm:px-6">{footer}</div>}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
