"use client";

import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { categories, getCategory } from "@/lib/catalog";
import { colorFamilies, pageSize, sortOptions, type SortValue } from "@data/filters";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Container } from "@/components/ui/primitives";
import { RangeSlider } from "@/components/ui/range-slider";
import {
  activeCount,
  allMaterials,
  applyFilters,
  categoryCounts,
  defaultFilters,
  parseFilters,
  priceBounds,
  serializeFilters,
  type Filters,
} from "@/lib/shop";
import { useLayoutSettings } from "@/lib/layout-settings";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Shop page bound to the URL. The category is part of the path
 * (/shop/sofas/) so every category has its own indexable page; refinements
 * live in the query string (?color=Green&sort=price-asc).
 *
 * The static HTML is rendered with default filters, then the query string is
 * applied after hydration. Reading it in a separate, invisible component keeps
 * the server-rendered product grid in place (instead of replacing it), which
 * makes the page paint fast and keeps images from reloading.
 */
export function ShopView({ category }: { category?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const parsed = parseFilters(new URLSearchParams(query));
  // Old links like /shop/?category=sofas still work.
  const filters = { ...parsed, category: category ?? parsed.category };

  const update = (next: Partial<Filters>) => {
    const merged = { ...filters, ...next };
    const qs = serializeFilters({ ...merged, category: null });
    const path = merged.category ? `/shop/${merged.category}/` : "/shop/";
    const href = qs ? `${path}?${qs}` : path;
    if (path === pathname) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  };

  return (
    <>
      <Suspense fallback={null}>
        <QueryReader onChange={setQuery} />
      </Suspense>
      <ShopLayout filters={filters} update={update} />
    </>
  );
}

/** Reports the current query string to ShopView; renders nothing. */
function QueryReader({ onChange }: { onChange: (query: string) => void }) {
  const query = useSearchParams().toString();
  useEffect(() => onChange(query), [query, onChange]);
  return null;
}

type LayoutProps = { filters: Filters; update: (next: Partial<Filters>) => void };

function ShopLayout({ filters, update }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topOpen, setTopOpen] = useState(false);
  const { shopFilters } = useLayoutSettings();
  const isTop = shopFilters === "top";
  const results = applyFilters(filters);
  const category = filters.category ? getCategory(filters.category) : undefined;
  const refinements = activeCount(filters);

  // "Load more" resets whenever the result set changes.
  const resultKey = serializeFilters({ ...filters, view: "grid" });
  const [shown, setShown] = useState({ key: resultKey, count: pageSize });
  if (shown.key !== resultKey) setShown({ key: resultKey, count: pageSize });
  const visible = results.slice(0, shown.count);

  const title = filters.query ? `Results for “${filters.query}”` : (category?.name ?? "All products");

  return (
    <>
      <Container className="pt-10 pb-8 md:pt-14">
        <nav aria-label="Breadcrumb" className="mb-6 font-mono text-[11px] tracking-wider text-muted uppercase">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              {category ? (
                <Link href="/shop/" className="hover:text-ink">
                  Shop
                </Link>
              ) : (
                <span aria-current="page">Shop</span>
              )}
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li aria-current="page">{category.name}</li>
              </>
            )}
          </ol>
        </nav>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="display-lg">{title}</h1>
            <p className="mt-3 max-w-xl text-muted">
              {category?.description ??
                "Solid-wood furniture, lighting and objects, designed in Copenhagen and made in small batches."}
            </p>
          </div>
          <p className="font-mono text-xs text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
        </div>
      </Container>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 border-y border-line bg-bg/95 backdrop-blur lg:top-20">
        <Container className="flex h-14 items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 items-center gap-2 text-sm lg:hidden"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            Filters{refinements > 0 && ` (${refinements})`}
          </button>
          {/* "Top" layout: filters open in a panel under the toolbar on desktop. */}
          <button
            type="button"
            onClick={() => setTopOpen((o) => !o)}
            aria-expanded={topOpen}
            aria-controls="shop-top-filters"
            className={cn("hidden h-10 items-center gap-2 text-sm", isTop && "lg:flex")}
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            {topOpen ? "Hide filters" : "Filters"}
            {refinements > 0 && ` (${refinements})`}
          </button>
          <ActiveChips filters={filters} update={update} />
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="sort" className="sr-only">
              Sort products
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortValue })}
              className="h-10 cursor-pointer rounded-base border border-line bg-surface pr-8 pl-3 text-sm outline-none focus:border-ink"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="hidden border border-line sm:flex" role="group" aria-label="Layout">
              {(
                [
                  ["grid", LayoutGrid, "Grid view"],
                  ["list", List, "List view"],
                ] as const
              ).map(([v, Icon, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-label={label}
                  aria-pressed={filters.view === v}
                  onClick={() => update({ view: v })}
                  className={cn(
                    "grid size-10 place-items-center transition-colors",
                    filters.view === v ? "bg-ink text-bg" : "hover:bg-sand",
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>
        </Container>
        {isTop && topOpen && (
          <div id="shop-top-filters" className="hidden border-t border-line bg-bg lg:block">
            <Container className="py-8">
              <FilterPanel filters={filters} update={update} columns />
            </Container>
          </div>
        )}
      </div>

      <Container
        className={cn(
          "grid gap-12 py-10 lg:gap-14 lg:py-14",
          shopFilters === "left" && "lg:grid-cols-[15rem_1fr]",
          shopFilters === "right" && "lg:grid-cols-[1fr_15rem]",
        )}
      >
        {!isTop && (
          <aside aria-label="Filters" className={cn("hidden lg:block", shopFilters === "right" && "lg:order-last")}>
            <FilterPanel filters={filters} update={update} />
          </aside>
        )}

        <section aria-labelledby="products-heading">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>
          {results.length === 0 ? (
            <div className="flex flex-col items-start gap-5 border border-dashed border-line px-6 py-16 sm:items-center sm:text-center">
              <p className="font-display text-2xl">No products match these filters</p>
              <p className="max-w-md text-muted">
                Remove a filter or widen the price range. There are {products.length} pieces in the full collection.
              </p>
              <Button
                variant="outline"
                onClick={() => update({ ...defaultFilters, sort: filters.sort, view: filters.view })}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  filters.view === "grid"
                    ? cn(
                        "grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 xl:grid-cols-3",
                        isTop && "lg:grid-cols-3 xl:grid-cols-4",
                      )
                    : "flex flex-col gap-10 divide-line",
                )}
              >
                {visible.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    layout={filters.view}
                    priority={i < 2}
                    sizes={
                      filters.view === "list"
                        ? "(min-width: 640px) 30vw, 100vw"
                        : "(min-width: 1280px) 25vw, (min-width: 1024px) 35vw, 50vw"
                    }
                  />
                ))}
              </div>
              <div className="mt-16 flex flex-col items-center gap-4">
                <p className="font-mono text-xs text-muted">
                  Showing {visible.length} of {results.length}
                </p>
                <div className="h-px w-48 bg-line">
                  <div className="h-px bg-ink" style={{ width: `${(visible.length / results.length) * 100}%` }} />
                </div>
                {visible.length < results.length && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShown({ key: resultKey, count: shown.count + pageSize })}
                  >
                    Load more
                  </Button>
                )}
              </div>
            </>
          )}
        </section>
      </Container>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Filters"
        side="left"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => update({ ...defaultFilters, sort: filters.sort })}>
              Clear all
            </Button>
            <Button onClick={() => setMobileOpen(false)}>Show {results.length} results</Button>
          </div>
        }
      >
        <div className="px-5 py-6">
          <FilterPanel filters={filters} update={update} />
        </div>
      </Drawer>
    </>
  );
}

