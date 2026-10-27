import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogCategories } from "@data/blog";
import { BlogIndex } from "@/components/blog/blog-index";
import { categorySlug } from "@/components/blog/blog-parts";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogCategories.map((c) => ({ category: categorySlug(c) }));
}

const find = (slug: string) => blogCategories.find((c) => categorySlug(c) === slug);

export async function generateMetadata({ params }: PageProps<"/blog/category/[category]">): Promise<Metadata> {
  const name = find((await params).category);
  return name ? { title: `${name} — Journal`, alternates: { canonical: `/blog/category/${categorySlug(name)}/` } } : {};
}

export default async function BlogCategoryPage({ params }: PageProps<"/blog/category/[category]">) {
  const name = find((await params).category);
  if (!name) notFound();
  return <BlogIndex category={name} />;
}
