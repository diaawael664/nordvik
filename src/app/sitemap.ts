import type { MetadataRoute } from "next";
import { blogCategories, posts } from "@data/blog";
import { site } from "@data/site";
import { categorySlug } from "@/components/blog/blog-parts";
import { categories, products } from "@/lib/catalog";
import { getImage } from "@/lib/utils";

// Static export: generated once at build time into /out/sitemap.xml.
export const dynamic = "force-static";

/** Every public page. Cart, checkout and account pages are excluded on purpose. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const today = new Date().toISOString().slice(0, 10);
  const pages = [
    "/",
    "/home-editorial/",
    "/home-modern/",
    "/shop/",
    "/collections/",
    "/about/",
    "/blog/",
    "/contact/",
    "/faq/",
    "/shipping-returns/",
    "/privacy/",
    "/terms/",
    "/cookies/",
  ];

  return [
    ...pages.map((p) => ({ url: url(p), lastModified: today, priority: p === "/" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: url(`/shop/${c.slug}/`), lastModified: today, priority: 0.8 })),
    ...products.map((p) => {
      const src = getImage(p.images[0]).src;
      return {
        url: url(`/product/${p.slug}/`),
        lastModified: p.createdAt,
        priority: 0.9,
        images: [src.startsWith("http") ? `${src}?w=1200&q=80&auto=format` : url(src)],
      };
    }),
    ...posts.map((p) => ({ url: url(`/blog/${p.slug}/`), lastModified: p.date, priority: 0.6 })),
    ...blogCategories.map((c) => ({
      url: url(`/blog/category/${categorySlug(c)}/`),
      lastModified: today,
      priority: 0.4,
    })),
  ];
}
