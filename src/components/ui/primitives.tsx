/**
 * Small presentational building blocks shared across pages.
 */
import { Star } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn, formatPrice, percentOff } from "@/lib/utils";

/* ── Layout ──────────────────────────────────────────────────────────────── */

/** Centered content column with responsive gutters (16px on phones). */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-site px-4 sm:px-6 lg:px-10", className)} {...props} />;
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

/** Eyebrow + heading + optional intro and right-aligned action link. */
export function SectionHeading({ eyebrow, title, text, action, align = "left", className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-14",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 className="display-md">{title}</h2>
        {text && <p className="mt-4 text-base leading-relaxed text-muted">{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Title block used at the top of inner pages. */
export function PageHeader({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Container className="pt-12 pb-10 md:pt-16 md:pb-14">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="display-lg max-w-4xl">{title}</h1>
      {text && <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{text}</p>}
      {children}
    </Container>
  );
}

/* ── Commerce ────────────────────────────────────────────────────────────── */

type BadgeTone = "accent" | "wood" | "plain";

const badgeTones: Record<BadgeTone, string> = {
  accent: "bg-accent text-on-accent",
  wood: "bg-wood text-bg",
  plain: "bg-surface text-ink",
};

export function Badge({ tone = "plain", className, ...props }: ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 font-mono text-[10px] leading-none tracking-[0.12em] uppercase",
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Price with optional struck-through original and percentage saved. */
export function Price({
  price,
  compareAt,
  size = "md",
  tone = "default",
  className,
}: {
  price: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg";
  /** "inverse" for dark bands (deal section, footer). */
  tone?: "default" | "inverse";
  className?: string;
}) {
  const inverse = tone === "inverse";
  const sizeClass = { sm: "text-sm", md: "text-base", lg: "text-2xl" }[size];
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", sizeClass, className)}>
      <span className={cn(compareAt && !inverse && "text-wood")}>
        <span className="sr-only">{compareAt ? "Sale price " : "Price "}</span>
        {formatPrice(price)}
      </span>
      {compareAt && (
        <>
          <s className={cn("text-[0.85em]", inverse ? "opacity-60" : "text-muted")}>
            <span className="sr-only">Original price </span>
            {formatPrice(compareAt)}
          </s>
          <span className={cn("font-mono text-[10px] tracking-wider uppercase", !inverse && "text-wood")}>
            −{percentOff(compareAt, price)}%
          </span>
        </>
      )}
    </p>
  );
}

/** Five-star rating with an accessible text equivalent. */
export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xs text-muted", className)}>
      <span className="flex" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative">
              <Star className="size-3.5 text-line" fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="size-3.5 text-wood" fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </span>
      <span className="sr-only">Rated {value} out of 5</span>
      {count !== undefined && <span>({count})</span>}
    </div>
  );
}
