/**
 * Styles and custom components for every MDX blog post.
 * Custom components available in posts:
 *   <Callout title="…">text</Callout>
 *   <ProductCallout slug="product-slug" />
 *   <Figure image="image-key" caption="…" />
 */
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ImageKey } from "@data/images";
import { getProduct } from "@/lib/catalog";
import { Photo } from "@/components/ui/photo";
import { Price } from "@/components/ui/primitives";

function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="my-10 border-l-2 border-accent bg-surface px-6 py-5">
      {title && <p className="mb-1 font-sans text-sm font-semibold">{title}</p>}
      <div className="text-[15px] leading-relaxed text-muted [&>p]:m-0">{children}</div>
    </aside>
  );
}

function ProductCallout({ slug }: { slug: string }) {
  const product = getProduct(slug);
  if (!product) return null;
  return (
    <Link
      href={`/product/${product.slug}/`}
      className="group my-10 flex items-center gap-5 border border-line p-4 no-underline transition-colors hover:border-ink"
    >
      <span className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-sand sm:w-24">
        <Photo name={product.images[0]} alt="" fill sizes="96px" className="object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="eyebrow block">Featured in this article</span>
        <span className="mt-1 block font-display text-xl text-ink group-hover:underline">{product.name}</span>
        <span className="mt-1 block text-sm text-muted">{product.summary}</span>
      </span>
      <Price price={product.price} compareAt={product.compareAt} size="sm" className="hidden shrink-0 sm:flex" />
    </Link>
  );
}

function Figure({ image, caption }: { image: ImageKey; caption?: string }) {
  return (
    <figure className="my-12">
      <div className="relative aspect-[3/2] overflow-hidden bg-sand">
        <Photo name={image} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
      </div>
      {caption && <figcaption className="mt-3 font-mono text-[11px] tracking-wide text-muted">{caption}</figcaption>}
    </figure>
  );
}

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-14 mb-5 font-display text-3xl" {...props} />,
  h3: (props) => <h3 className="mt-10 mb-4 font-display text-2xl" {...props} />,
  p: (props) => <p className="my-5 text-[17px] leading-[1.8]" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} className="underline decoration-line underline-offset-4 hover:decoration-ink" {...props} />
    ) : (
      <a href={href} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />
    ),
  ul: (props) => (
    <ul className="my-6 list-disc space-y-2 pl-6 text-[17px] leading-relaxed marker:text-accent" {...props} />
  ),
  ol: (props) => (
    <ol className="my-6 list-decimal space-y-2 pl-6 text-[17px] leading-relaxed marker:text-muted" {...props} />
  ),
  strong: (props) => <strong className="font-semibold" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-12 border-y border-line py-8 font-display text-2xl leading-snug sm:text-3xl [&>p]:m-0 [&>p]:font-display [&>p]:leading-snug [&>p]:text-inherit"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full min-w-[28rem] text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border-b border-ink py-3 pr-4 font-mono text-[11px] tracking-wider uppercase" {...props} />
  ),
  td: (props) => <td className="border-b border-line py-3 pr-4 align-top" {...props} />,
  hr: () => <hr className="my-12 border-line" />,
  Callout,
  ProductCallout,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
