import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { getPublishedBlogBySlug } from "@/services/public-blog-service";
import { SITE_CONFIG } from "@/constants/site";
import { CommentForm } from "./comment-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedBlogBySlug(slug);
  if (!result) return {};
  const { blog } = result;

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.excerpt || undefined,
    keywords: blog.seoKeywords,
    alternates: { canonical: `${SITE_CONFIG.url}/blog/${blog.slug}` },
    openGraph: {
      type: "article",
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt || undefined,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [result, session] = await Promise.all([getPublishedBlogBySlug(slug), auth()]);
  if (!result) notFound();
  const { blog, relatedPosts } = result;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt ?? undefined,
    image: blog.coverImage ? [blog.coverImage] : undefined,
    datePublished: blog.publishedAt?.toISOString(),
    author: { "@type": "Person", name: blog.author.name ?? SITE_CONFIG.name },
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-muted-foreground mb-6 text-xs">
        <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> /{" "}
        <span className="text-foreground">{blog.title}</span>
      </nav>

      {blog.category && (
        <Link href={`/blog?category=${blog.category.slug}`} className="text-primary-600 text-xs font-medium">
          {blog.category.name}
        </Link>
      )}
      <h1 className="font-display text-primary-900 mt-2 text-3xl sm:text-4xl">{blog.title}</h1>
      <p className="text-muted-foreground mt-3 text-sm">
        {blog.author.name} &middot;{" "}
        {blog.publishedAt?.toLocaleDateString("en-IN", { dateStyle: "long" })} &middot;{" "}
        {blog.viewCount} views
      </p>

      {blog.coverImage && (
        <div className="bg-muted relative mt-8 aspect-video overflow-hidden rounded-xl">
          <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" priority />
        </div>
      )}

      {/* blog.content is sanitized with DOMPurify at write time
          (src/services/blog-service.ts) before it's ever stored, so this
          render is safe even though the source is admin-authored HTML. */}
      <div
        className="blog-content mt-8"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {blog.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span key={tag.id} className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-primary-900 mb-4 text-xl">Related Posts</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="border-border rounded-lg border bg-white p-3 text-sm hover:shadow-sm"
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16">
        <h2 className="font-display text-primary-900 mb-4 text-xl">
          Comments ({blog.comments.length})
        </h2>
        <div className="mb-8 space-y-4">
          {blog.comments.map((comment) => (
            <div key={comment.id} className="border-border border-b pb-4">
              <p className="text-sm font-medium">{comment.name}</p>
              <p className="text-muted-foreground mt-1 text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
        <CommentForm blogId={blog.id} isLoggedIn={!!session?.user} />
      </div>
    </article>
  );
}
