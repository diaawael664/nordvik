/**
 * PRODUCT REVIEWS (demo content)
 * Each category has a small pool of reviews; every product in that category
 * shows them. Replace with real reviews from your platform, or add
 * product-specific ones to `byProduct`.
 */
import type { Product } from "./products";

export type Review = {
  author: string;
  location: string;
  /** ISO date. */
  date: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
};

const pools: Record<string, Review[]> = {
  seating: [
    {
      author: "Hannah W.",
      location: "Seattle, WA",
      date: "2026-09-14",
      rating: 5,
      title: "Comfortable for hours",
      body: "Firm enough to sit up straight, soft enough to fall asleep on. The fabric has survived a toddler and a dog without a mark.",
      verified: true,
    },
    {
      author: "Marcus O.",
      location: "Denver, CO",
      date: "2026-08-02",
      rating: 5,
      title: "Worth the wait",
      body: "It took the full lead time to arrive, but the build quality explains why. Every seam is straight and the legs are solid wood all the way through.",
      verified: true,
    },
    {
      author: "Elin S.",
      location: "Minneapolis, MN",
      date: "2026-06-21",
      rating: 4,
      title: "Beautiful, slightly firm at first",
      body: "The seat was firmer than I expected for the first two weeks. It has softened nicely since and now it's perfect.",
      verified: true,
    },
  ],
  tables: [
    {
      author: "Jonas R.",
      location: "Boston, MA",
      date: "2026-09-03",
      rating: 5,
      title: "The grain is stunning",
      body: "Photos don't show how lovely the oak is in person. Assembly took ten minutes and nothing wobbles.",
      verified: true,
    },
    {
      author: "Clara M.",
      location: "Philadelphia, PA",
      date: "2026-07-19",
      rating: 5,
      title: "Sized exactly as listed",
      body: "I checked the dimensions twice against my space and it fits to the centimeter. The oil finish has held up to daily use.",
      verified: true,
    },
    {
      author: "Ade B.",
      location: "Atlanta, GA",
      date: "2026-05-30",
      rating: 4,
      title: "Solid and well made",
      body: "Heavier than I expected, which I take as a good sign. Wish it came with a care kit, but the finish is easy to look after.",
      verified: false,
    },
  ],
  lighting: [
    {
      author: "Sofia L.",
      location: "San Diego, CA",
      date: "2026-09-22",
      rating: 5,
      title: "Warm, even light",
      body: "No glare at all with a warm LED bulb. It makes the whole corner feel calmer in the evening.",
      verified: true,
    },
    {
      author: "Ben T.",
      location: "Nashville, TN",
      date: "2026-08-11",
      rating: 4,
      title: "Easy to install",
      body: "Our electrician had it up in fifteen minutes. The cord length is generous, so we could hang it at exactly the height we wanted.",
      verified: true,
    },
    {
      author: "Nora K.",
      location: "Chicago, IL",
      date: "2026-06-05",
      rating: 5,
      title: "Looks expensive",
      body: "Friends always ask where it's from. The finish is even and the shade feels substantial, not thin.",
      verified: true,
    },
  ],
  home: [
    {
      author: "Ines P.",
      location: "Brooklyn, NY",
      date: "2026-09-29",
      rating: 5,
      title: "Lovely quality",
      body: "The materials feel considered and the color is exactly as pictured. Packaging was plastic-free, too.",
      verified: true,
    },
    {
      author: "Liam D.",
      location: "Portland, OR",
      date: "2026-08-17",
      rating: 5,
      title: "Bought a second one",
      body: "Liked the first so much I ordered another for the guest room. Arrived in three days.",
      verified: true,
    },
    {
      author: "Yuki H.",
      location: "Austin, TX",
      date: "2026-07-08",
      rating: 4,
      title: "Subtle and well made",
      body: "Slightly more muted in color than on my screen, which I actually prefer. Washes well.",
      verified: true,
    },
  ],
};

const poolFor: Record<string, keyof typeof pools> = {
  sofas: "seating",
  chairs: "seating",
  tables: "tables",
  storage: "tables",
  lighting: "lighting",
  bedroom: "home",
  decor: "home",
};

/** Product-specific reviews, keyed by product slug. Shown before the category pool. */
const byProduct: Record<string, Review[]> = {
  "fjell-three-seat-sofa": [
    {
      author: "Astrid L.",
      location: "Brooklyn, NY",
      date: "2026-10-02",
      rating: 5,
      title: "Deep enough to nap on, firm enough to read",
      body: "We sit cross-legged on it most nights. The velvet hasn't crushed where we sit, and the removable covers were the deciding factor with two cats.",
      verified: true,
    },
  ],
  "lund-dining-chair": [
    {
      author: "Priya S.",
      location: "Austin, TX",
      date: "2026-09-19",
      rating: 5,
      title: "Bought one to test, came back for seven",
      body: "Light enough for the kids to carry, and the padded seat makes a long dinner comfortable. The Pine color is darker in person and lovely against oak.",
      verified: true,
    },
  ],
  "vinge-lounge-chair": [
    {
      author: "Tom H.",
      location: "Portland, OR",
      date: "2026-08-30",
      rating: 5,
      title: "Beautiful from every side",
      body: "The bent oak frame is the first thing guests touch. It reclines more than it looks, and the signature under the seat is a lovely detail.",
      verified: true,
    },
  ],
  "dune-modular-sofa": [
    {
      author: "Sam & Jo R.",
      location: "Oakland, CA",
      date: "2026-09-07",
      rating: 5,
      title: "We've rearranged it four times already",
      body: "The clips are solid and the modules don't drift apart. Washing the linen covers at 30°C worked exactly as promised.",
      verified: true,
    },
  ],
};

export function getReviews(product: Product): Review[] {
  // Never attach demo reviews to products synced from a real store.
  if (product.external) return byProduct[product.slug] ?? [];
  return [...(byProduct[product.slug] ?? []), ...(pools[poolFor[product.category]] ?? pools.home)];
}
