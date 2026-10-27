import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/catalog";
import { bestSellers, getProduct, products, type Product } from "@/lib/catalog";
import { site } from "@data/site";
import { RecentlyViewed } from "@/components/product/product-extras";
import { ProductRail } from "@/components/sections/home-sections";
import { Container } from "@/components/ui/primitives";
import { getImage } from "@/lib/utils";
import { ProductDetail } from "./product-detail";

// Static export: only the slugs below exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/** Absolute, sized image URL for metadata and structured data. */
function absoluteImage(product: Product, width = 1200) {
  const { src } = getImage(product.images[0]);
  return src.startsWith("http") ? `${src}?w=${width}&q=80&auto=format&fit=crop` : `${site.url}${src}`;
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const url = `/product/${product.slug}/`;
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${product.name} — ${site.name}`,
      description: product.summary,
      images: [{ url: absoluteImage(product), width: 1200, height: 1500, alt: getImage(product.images[0]).alt }],
    },
  };
}

/** schema.org Product + BreadcrumbList so search engines can show price, stock and rating. */
function structuredData(product: Product) {
  const url = `${site.url}/product/${product.slug}/`;
  const category = getCategory(product.category);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      sku: product.sku,
      image: product.images.map((_, i) => absoluteImage({ ...product, images: [product.images[i]] })),
      brand: { "@type": "Brand", name: site.name },
      category: category?.name,
      material: product.materials.join(", "),
      ...(product.dimensions.width > 0 && {
        width: { "@type": "QuantitativeValue", value: product.dimensions.width, unitCode: "CMT" },
        depth: { "@type": "QuantitativeValue", value: product.dimensions.depth, unitCode: "CMT" },
        height: { "@type": "QuantitativeValue", value: product.dimensions.height, unitCode: "CMT" },
      }),
      ...(product.reviewCount > 0 && {
        aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
      }),
      offers: {
        "@type": "Offer",
        url,
        price: product.price.toFixed(2),
        priceCurrency: site.currency,
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
        { "@type": "ListItem", position: 2, name: "Shop", item: `${site.url}/shop/` },
        ...(category
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: category.name,
                item: `${site.url}/shop/${category.slug}/`,
              },
            ]
          : []),
        { "@type": "ListItem", position: category ? 4 : 3, name: product.name, item: url },
      ],
    },
  ];
}

/** Same category first, then best sellers, never the product itself. */
function related(product: Product) {
  const pool = [...products.filter((p) => p.category === product.category), ...bestSellers()];
  return [...new Map(pool.filter((p) => p.id !== product.id).map((p) => [p.id, p])).values()].slice(0, 8);
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category);

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so product text can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(product)).replace(/</g, "\\u003c") }}
      />
      <Container className="pt-6 pb-16 md:pt-10">
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] tracking-wider text-muted uppercase">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/shop/" className="hover:text-ink">
                Shop
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link href={`/shop/${category.slug}/`} className="hover:text-ink">
                    {category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>
        <ProductDetail product={product} />
      </Container>
      <ProductRail
        eyebrow="Pairs well with"
        title="You may also like"
        items={related(product)}
        href={category ? `/shop/${category.slug}/` : "/shop/"}
        linkLabel={category ? `All ${category.name.toLowerCase()}` : "Shop all"}
        className="border-t border-line"
      />
      <RecentlyViewed exclude={product.id} />
    </>
  );
}
