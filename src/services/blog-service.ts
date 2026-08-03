import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { sanitizeRichText } from "@/lib/sanitize-html";
import type { BlogInput } from "@/validations/blog";

export async function listBlogs() {
  return prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } }, category: { select: { name: true } } },
  });
}

export async function getBlogForEdit(id: string) {
  return prisma.blog.findUnique({ where: { id }, include: { tags: true } });
}

async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let suffix = 1;
  while (
    await prisma.blog.findFirst({ where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) } })
  ) {
    slug = `${base}-${++suffix}`;
  }
  return slug;
}

async function tagConnections(tagNames: string[]) {
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { slug: slugify(name) },
        update: {},
        create: { name, slug: slugify(name) },
      }),
    ),
  );
  return tags.map((tag) => ({ id: tag.id }));
}

function resolvePublishedAt(input: BlogInput) {
  if (input.status === "PUBLISHED") return new Date();
  return null;
}

function resolveScheduledAt(input: BlogInput) {
  if (input.status === "SCHEDULED" && input.scheduledAt) return new Date(input.scheduledAt);
  return null;
}

export async function createBlog(input: BlogInput, authorId: string) {
  const slug = await uniqueSlug(input.title);
  const tagConnect = await tagConnections(input.tags);

  return prisma.blog.create({
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      content: sanitizeRichText(input.content),
      coverImage: input.coverImage || null,
      categoryId: input.categoryId || null,
      status: input.status,
      publishedAt: resolvePublishedAt(input),
      scheduledAt: resolveScheduledAt(input),
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      seoKeywords: input.seoKeywords,
      authorId,
      tags: { connect: tagConnect },
    },
  });
}

export async function updateBlog(id: string, input: BlogInput) {
  const existing = await prisma.blog.findUniqueOrThrow({ where: { id } });
  const slug = slugify(input.title) === existing.slug ? existing.slug : await uniqueSlug(input.title, id);
  const tagConnect = await tagConnections(input.tags);

  return prisma.blog.update({
    where: { id },
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      content: sanitizeRichText(input.content),
      coverImage: input.coverImage || null,
      categoryId: input.categoryId || null,
      status: input.status,
      publishedAt: existing.publishedAt ?? resolvePublishedAt(input),
      scheduledAt: resolveScheduledAt(input),
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      seoKeywords: input.seoKeywords,
      tags: { set: tagConnect },
    },
  });
}

export async function deleteBlog(id: string) {
  await prisma.blog.delete({ where: { id } });
}

/** Promotes SCHEDULED posts whose time has come to PUBLISHED. Call this
 * from the public blog list/detail pages so scheduling works without a
 * dedicated cron job. */
export async function publishDuePosts() {
  await prisma.blog.updateMany({
    where: { status: "SCHEDULED", scheduledAt: { lte: new Date() } },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}
