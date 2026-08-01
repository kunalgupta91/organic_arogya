import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listPublishedBlogs, getBlogCategories } from "@/services/public-blog-service";
import { Pagination } from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: "Health & Ayurveda Blog",
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const [{ items, totalPages }, categories] = await Promise.all([
    listPublishedBlogs(sp.category, page),
    getBlogCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-primary-900 text-3xl">Health &amp; Ayurveda Blog</h1>
      <p className="text-muted-foreground mt-2">
        Ayurvedic wellness tips, ingredient deep-dives, and health guidance from Organic Arogya.
      </p>

      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-3 py-1 text-xs font-medium ${!sp.category ? "bg-primary-600 text-white" : "bg-muted text-muted-foreground"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/blog?category=${c.slug}`}
              className={`rounded-full px-3 py-1 text-xs font-medium ${sp.category === c.slug ? "bg-primary-600 text-white" : "bg-muted text-muted-foreground"}`}
            >
              {c.name} ({c._count.blogs})
            </Link>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-muted-foreground mt-16 text-center">
          No posts published yet — check back soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="border-border block overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md"
            >
              <div className="bg-muted relative aspect-video">
                {post.coverImage && (
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                )}
              </div>
              <div className="space-y-1 p-4">
                {post.category && (
                  <p className="text-primary-600 text-xs font-medium">{post.category.name}</p>
                )}
                <p className="line-clamp-2 font-medium">{post.title}</p>
                {post.excerpt && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">{post.excerpt}</p>
                )}
                <p className="text-muted-foreground pt-2 text-xs">
                  {post.author.name} &middot;{" "}
                  {post.publishedAt?.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        buildHref={(p) => `/blog?${new URLSearchParams({ ...sp, page: String(p) } as Record<string, string>).toString()}`}
      />
    </div>
  );
}
