import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts, sortedPosts } from "@data/blog";
import { site } from "@data/site";
import { BlogSidebar, PostCard, PostMeta } from "@/components/blog/blog-parts";
import { Photo } from "@/components/ui/photo";
import { Container } from "@/components/ui/primitives";
import { getImage } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

const coverUrl = (src: string) =>
  src.startsWith("http") ? `${src}?w=1200&q=80&auto=format&fit=crop` : `${site.url}${src}`;

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: coverUrl(getImage(post.cover).src), width: 1200, height: 800 }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  // The article body: content/blog/<slug>.mdx
  const { default: Body } = await import(`@content/blog/${slug}.mdx`);
  const related = sortedPosts()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: site.name },
    image: coverUrl(getImage(post.cover).src),
    mainEntityOfPage: `${site.url}/blog/${post.slug}/`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <article>
        <Container className="pt-12 pb-10 md:pt-16">
          <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] tracking-wider text-muted uppercase">
            <Link href="/blog/" className="hover:text-ink">
              ← Journal
            </Link>
          </nav>
          <div className="max-w-3xl">
            <PostMeta post={post} />
            <h1 className="display-lg mt-5">{post.title}</h1>
            <p className="mt-5 text-xl leading-relaxed text-muted">{post.excerpt}</p>
            <p className="mt-6 text-sm">
              By <span className="font-semibold">{post.author}</span>
            </p>
          </div>
        </Container>
        <div className="mx-auto max-w-site px-0 sm:px-6 lg:px-10">
          <div className="relative aspect-[16/9] overflow-hidden bg-sand sm:aspect-[21/9]">
            <Photo name={post.cover} fill priority sizes="100vw" className="object-cover" />
          </div>
        </div>
        <Container className="grid gap-16 py-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
          <div className="mx-auto w-full max-w-[42rem] min-w-0 lg:mx-0">
            <Body />
            <div className="mt-14 flex flex-wrap gap-2 border-t border-line pt-8">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <BlogSidebar active={post.category} />
        </Container>
      </article>
      <section aria-labelledby="related-title" className="border-t border-line">
        <Container className="py-20">
          <h2 id="related-title" className="display-md mb-12">
            Keep reading
          </h2>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
