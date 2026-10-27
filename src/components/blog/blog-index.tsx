import Link from "next/link";
import { blogCategories, sortedPosts } from "@data/blog";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { BlogSidebar, PostCard, categorySlug } from "./blog-parts";

/** Journal listing, used by /blog/ and /blog/category/<name>/. */
export function BlogIndex({ category }: { category?: string }) {
  const all = sortedPosts();
  const list = category ? all.filter((p) => p.category === category) : all;
  const [featured, ...rest] = category ? [undefined, ...list] : list;

  return (
    <>
      <Container className="pt-12 pb-10 md:pt-16">
        <p className="eyebrow mb-4">{category ? "Journal" : "Notes from the workshop"}</p>
        <h1 className="display-lg">{category ?? "The Journal"}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Care guides, buying advice and stories from the people who make our furniture.
        </p>
        <nav aria-label="Filter by category" className="mt-8 flex flex-wrap gap-2">
          {[undefined, ...blogCategories].map((c) => {
            const active = c === category;
            return (
              <Link
                key={c ?? "all"}
                href={c ? `/blog/category/${categorySlug(c)}/` : "/blog/"}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "h-9 rounded-full border px-4 text-sm leading-[2.15rem] transition-colors",
                  active ? "border-ink bg-ink text-bg" : "border-line hover:border-ink",
                )}
              >
                {c ?? "All"}
              </Link>
            );
          })}
        </nav>
      </Container>

      {featured && (
        <Container className="border-t border-line py-12">
          <PostCard post={featured} size="lg" />
        </Container>
      )}

      <Container className="grid gap-16 border-t border-line py-14 lg:grid-cols-[1fr_18rem] lg:gap-20">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {rest.map((p) => p && <PostCard key={p.slug} post={p} />)}
        </div>
        <BlogSidebar active={category} />
      </Container>
    </>
  );
}