/* ── Filter panel ────────────────────────────────────────────────────────── */

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line pb-7">
      <legend className="eyebrow mb-4 text-ink">{title}</legend>
      {children}
    </fieldset>
  );
}

function Check({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-[var(--accent)]" />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="font-mono text-[11px] text-muted">{count}</span>}
    </label>
  );
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function FilterPanel({ filters, update, columns = false }: LayoutProps & { columns?: boolean }) {
  // Keep selected materials visible even when the list is collapsed.
  const [showAllMaterials, setShowAllMaterials] = useState(() =>
    filters.materials.some((m) => allMaterials.indexOf(m) >= 6),
  );
  const counts = categoryCounts(filters);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div
      className={columns ? "grid grid-cols-5 gap-8 [&>fieldset]:border-b-0 [&>fieldset]:pb-0" : "flex flex-col gap-7"}
    >
      <FilterGroup title="Category">
        <ul className="space-y-0.5 text-sm">
          {[{ slug: null, name: "All products" }, ...categories].map((c) => {
            const active = filters.category === c.slug;
            const count = c.slug ? (counts[c.slug] ?? 0) : total;
            return (
              <li key={c.slug ?? "all"}>
                <button
                  type="button"
                  onClick={() => update({ category: c.slug })}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-center justify-between py-1.5 text-left transition-colors hover:text-accent",
                    active && "font-semibold text-ink",
                    !active && count === 0 && "text-muted",
                  )}
                >
                  {c.name}
                  <span className="font-mono text-[11px] font-normal text-muted">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Price">
        <RangeSlider
          label="Price range"
          min={priceBounds.min}
          max={priceBounds.max}
          value={[filters.minPrice ?? priceBounds.min, filters.maxPrice ?? priceBounds.max]}
          onCommit={([lo, hi]) => update({ minPrice: lo, maxPrice: hi })}
        />
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2.5">
          {colorFamilies.map((c) => {
            const on = filters.colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={on}
                onClick={() => update({ colors: toggle(filters.colors, c.name) })}
                className={cn(
                  "size-7 rounded-full ring-1 ring-ink/15 ring-offset-2 ring-offset-bg transition-shadow",
                  on && "ring-2 ring-ink",
                )}
                style={{ background: c.hex }}
              />
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Material">
        {(showAllMaterials ? allMaterials : allMaterials.slice(0, 6)).map((m) => (
          <Check
            key={m}
            label={m}
            checked={filters.materials.includes(m)}
            onChange={() => update({ materials: toggle(filters.materials, m) })}
          />
        ))}
        {allMaterials.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAllMaterials((v) => !v)}
            aria-expanded={showAllMaterials}
            className="mt-2 text-xs underline underline-offset-4"
          >
            {showAllMaterials ? "Show fewer" : `Show all ${allMaterials.length}`}
          </button>
        )}
      </FilterGroup>

      <FilterGroup title="Availability">
        <Check label="In stock" checked={filters.inStock} onChange={() => update({ inStock: !filters.inStock })} />
        <Check label="On sale" checked={filters.onSale} onChange={() => update({ onSale: !filters.onSale })} />
      </FilterGroup>
    </div>
  );
}

/* ── Active filter chips ─────────────────────────────────────────────────── */

function ActiveChips({ filters, update }: LayoutProps) {
  const chips: { label: string; clear: Partial<Filters> }[] = [
    ...filters.colors.map((c) => ({ label: c, clear: { colors: filters.colors.filter((x) => x !== c) } })),
    ...filters.materials.map((m) => ({ label: m, clear: { materials: filters.materials.filter((x) => x !== m) } })),
  ];
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    chips.push({
      label: `${formatPrice(filters.minPrice ?? priceBounds.min)}–${formatPrice(filters.maxPrice ?? priceBounds.max)}`,
      clear: { minPrice: null, maxPrice: null },
    });
  }
  if (filters.inStock) chips.push({ label: "In stock", clear: { inStock: false } });
  if (filters.onSale) chips.push({ label: "On sale", clear: { onSale: false } });
  if (filters.query) chips.push({ label: `“${filters.query}”`, clear: { query: "" } });

  if (chips.length === 0) return null;
  return (
    <ul className="hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto lg:flex" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.label}>
          <button
            type="button"
            onClick={() => update(c.clear)}
            className="flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs whitespace-nowrap transition-colors hover:border-ink"
            aria-label={`Remove filter: ${c.label}`}
          >
            {c.label}
            <X className="size-3" />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() =>
            update({ ...defaultFilters, category: filters.category, sort: filters.sort, view: filters.view })
          }
          className="px-2 text-xs whitespace-nowrap underline underline-offset-4"
        >
          Clear all
        </button>
      </li>
    </ul>
  );
}
