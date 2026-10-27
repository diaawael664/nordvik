import { Plus } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Accordion built on native <details>/<summary>: keyboard accessible, works
 * without JavaScript, and searchable with the browser's find-in-page.
 * Items sharing a `name` behave as an exclusive group (one open at a time).
 */
export function AccordionItem({ title, children, name }: { title: ReactNode; children: ReactNode; name?: string }) {
  return (
    <details name={name} className="group border-b border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base [&::-webkit-details-marker]:hidden">
        <span className="font-medium">{title}</span>
        <Plus className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-45" strokeWidth={1.5} />
      </summary>
      <div className="pr-10 pb-6 leading-relaxed whitespace-pre-line text-muted">{children}</div>
    </details>
  );
}
