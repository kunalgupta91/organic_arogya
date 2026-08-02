import type { Metadata } from "next";
import Link from "next/link";
import { listTestimonials } from "@/services/testimonial-service";
import { Button } from "@/components/ui/button";
import { DeleteTestimonialButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Testimonials",
};

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-primary-900 text-2xl">Testimonials</h1>
        <Link href="/admin/testimonials/new">
          <Button size="sm">Add testimonial</Button>
        </Link>
      </div>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Content</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {testimonials.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/testimonials/${t.id}/edit`} className="font-medium hover:underline">
                    {t.name}
                  </Link>
                </td>
                <td className="max-w-sm truncate px-4 py-3">{t.content}</td>
                <td className="px-4 py-3">
                  {t.isPublished ? (
                    <span className="text-primary-700 bg-primary-50 rounded-full px-2 py-0.5 text-xs">
                      Published
                    </span>
                  ) : (
                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                      Hidden
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteTestimonialButton id={t.id} />
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted-foreground px-4 py-8 text-center">
                  No testimonials yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
