import Link from "next/link";
import { blogCategories, posts, sortedPosts, type Post } from "@data/blog";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/utils";

export const categorySlug = (c: string) => c.toLowerCase();

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));

export function PostMeta({ post, className }: { post: Post; className?: string }) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-wider text-muted uppercase",
        className,
      )}
    >
      <Link href={`/blog/category/${categorySlug(post.category)}/`} className="text-accent hover:underline">
        {post.category}
      </Link>
      <span aria-hidden>·</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden>·</span>
      <span>{post.readMinutes} min read</span>
    </p>
  );
}

export function PostCard({ post, size = "md" }: { post: Post; size?: "md" | "lg" }) {
  const href = `/blog/${post.slug}/`;
  return (
    <article className={cn("group", size === "lg" && "grid gap-8 md:grid-cols-2 md:items-center md:gap-12")}>
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-[4/3] overflow-hidden bg-sand">
        <Photo
          name={post.cover}
          alt=""
          fill
          priority={size === "lg"}
          sizes={
            size === "lg"
              ? "(min-width: 768px) 45vw, 100vw"
              : "(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
          }
          className="object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-105"
        />
      </Link>
      <div className={size === "md" ? "pt-5" : undefined}>
        <PostMeta post={post} />
        <h2 className={cn("mt-3", size === "lg" ? "display-md" : "font-display text-2xl leading-snug")}>
          <Link href={href} className="hover:underline hover:decoration-1 hover:underline-offset-4">
            {post.title}
          </Link>
        </h2>
        <p className={cn("mt-3 leading-relaxed text-muted", size === "lg" && "text-lg")}>{post.excerpt}</p>
        {size === "lg" && (
          <Link href={href} className="mt-6 inline-block text-sm underline underline-offset-4">
            Read the article
          </Link>
        )}
      </div>
    </article>
  );
}

/** Journal sidebar: categories, recent posts and tags. */
export function BlogSidebar({ active }: { active?: string }) {
  const recent = sortedPosts().slice(0, 4);
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  return (
    <aside aria-label="Journal sidebar" className="space-y-12">
      <nav aria-label="Journal categories">
        <p className="eyebrow mb-4 text-ink">Categories</p>
        <ul className="divide-y divide-line border-y border-line text-sm">
          <li>
            <Link
              href="/blog/"
              aria-current={!active ? "page" : undefined}
              className={cn("flex justify-between py-3 hover:text-accent", !active && "font-semibold")}
            >
              All articles <span className="font-mono text-xs text-muted">{posts.length}</span>
            </Link>
          </li>
          {blogCategories.map((c) => (
            <li key={c}>
              <Link
                href={`/blog/category/${categorySlug(c)}/`}
                aria-current={active === c ? "page" : undefined}
                className={cn("flex justify-between py-3 hover:text-accent", active === c && "font-semibold")}
              >
                {c}
                <span className="font-mono text-xs text-muted">{posts.filter((p) => p.category === c).length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <p className="eyebrow mb-4 text-ink">Recent</p>
        <ul className="space-y-5">
          {recent.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}/`} className="group flex gap-4">
                <span className="relative size-16 shrink-0 overflow-hidden bg-sand">
                  <Photo name={p.cover} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span>
                  <span className="block text-sm leading-snug group-hover:underline">{p.title}</span>
                  <time dateTime={p.date} className="mt-1 block font-mono text-[11px] text-muted">
                    {formatDate(p.date)}
                  </time>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="eyebrow mb-4 text-ink">Topics</p>
        <ul className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-3 py-1 text-xs">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-sand p-6">
        <p className="font-display text-xl">Need help choosing?</p>
        <p className="mt-2 text-sm text-muted">
          Our team answers questions about sizes, fabrics and delivery within a day.
        </p>
        <Link href="/contact/" className="mt-4 inline-block text-sm underline underline-offset-4">
          Ask a question
        </Link>
      </div>
    </aside>
  );
}
