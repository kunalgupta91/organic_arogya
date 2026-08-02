import type { Metadata } from "next";
import { createTestimonialAction } from "../actions";
import { TestimonialForm } from "../testimonial-form";

export const metadata: Metadata = {
  title: "Add Testimonial",
};

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Add testimonial</h1>
      <TestimonialForm action={createTestimonialAction} />
    </div>
  );
}
