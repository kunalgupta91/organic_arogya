import type { Metadata } from "next";
import { Star } from "lucide-react";
import { listAllReviews } from "@/services/review-service";
import { DeleteReviewButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Reviews",
};

export default async function AdminReviewsPage() {
  const reviews = await listAllReviews();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Reviews</h1>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Comment</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-4 py-3">{review.product.name}</td>
                <td className="px-4 py-3">{review.user.name ?? review.user.email}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-accent-500 text-accent-500" />
                    ))}
                  </div>
                </td>
                <td className="max-w-sm truncate px-4 py-3">{review.comment}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteReviewButton id={review.id} />
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                  No reviews yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
