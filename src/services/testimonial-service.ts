import { prisma } from "@/lib/prisma";
import type { TestimonialInput } from "@/validations/testimonial";

export async function listTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
}

function toData(input: TestimonialInput) {
  return {
    name: input.name,
    designation: input.designation || null,
    company: input.company || null,
    content: input.content,
    rating: input.rating ?? null,
    imageUrl: input.imageUrl || null,
    videoUrl: input.videoUrl || null,
    isPublished: input.isPublished,
    sortOrder: input.sortOrder,
  };
}

export async function createTestimonial(input: TestimonialInput) {
  return prisma.testimonial.create({ data: toData(input) });
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  return prisma.testimonial.update({ where: { id }, data: toData(input) });
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
}
