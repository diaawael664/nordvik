/**
 * HOME PAGE CONTENT
 * Hero slides, the limited-time deal, press mentions and the social gallery.
 * Shared by all three home layouts.
 */
import type { ImageKey } from "./images";

export type HeroSlide = {
  image: ImageKey;
  eyebrow: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Product shown in the "On view" caption; its dimensions are printed. */
  featuredProduct?: string;
};

export const heroSlides: HeroSlide[] = [
  {
    image: "room-open-living",
    eyebrow: "Autumn Edit 2026",
    title: "Furniture made to be lived with",
    text: "Solid wood, honest joinery and fabrics that soften with use. Built in small batches for homes that get used.",
    cta: { label: "Shop the collection", href: "/shop/" },
    secondary: { label: "Our workshop", href: "/about/" },
    featuredProduct: "dune-modular-sofa",
  },
  {
    image: "room-amber",
    eyebrow: "New this season",
    title: "Warm oak for the darker months",
    text: "Rust velvet, brushed brass and oiled oak: pieces chosen to make a room glow after four o'clock.",
    cta: { label: "Shop new arrivals", href: "/shop/?sort=newest" },
    featuredProduct: "ember-loveseat",
  },
  {
    image: "room-dining-green",
    eyebrow: "Dining",
    title: "A table worth gathering around",
    text: "Chairs that stay comfortable through the second bottle, and tables that seat one more than you planned.",
    cta: { label: "Shop dining", href: "/shop/chairs/" },
    featuredProduct: "hedda-dining-chair",
  },
];

/** Limited-time offer with countdown. */
export const deal = {
  eyebrow: "Limited time",
  title: "The Saga sofa, 15% off",
  text: "Full-grain aniline leather on a solid walnut base. While this batch lasts, it's $440 off.",
  product: "saga-leather-sofa",
  image: "room-gallery-wall" as ImageKey,
  /** ISO date-time the offer ends. */
  endsAt: "2026-11-30T23:59:59",
  /**
   * Demo convenience: once `endsAt` has passed, the timer restarts on a cycle
   * of this many days, so the live preview never shows an expired offer.
   * Set to 0 for a real one-off deadline.
   */
  repeatEveryDays: 3,
};

/** "As featured in" strip. Fictional publications set in type, not logos. */
export const press: { name: string; style: "serif" | "sans" | "mono" | "italic" }[] = [
  { name: "Hearth & Grain", style: "serif" },
  { name: "NORTHERN ROOMS", style: "sans" },
  { name: "The Slow Home", style: "italic" },
  { name: "dwell/well", style: "mono" },
  { name: "Atelier Quarterly", style: "serif" },
  { name: "OAK + IRON", style: "sans" },
];

/** Social gallery tiles (Instagram-style). */
export const gallery: { image: ImageKey; caption: string }[] = [
  { image: "room-mirrors", caption: "Morning light, Copenhagen" },
  { image: "room-reading", caption: "The reading corner" },
  { image: "room-console", caption: "Entry, sage walls" },
  { image: "room-bedroom-warm", caption: "Layered linen" },
  { image: "room-dining-garden", caption: "Supper by the garden" },
  { image: "room-rattan", caption: "Rattan & low light" },
];

export const socialHandle = "@nordhaus.home";

/* ── Home 2 — Editorial ─────────────────────────────────────────────────── */

export const editorial = {
  issue: "The Autumn Issue · 2026",
  title: ["Rooms that", "hold the", "light."],
  intro:
    "Low sun, warm oak and fabrics you want to touch. This season's edit is about the hours between four o'clock and bedtime.",
  heroImages: ["room-amber", "lamp-brass"] as ImageKey[],
  /** Feature stories in the asymmetric grid. */
  features: [
    {
      eyebrow: "Lookbook",
      title: "Soft neutrals for north-facing rooms",
      href: "/collections/#soft-neutrals",
      image: "room-cream" as ImageKey,
    },
    {
      eyebrow: "Workshop",
      title: "Eleven prototypes for one chair",
      href: "/blog/inside-the-workshop-vinge/",
      image: "chair-wing" as ImageKey,
    },
    {
      eyebrow: "Guide",
      title: "Lighting a room in three layers",
      href: "/blog/lighting-in-layers/",
      image: "room-reading" as ImageKey,
    },
  ],
  /** Collection slug (data/collections.ts) used for the "Shop the room" section. */
  shopTheRoom: "long-evenings",
  quote: {
    text: "We design for the second decade of a piece's life, not the first photograph.",
    author: "Ingrid Holm",
    role: "Head of Design",
    image: "team-1" as ImageKey,
  },
  /** Product slugs for "The edit": the first is shown large. */
  edit: ["dune-modular-sofa", "kupol-brass-pendant", "ember-loveseat", "lera-stoneware-cups", "natt-nightstand"],
};

/* ── Home 3 — Bold modern ───────────────────────────────────────────────── */

export const modern = {
  hero: {
    eyebrow: "New: the Orbit swivel chair",
    title: "Sit down. Stay a while.",
    text: "Bouclé that holds its loops for years, on a solid oak base that turns a quiet 360°.",
    product: "orbit-swivel-chair",
    /** Shown beside the headline; the product's dimensions are drawn on it. */
    image: "chair-swivel" as ImageKey,
    cta: { label: "Shop Orbit", href: "/product/orbit-swivel-chair/" },
    secondary: { label: "All new arrivals", href: "/shop/?sort=newest" },
  },
  /** Marquee words under the hero. */
  ticker: ["Solid oak", "Repairable by design", "Free delivery over $750", "100-night trial", "Made in Copenhagen"],
  video: {
    eyebrow: "Made by hand",
    title: "Every frame is still signed by the person who built it.",
    text: "Forty-two makers, one workshop, no shortcuts.",
    /**
     * Background video. Leave `src` empty to show the poster image only.
     * Demo clip: "Hands of a carpenter carving wood with a chisel", Mixkit
     * (mixkit.co, Mixkit Free License). Not included in the download package;
     * placeholder image mode shows the poster only. See CREDITS.md.
     */
    src: "https://assets.mixkit.co/videos/39500/39500-720.mp4",
    poster: "still-chair" as ImageKey,
    cta: { label: "Our story", href: "/about/" },
  },
};
