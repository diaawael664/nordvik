import { Lock, RotateCcw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { site } from "@data/site";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** Icons available to `site.features[].icon`. Add more lucide icons here. */
const icons: Record<string, LucideIcon> = { Truck, RotateCcw, ShieldCheck, Lock };

/** The store's four promises: delivery, returns, warranty, payment. */
export function FeaturesBar({ className }: { className?: string }) {
  return (
    <section aria-label="Our promises" className={cn("border-y border-line", className)}>
      <Container>
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {site.features.map((f, i) => {
            const Icon = icons[f.icon] ?? ShieldCheck;
            return (
              <li
                key={f.title}
                className={cn(
                  "flex flex-col gap-3 py-8 pr-4 sm:flex-row sm:gap-4 lg:px-8 lg:py-10",
                  i % 2 === 1 && "border-l border-line pl-4 lg:pl-8",
                  i === 2 && "border-t border-line lg:border-t-0 lg:border-l",
                  i === 3 && "border-t border-line lg:border-t-0",
                  i === 0 && "lg:pl-0",
                )}
              >
                <Icon className="size-6 shrink-0 text-accent" strokeWidth={1.25} />
                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
