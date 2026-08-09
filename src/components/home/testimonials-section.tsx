import Image from "next/image";
import { Quote } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StarRating } from "@/components/shared/star-rating";
import { ScrollCarousel } from "@/components/shared/scroll-carousel";

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
        <ScrollCarousel title="What Our Customers Say">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="border-border relative w-80 shrink-0 rounded-2xl border bg-white p-6 sm:w-96"
            >
              <Quote className="text-primary-100 absolute top-5 right-5 h-10 w-10" fill="currentColor" />
              {t.rating && (
                <div className="mb-3">
                  <StarRating rating={t.rating} size={14} />
                </div>
              )}
              <p className="text-foreground relative text-sm leading-relaxed">{t.content}</p>
              <div className="mt-5 flex items-center gap-3">
                {t.imageUrl ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <Image src={t.imageUrl} alt={t.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="bg-primary-100 text-primary-700 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  {(t.designation || t.company) && (
                    <p className="text-muted-foreground text-xs">
                      {[t.designation, t.company].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollCarousel>
      </div>
    </section>
  );
}
