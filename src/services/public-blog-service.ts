import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { publishDuePosts } from "@/services/blog-service";

export async function listPublishedBlogs(categorySlug?: string, page = 1, pageSize = 9) {
  await publishDuePosts();

  const where = {
    status: "PUBLISHED" as const,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: { author: { select: { name: true } }, category: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blog.count({ where }),
  ]);

  return { items, total, page, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

/**
 * Wrapped in React's cache() so the two callers within a single request
 * (generateMetadata + the page body) share one lookup instead of double
 * -querying and double-incrementing the view count.
 */
export const getPublishedBlogBySlug = cache(async (slug: string) => {
  await publishDuePosts();

  const blog = await prisma.blog.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      category: true,
      tags: true,
      comments: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!blog) return null;

  await prisma.blog.update({ where: { id: blog.id }, data: { viewCount: { increment: 1 } } });

  const relatedPosts = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: blog.id },
      ...(blog.categoryId ? { categoryId: blog.categoryId } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return { blog, relatedPosts };
});

export async function getBlogCategories() {
  return prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { blogs: { where: { status: "PUBLISHED" } } } } },
  });
}
