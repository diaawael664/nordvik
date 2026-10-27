import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/blog-index";

export const metadata: Metadata = {
  title: "Journal",
  description: "Care guides, buying advice and stories from the Nordhaus workshop.",
  alternates: { canonical: "/blog/" },
};

export default function BlogPage() {
  return <BlogIndex />;
}
