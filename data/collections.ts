/**
 * COLLECTIONS & LOOKBOOK
 * Each collection is a styled room. Hotspots mark products in the photo:
 * `x` and `y` are percentages from the image's top-left corner.
 * `ratio` must match the photo's real proportions (width / height) so the
 * hotspots stay on the right objects at every screen size.
 */
import type { ImageKey } from "./images";

export type Hotspot = { product: string; x: number; y: number };

export type Collection = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  image: ImageKey;
  ratio: string;
  hotspots: Hotspot[];
};

export const collections: Collection[] = [
  {
    slug: "long-evenings",
    title: "A room for long evenings",
    eyebrow: "Living · Autumn Edit",
    description:
      "A low modular sofa you can sprawl across, a wool rug underfoot and soft pendant light from the kitchen beyond.",
    image: "room-open-living",
    ratio: "900 / 612",
    hotspots: [
      { product: "dune-modular-sofa", x: 25, y: 68 },
      { product: "atlas-wool-rug", x: 52, y: 88 },
      { product: "kvist-bar-stool", x: 51, y: 54 },
      { product: "halo-pendant", x: 48, y: 39 },
    ],
  },
  {
    slug: "soft-neutrals",
    title: "Soft neutrals",
    eyebrow: "Living · Calm",
    description:
      "Chalk linen, raw rattan and pale timber: a palette that makes a north-facing room feel bright all day.",
    image: "room-cream",
    ratio: "16 / 9",
    hotspots: [
      { product: "dune-modular-sofa", x: 62, y: 63 },
      { product: "brisk-armchair", x: 19, y: 70 },
      { product: "ask-stool", x: 33, y: 66 },
      { product: "atlas-wool-rug", x: 72, y: 92 },
    ],
  },
  {
    slug: "green-dining",
    title: "The green dining room",
    eyebrow: "Dining · Gathering",
    description: "Pine velvet chairs around a long table, brass details and a lamp that stays on after dessert.",
    image: "room-dining-green",
    ratio: "16 / 9",
    hotspots: [
      { product: "hedda-dining-chair", x: 37, y: 74 },
      { product: "beam-floor-lamp", x: 26, y: 33 },
      { product: "mint-ceramic-planter", x: 17, y: 74 },
      { product: "atlas-wool-rug", x: 46, y: 93 },
    ],
  },
  {
    slug: "slow-mornings",
    title: "Slow mornings",
    eyebrow: "Bedroom · Rest",
    description: "Layered linen in rust and sage, a nightstand within reach and plants that like the morning sun.",
    image: "room-bedroom-warm",
    ratio: "1 / 1",
    hotspots: [
      { product: "strand-linen-cushion", x: 37, y: 57 },
      { product: "natt-nightstand", x: 8, y: 70 },
      { product: "mint-ceramic-planter", x: 55, y: 57 },
    ],
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
