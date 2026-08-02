import { prisma } from "@/lib/prisma";
import type { ReviewInput } from "@/validations/review";

async function recalculateProductRating(productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId, isPublished: true },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.product.update({
    where: { id: productId },
    data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count },
  });
}

export class AlreadyReviewedError extends Error {
  constructor() {
    super("You've already reviewed this product.");
  }
}

export async function submitReview(input: ReviewInput, userId: string) {
  const existing = await prisma.review.findFirst({
    where: { productId: input.productId, userId },
  });
  if (existing) throw new AlreadyReviewedError();

  const review = await prisma.review.create({
    data: {
      productId: input.productId,
      userId,
      rating: input.rating,
      title: input.title || null,
      comment: input.comment,
      isPublished: true, // reviews auto-publish (decided in the original scoping interview)
    },
  });

  await recalculateProductRating(input.productId);
  return review;
}

export async function listAllReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } }, user: { select: { name: true, email: true } } },
  });
}

export async function deleteReview(id: string) {
  const review = await prisma.review.findUniqueOrThrow({ where: { id } });
  await prisma.review.delete({ where: { id } });
  await recalculateProductRating(review.productId);
}
