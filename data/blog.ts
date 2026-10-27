/**
 * JOURNAL (BLOG)
 * Post details live here; the article body is an MDX file at
 * content/blog/<slug>.mdx. To add a post: create the .mdx file and add an
 * entry below with the same slug.
 */
import type { ImageKey } from "./images";

export const blogCategories = ["Guides", "Care", "Styling", "Workshop"] as const;
export type BlogCategory = (typeof blogCategories)[number];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  cover: ImageKey;
  author: string;
  /** ISO date. */
  date: string;
  readMinutes: number;
  tags: string[];
};

export const posts: Post[] = [
  {
    slug: "measuring-for-a-new-sofa",
    title: "How to measure for a new sofa (and get it through the door)",
    excerpt: "Four measurements, one roll of masking tape, and the doorway trick our delivery team swears by.",
    category: "Guides",
    cover: "room-wide",
    author: "Lea Andersen",
    date: "2026-10-14",
    readMinutes: 5,
    tags: ["Sofas", "Delivery", "Small spaces"],
  },
  {
    slug: "caring-for-oiled-oak",
    title: "Caring for oiled oak: a once-a-year ritual",
    excerpt:
      "Oiled wood is meant to be touched, marked and renewed. Here's how to keep it looking its best for decades.",
    category: "Care",
    cover: "room-console",
    author: "Mads Kjær",
    date: "2026-09-28",
    readMinutes: 4,
    tags: ["Oak", "Care", "Tables"],
  },
  {
    slug: "inside-the-workshop-vinge",
    title: "Inside the workshop: eleven prototypes of the Vinge chair",
    excerpt: "Two years, one steam box and a lot of broken oak. The story of our most difficult chair.",
    category: "Workshop",
    cover: "chair-wing",
    author: "Ingrid Holm",
    date: "2026-09-09",
    readMinutes: 6,
    tags: ["Chairs", "Design", "Oak"],
  },
  {
    slug: "lighting-in-layers",
    title: "Lighting a room in three layers",
    excerpt: "Why one ceiling light is never enough, and how to place pendants, floor lamps and accent light.",
    category: "Styling",
    cover: "room-reading",
    author: "Ingrid Holm",
    date: "2026-08-21",
    readMinutes: 5,
    tags: ["Lighting", "Living room"],
  },
  {
    slug: "choosing-a-rug-size",
    title: "The right rug size for every room",
    excerpt: "A rug that's too small makes a room feel smaller. Our rules of thumb for living, dining and bedrooms.",
    category: "Guides",
    cover: "room-cream",
    author: "Lea Andersen",
    date: "2026-08-02",
    readMinutes: 4,
    tags: ["Rugs", "Living room", "Bedroom"],
  },
  {
    slug: "small-space-living",
    title: "Furnishing a small apartment without filling it",
    excerpt: "Raised legs, fewer pieces and furniture that does two jobs: ideas from our smallest customers' homes.",
    category: "Styling",
    cover: "room-plants",
    author: "Mads Kjær",
    date: "2026-07-15",
    readMinutes: 5,
    tags: ["Small spaces", "Storage"],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/** Newest first. */
export const sortedPosts = () => [...posts].sort((a, b) => b.date.localeCompare(a.date));
