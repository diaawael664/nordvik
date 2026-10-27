/**
 * PRODUCT CATEGORIES
 * `slug` is used in URLs (/shop/sofas/) and in each product's `category`.
 */
import type { ImageRef } from "./images";

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: ImageRef;
};

export const categories: Category[] = [
  {
    slug: "sofas",
    name: "Sofas",
    description: "Deep seats, removable covers, kiln-dried frames.",
    image: "sofa-velvet-green",
  },
  {
    slug: "chairs",
    name: "Chairs",
    description: "Dining, lounge and desk chairs shaped around the body.",
    image: "chair-dove",
  },
  {
    slug: "tables",
    name: "Tables & Desks",
    description: "Solid oak and ash tops that gain character with use.",
    image: "table-round",
  },
  {
    slug: "lighting",
    name: "Lighting",
    description: "Pendants and lamps with warm, glare-free light.",
    image: "lamp-brass",
  },
  { slug: "storage", name: "Storage", description: "Shelving and cabinets that keep a room quiet.", image: "bookcase" },
  {
    slug: "bedroom",
    name: "Bedroom",
    description: "Nightstands, textiles and pieces for slower mornings.",
    image: "nightstand",
  },
  { slug: "decor", name: "Decor", description: "Stoneware, rugs and textiles to finish a room.", image: "ceramics" },
];
