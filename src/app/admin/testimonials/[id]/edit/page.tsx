import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTestimonialAction } from "../../actions";
import { TestimonialForm } from "../../testimonial-form";

export const metadata: Metadata = {
  title: "Edit Testimonial",
};

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  const boundAction = updateTestimonialAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Edit testimonial</h1>
      <TestimonialForm action={boundAction} defaults={testimonial} />
    </div>
  );
}
