import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-primary-900 text-center text-2xl sm:text-3xl">
          What Our Customers Say
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="border-border rounded-xl border bg-white p-6">
              {t.rating && (
                <div className="mb-2 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-accent-500 text-accent-500" />
                  ))}
                </div>
              )}
              <p className="text-foreground text-sm">{t.content}</p>
              <p className="mt-4 text-sm font-medium">{t.name}</p>
              {(t.designation || t.company) && (
                <p className="text-muted-foreground text-xs">
                  {[t.designation, t.company].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
