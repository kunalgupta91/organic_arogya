import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

const PUBLISHED = { status: "PUBLISHED" as const };

export function productCard() {
  return {
    id: true,
    name: true,
    slug: true,
    shortDescription: true,
    mrpInr: true,
    sellingPriceInr: true,
    avgRating: true,
    reviewCount: true,
    isFeatured: true,
    isTrending: true,
    isNewArrival: true,
    stock: true,
    category: { select: { name: true, slug: true } },
    images: { where: { isThumbnail: true }, take: 1, select: { url: true, alt: true } },
  } satisfies Prisma.ProductSelect;
}

export async function getFeaturedProducts(take = 8) {
  return prisma.product.findMany({
    where: { ...PUBLISHED, isFeatured: true },
    select: productCard(),
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getBestSellers(take = 8) {
  return prisma.product.findMany({
    where: { ...PUBLISHED, isTrending: true },
    select: productCard(),
    take,
    orderBy: { reviewCount: "desc" },
  });
}

export async function getNewArrivals(take = 8) {
  return prisma.product.findMany({
    where: { ...PUBLISHED, isNewArrival: true },
    select: productCard(),
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      _count: { select: { products: { where: PUBLISHED } } },
    },
  });
}

export type ProductFilters = {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "name";
};

function sortToOrderBy(sort: ProductFilters["sort"]): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { sellingPriceInr: "asc" };
    case "price-desc":
      return { sellingPriceInr: "desc" };
    case "rating":
      return { avgRating: "desc" };
    case "name":
      return { name: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export async function listStorefrontProducts(filters: ProductFilters, page = 1, pageSize = 12) {
  const where: Prisma.ProductWhereInput = {
    ...PUBLISHED,
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(filters.search
      ? { name: { contains: filters.search, mode: "insensitive" as const } }
      : {}),
    ...(filters.minPrice != null || filters.maxPrice != null
      ? {
          sellingPriceInr: {
            ...(filters.minPrice != null ? { gte: Math.round(filters.minPrice * 100) } : {}),
            ...(filters.maxPrice != null ? { lte: Math.round(filters.maxPrice * 100) } : {}),
          },
        }
      : {}),
    ...(filters.inStockOnly ? { stock: { gt: 0 } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productCard(),
      orderBy: sortToOrderBy(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, ...PUBLISHED },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      documents: true,
      tags: true,
      reviews: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
      relatedTo: { where: PUBLISHED, select: productCard() },
      faqs: { where: { isPublished: true }, orderBy: { sortOrder: "asc" } },
    },
  });
}
