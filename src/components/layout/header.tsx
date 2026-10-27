"use client";

import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, type NavItem } from "@data/navigation";
import { site } from "@data/site";
import { Photo } from "@/components/ui/photo";
import { useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import { useWishlist } from "@/context/wishlist-context";
import { useLayoutSettings } from "@/lib/layout-settings";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { Logo, ThemeToggle } from "./brand";

const iconBtn =
  "relative grid size-10 place-items-center rounded-full transition-colors hover:bg-sand group-data-[transparent=true]/header:hover:bg-white/15";

/** Small count bubble on the cart/wishlist icons. Hidden until client state loads. */
function CountBadge({ count }: { count: number }) {
  const hydrated = useHydrated();
  if (!hydrated || count === 0) return null;
  return (
    <span className="absolute top-0.5 right-0.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 font-mono text-[9px] leading-4 text-on-accent">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function Header() {
  const { count } = useCart();
  const { ids } = useWishlist();
  const { open } = useUI();
  const pathname = usePathname();
  const settings = useLayoutSettings();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const [prevPath, setPrevPath] = useState(pathname);

  // Close any open mega menu when the route changes.
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpenMenu(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu]);

  // Small delay on leave so the pointer can travel from the link into the panel.
  const hoverOpen = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const hoverClose = () => {
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  };

  const active = mainNav.find((i) => i.label === openMenu && i.mega);
  // Overlay header: transparent over the Classic home hero until the visitor scrolls.
  const overlay = settings.header === "overlay" && pathname === "/";
  const transparent = overlay && !scrolled && !active;

  return (
    <header
      data-transparent={transparent}
      className={cn(
        "group/header z-40 border-b transition-[background-color,border-color,color,backdrop-filter] duration-300",
        overlay
          ? scrolled
            ? "fixed inset-x-0 top-0"
            : cn("absolute inset-x-0", site.announcements.length ? "top-9" : "top-0")
          : "sticky top-0",
        transparent
          ? "border-transparent bg-transparent text-white"
          : scrolled || active
            ? "border-line bg-bg/92 backdrop-blur-md"
            : "border-transparent bg-bg",
      )}
      onMouseLeave={hoverClose}
    >
      <div className="mx-auto grid h-16 max-w-site grid-cols-[1fr_auto_1fr] items-center px-2 sm:px-4 lg:h-20 lg:px-10">
        {/* Left: menu button (mobile) / primary nav (desktop) */}
        <div className="flex items-center">
          <button
            type="button"
            className={cn(iconBtn, "lg:hidden")}
            onClick={() => open("menu")}
            aria-label="Open menu"
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </button>
          <button type="button" className={cn(iconBtn, "lg:hidden")} onClick={() => open("search")} aria-label="Search">
            <Search className="size-[18px]" strokeWidth={1.5} />
          </button>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <NavEntry
                  key={item.label}
                  item={item}
                  expanded={openMenu === item.label}
                  current={pathname === item.href}
                  onHover={() => (item.mega ? hoverOpen(item.label) : setOpenMenu(null))}
                  onToggle={() => setOpenMenu((m) => (m === item.label ? null : item.label))}
                />
              ))}
            </ul>
          </nav>
        </div>

        <Logo />

        {/* Right: utilities */}
        <div className="flex items-center justify-end gap-0.5">
          <button
            type="button"
            className={cn(iconBtn, "hidden lg:grid")}
            onClick={() => open("search")}
            aria-label="Search"
          >
            <Search className="size-[18px]" strokeWidth={1.5} />
          </button>
          <ThemeToggle className="hidden sm:grid" />
          <Link href="/account/" className={cn(iconBtn, "hidden sm:grid")} aria-label="Account">
            <User className="size-[18px]" strokeWidth={1.5} />
          </Link>
          <Link href="/wishlist/" className={iconBtn} aria-label={`Wishlist, ${ids.length} saved`}>
            <Heart className="size-[18px]" strokeWidth={1.5} />
            <CountBadge count={ids.length} />
          </Link>
          <button type="button" className={iconBtn} onClick={() => open("cart")} aria-label={`Cart, ${count} items`}>
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
            <CountBadge count={count} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {active?.mega && (
          <m.div
            key={active.label}
            id={`mega-${active.label}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full hidden border-b border-line bg-bg shadow-[0_24px_48px_-24px_rgb(0_0_0/0.18)] lg:block"
            onMouseEnter={() => hoverOpen(active.label)}
          >
            <div className="mx-auto grid max-w-site grid-cols-12 gap-10 px-10 py-12">
              {active.mega.columns.map((col) => (
                <div key={col.title} className="col-span-2">
                  <p className="eyebrow mb-5">{col.title}</p>
                  <ul className="space-y-3">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-[15px] transition-colors hover:text-accent">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {active.mega.feature && (
                <Link
                  href={active.mega.feature.href}
                  className="group col-span-5 col-start-8 grid grid-cols-2 items-center gap-6"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                    <Photo
                      name={active.mega.feature.image}
                      fill
                      sizes="20vw"
                      className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="font-display text-2xl">{active.mega.feature.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{active.mega.feature.text}</p>
                    <span className="mt-4 inline-block text-sm underline underline-offset-4">Explore</span>
                  </div>
                </Link>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

type NavEntryProps = {
  item: NavItem;
  expanded: boolean;
  current: boolean;
  onHover: () => void;
  onToggle: () => void;
};

function NavEntry({ item, expanded, current, onHover, onToggle }: NavEntryProps) {
  const linkClass =
    "relative flex h-10 items-center gap-1 px-3 text-sm tracking-wide transition-colors hover:text-accent group-data-[transparent=true]/header:hover:text-white after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100";

  if (!item.mega) {
    return (
      <li onMouseEnter={onHover}>
        <Link
          href={item.href}
          className={cn(linkClass, current && "after:scale-x-100")}
          aria-current={current ? "page" : undefined}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  // Mega items are buttons: hover opens on desktop, click/Enter toggles for keyboards.
  return (
    <li onMouseEnter={onHover}>
      <button
        type="button"
        className={cn(linkClass, expanded && "text-accent after:scale-x-100")}
        aria-expanded={expanded}
        aria-controls={`mega-${item.label}`}
        onClick={onToggle}
      >
        {item.label}
        <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
      </button>
    </li>
  );
}
