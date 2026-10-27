import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@data/site";
import { categories, getCategory } from "@/lib/catalog";
import { ShopView } from "../shop-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.description} Shop ${category.name.toLowerCase()} from ${site.name}.`,
    alternates: { canonical: `/shop/${category.slug}/` },
  };
}

/** One static page per category, e.g. /shop/sofas/. */
export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category } = await params;
  if (!getCategory(category)) notFound();
  return <ShopView category={category} />;
}
