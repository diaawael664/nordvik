"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { CartProvider } from "@/context/cart-context";
import { UIProvider } from "@/context/ui-context";
import { WishlistProvider } from "@/context/wishlist-context";

/*
 * Overlays aren't needed for the first paint, so they load right after it.
 * This keeps their code (search, drawers, dialogs, banners) off the critical path.
 */
const SearchOverlay = dynamic(() => import("./layout/overlays").then((m) => m.SearchOverlay), { ssr: false });
const MobileMenu = dynamic(() => import("./layout/overlays").then((m) => m.MobileMenu), { ssr: false });
const MiniCart = dynamic(() => import("./layout/overlays").then((m) => m.MiniCart), { ssr: false });
const QuickView = dynamic(() => import("./product/quick-view").then((m) => m.QuickView), { ssr: false });
const Toaster = dynamic(() => import("./layout/toaster").then((m) => m.Toaster), { ssr: false });
const CookieBanner = dynamic(() => import("./layout/cookie-banner").then((m) => m.CookieBanner), { ssr: false });
const StyleSwitcher = dynamic(() => import("./layout/style-switcher").then((m) => m.StyleSwitcher), { ssr: false });
const NewsletterPopup = dynamic(() => import("./layout/newsletter-popup").then((m) => m.NewsletterPopup), {
  ssr: false,
});

/** Animation features load after first paint (see src/lib/motion-features.ts). */
const loadMotion = () => import("@/lib/motion-features").then((m) => m.default);

/** Client-side state (theme, cart, wishlist, overlays) for the whole site. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadMotion} strict>
          <UIProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <SearchOverlay />
                <MobileMenu />
                <MiniCart />
                <QuickView />
                <Toaster />
                <CookieBanner />
                <StyleSwitcher />
                <NewsletterPopup />
              </WishlistProvider>
            </CartProvider>
          </UIProvider>
        </LazyMotion>
      </MotionConfig>
    </ThemeProvider>
  );
}
