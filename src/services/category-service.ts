import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { CategoryInput } from "@/validations/category";

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let suffix = 1;
  while (
    await prisma.category.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    slug = `${base}-${++suffix}`;
  }
  return slug;
}

export async function createCategory(input: CategoryInput) {
  const slug = await uniqueSlug(input.name);
  return prisma.category.create({
    data: { ...input, slug, parentId: input.parentId || null },
  });
}

export async function updateCategory(id: string, input: CategoryInput) {
  const existing = await prisma.category.findUniqueOrThrow({ where: { id } });
  const slug =
    slugify(input.name) === existing.slug ? existing.slug : await uniqueSlug(input.name, id);
  return prisma.category.update({
    where: { id },
    data: { ...input, slug, parentId: input.parentId || null },
  });
}

export async function deleteCategory(id: string) {
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new Error(`Cannot delete: ${productCount} product(s) still use this category.`);
  }
  await prisma.category.delete({ where: { id } });
}
