import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ProductInput } from "@/validations/product";

export async function listProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { where: { isThumbnail: true }, take: 1 },
    },
  });
}

export async function getProductForEdit(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } }, documents: true, tags: true },
  });
}

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let suffix = 1;
  while (
    await prisma.product.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
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

function baseData(input: ProductInput) {
  return {
    name: input.name,
    sku: input.sku,
    categoryId: input.categoryId,
    shortDescription: input.shortDescription,
    longDescription: input.longDescription,
    benefits: input.benefits,
    ingredients: input.ingredients,
    dosage: input.dosage || null,
    usage: input.usage || null,
    precautions: input.precautions || null,
    sideEffects: input.sideEffects || null,
    ageGroup: input.ageGroup || null,
    weightValue: input.weightValue,
    weightUnit: input.weightUnit,
    mrpInr: input.mrpInr,
    sellingPriceInr: input.sellingPriceInr,
    mrpUsd: input.mrpUsd ?? null,
    sellingPriceUsd: input.sellingPriceUsd ?? null,
    gstPercent: input.gstPercent,
    stock: input.stock,
    videoUrl: input.videoUrl || null,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
    seoKeywords: input.seoKeywords,
    isFeatured: input.isFeatured,
    isTrending: input.isTrending,
    isNewArrival: input.isNewArrival,
    status: input.status,
  };
}

export async function createProduct(input: ProductInput) {
  const slug = await uniqueSlug(input.name);
  const tagConnect = await tagConnections(input.tags);

  return prisma.product.create({
    data: {
      ...baseData(input),
      slug,
      tags: { connect: tagConnect },
      images: {
        create: input.images.map((img, i) => ({
          url: img.url,
          alt: img.alt || input.name,
          isThumbnail: img.isThumbnail || i === 0,
          sortOrder: i,
        })),
      },
      documents: { create: input.documents },
      relatedTo: input.relatedProductIds.length
        ? { connect: input.relatedProductIds.map((id) => ({ id })) }
        : undefined,
    },
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  const existing = await prisma.product.findUniqueOrThrow({ where: { id } });
  const slug =
    slugify(input.name) === existing.slug ? existing.slug : await uniqueSlug(input.name, id);
  const tagConnect = await tagConnections(input.tags);

  return prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.productDocument.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        ...baseData(input),
        slug,
        tags: { set: tagConnect },
        images: {
          create: input.images.map((img, i) => ({
            url: img.url,
            alt: img.alt || input.name,
            isThumbnail: img.isThumbnail || i === 0,
            sortOrder: i,
          })),
        },
        documents: { create: input.documents },
        relatedTo: { set: input.relatedProductIds.map((rid) => ({ id: rid })) },
      },
    });
  });
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
}
