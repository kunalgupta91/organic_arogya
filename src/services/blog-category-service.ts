import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function listBlogCategories() {
  return prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { blogs: true } } },
  });
}

export async function createBlogCategory(name: string) {
  return prisma.blogCategory.create({ data: { name, slug: slugify(name) } });
}

export async function deleteBlogCategory(id: string) {
  const count = await prisma.blog.count({ where: { categoryId: id } });
  if (count > 0) throw new Error(`Cannot delete: ${count} post(s) still use this category.`);
  await prisma.blogCategory.delete({ where: { id } });
}
