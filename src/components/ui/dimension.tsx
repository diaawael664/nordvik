import { cn } from "@/lib/utils";

type DimensionProps = {
  /** Text in the gap, e.g. "W 214 cm". */
  label: string;
  axis?: "x" | "y";
  /**
   * "always" — static callout (product pages, spec diagrams)
   * "hover"  — draws in from the center when an ancestor `.group` is hovered
   */
  reveal?: "always" | "hover";
  /**
   * "photo" — dark line with a light label chip, legible over any photograph
   * "plain" — inherits the surrounding text color (for flat backgrounds)
   */
  tone?: "photo" | "plain";
  className?: string;
};

/**
 * The template's signature detail: a technical-drawing dimension line with
 * end ticks and a measurement label, like the callouts on a furniture spec
 * sheet. Position it absolutely over an image or use it inline.
 */
export function Dimension({ label, axis = "x", reveal = "always", tone = "photo", className }: DimensionProps) {
  const horizontal = axis === "x";
  const draw =
    reveal === "hover"
      ? cn(
          "transition-transform duration-700 ease-soft group-hover:scale-100 group-focus-within:scale-100",
          horizontal ? "scale-x-0" : "scale-y-0",
        )
      : "";
  const fade =
    reveal === "hover"
      ? "opacity-0 transition-opacity delay-200 duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
      : "";

  const labelClass = cn(
    "font-mono text-[10px] leading-none tracking-[0.14em] whitespace-nowrap uppercase",
    tone === "photo" && "bg-on-inverse/90 px-1.5 py-1 text-inverse",
  );
  const tick = horizontal ? "h-2.5 w-px" : "h-px w-2.5";
  const line = horizontal ? "h-px flex-1" : "w-px flex-1";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none flex items-center",
        tone === "photo" ? "text-inverse/80" : "text-current",
        horizontal ? "flex-row" : "flex-col",
        className,
      )}
    >
      <span className={cn("bg-current", tick, fade)} />
      <span className={cn("bg-current", line, draw, horizontal ? "origin-right" : "origin-bottom")} />
      {horizontal ? (
        <span className={cn(labelClass, "mx-2", fade)}>{label}</span>
      ) : (
        // Reserve the label's length along the axis, then rotate the text into it.
        <span className={cn("relative w-3 shrink-0", fade)} style={{ height: `${label.length * 0.82 + 2.5}em` }}>
          <span className={cn(labelClass, "absolute top-1/2 left-1/2 -translate-1/2 -rotate-90")}>{label}</span>
        </span>
      )}
      <span className={cn("bg-current", line, draw, horizontal ? "origin-left" : "origin-top")} />
      <span className={cn("bg-current", tick, fade)} />
    </div>
  );
}
