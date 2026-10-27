/**
 * STORE INFORMATION
 * Name, contact details, currency and global copy. Edit freely — components
 * read everything from here.
 */
import type { ImageKey } from "./images";

export type ImageMode = "unsplash" | "mirror" | "placeholder";

export const site = {
  name: "Nordhaus",
  /** Shown after the store name in browser tabs: "Shop — Nordhaus". */
  tagline: "Furniture made to be lived with",
  description:
    "Nordhaus makes solid-wood furniture, lighting and objects for calm, considered homes. Designed in Copenhagen, built to last decades.",
  /** Used for canonical URLs, Open Graph and the sitemap. No trailing slash. */
  url: "https://nordhaus.example.com",
  /** Optional logo image in /public. Leave empty to render the name as a wordmark. */
  logo: "",
  /**
   * Where products come from (see src/lib/catalog.ts):
   * "local" = data/products.ts, "shopify" = synced by `npm run catalog:shopify`.
   */
  catalogSource: "local" as "local" | "shopify",
  /**
   * What "Checkout" does (see src/lib/commerce.ts):
   * "demo" = the built-in checkout page (no payment taken),
   * "shopify" = hands the cart to Shopify's hosted checkout.
   */
  checkoutMode: "demo" as "demo" | "shopify",
  locale: "en-US",
  currency: "USD",

  /**
   * "unsplash"    — demo photos loaded from Unsplash (data/images.ts)
   * "mirror"      — the same photos served from this site (run `npm run demo:images` first)
   * "placeholder" — neutral local placeholders (run `npm run placeholders` first)
   * The NEXT_PUBLIC_IMAGE_MODE environment variable overrides this at build time.
   */
  imageMode: "unsplash" as ImageMode,

  contact: {
    email: "hello@nordhaus.example.com",
    phone: "+1 (212) 555-0148",
    hours: "Mon–Sat, 10:00–19:00",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Pinterest", href: "https://pinterest.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
  ],

  /** Messages rotate in the announcement bar. Empty array hides the bar. */
  announcements: [
    "Free delivery on orders over $750",
    "Autumn Edit — up to 25% off selected oak pieces",
    "Visit our new showroom in Brooklyn",
  ],

  /** The four promises in the features bar. `icon` is a lucide-react icon name. */
  features: [
    { icon: "Truck", title: "Free delivery", text: "On orders over $750, placed in the room of your choice." },
    { icon: "RotateCcw", title: "100-night trial", text: "Live with it first. Free returns if it isn't right." },
    { icon: "ShieldCheck", title: "10-year warranty", text: "On every frame, joint and drawer runner we make." },
    { icon: "Lock", title: "Secure checkout", text: "Encrypted payments with all major cards and wallets." },
  ],

  /** Free-shipping threshold used by the cart progress meter. */
  freeShippingThreshold: 750,
  /** Flat shipping fee below the threshold. */
  shippingFee: 49,
  /** Sales tax shown in checkout (demo only). */
  taxRate: 0.08,

  /** Demo discount codes accepted in the cart (case-insensitive). */
  promoCodes: [
    { code: "WELCOME10", percent: 10, description: "10% off your first order" },
    { code: "AUTUMN15", percent: 15, description: "15% off the Autumn Edit" },
  ],

  /** Shown in the "Shipping & returns" tab on every product page. */
  shippingInfo: [
    {
      title: "Delivery",
      text: "Free white-glove delivery on orders over $750: we carry it to the room of your choice, unpack it and take the packaging away. Smaller orders ship for a flat $49. You'll choose a delivery slot once your order is ready.",
    },
    {
      title: "100-night trial",
      text: "If a piece isn't right for your home, tell us within 100 nights of delivery. We'll collect it for free and refund you in full. Made-to-order pieces can be returned within 30 days.",
    },
    {
      title: "Warranty",
      text: "Every frame, joint and drawer runner is covered for 10 years. Upholstery and finishes are covered for 2 years against manufacturing faults.",
    },
  ],

  /** The /coming-soon/ page (use it as a pre-launch landing page). */
  comingSoon: {
    title: "Something new is taking shape",
    text: "Our Copenhagen flagship opens this winter: three floors of furniture, a working joinery and a café. Leave your email to be first through the door.",
    launchAt: "2026-12-12T10:00:00",
    /** Demo only: restarts the countdown on this cycle once the date passes. 0 = stop at zero. */
    repeatEveryDays: 30,
    image: "room-studio" as ImageKey,
  },

  newsletter: {
    title: "Letters from the workshop",
    text: "New pieces, care guides and the occasional quiet sale. One email a month.",
    image: "room-sunlight" as ImageKey,
    /** Optional pop-up. Shown once, then not again for `daysBetween` days. */
    popup: { enabled: true, delaySeconds: 25, daysBetween: 14, offer: "10% off your first order" },
  },

  /** Cookie banner and analytics (see src/lib/analytics.ts). */
  analytics: {
    /** Show the cookie consent banner. Turn off if you don't use cookies or tracking. */
    cookieBanner: true,
    /** Only send events after the visitor accepts analytics cookies. */
    requireConsent: true,
    /** Log every event to the browser console while you set up tracking. */
    debug: false,
  },

  /** Demo-only features. Turn these off before going live. */
  demo: {
    /** Floating "Customize" panel for trying themes and layouts. */
    styleSwitcher: true,
    /** Where the "Buy this template" buttons on /demos/ link (your marketplace listing). */
    purchaseUrl: "https://themeforest.net/",
  },
};

export type Site = typeof site;
