import type { MetadataRoute } from "next";
import { site } from "@data/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Per-visitor pages have no search value.
        disallow: ["/cart/", "/checkout/", "/account/", "/wishlist/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
