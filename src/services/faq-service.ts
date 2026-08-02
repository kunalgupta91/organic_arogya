import { prisma } from "@/lib/prisma";
import type { FaqInput } from "@/validations/faq";

export async function listFaqs() {
  return prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    include: { product: { select: { name: true } } },
  });
}

function toData(input: FaqInput) {
  return {
    question: input.question,
    answer: input.answer,
    category: input.category,
    productId: input.productId || null,
    sortOrder: input.sortOrder,
    isPublished: input.isPublished,
  };
}

export async function createFaq(input: FaqInput) {
  return prisma.faq.create({ data: toData(input) });
}

export async function updateFaq(id: string, input: FaqInput) {
  return prisma.faq.update({ where: { id }, data: toData(input) });
}

export async function deleteFaq(id: string) {
  await prisma.faq.delete({ where: { id } });
}
