"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { submitReviewAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({ productId, isLoggedIn }: { productId: string; isLoggedIn: boolean }) {
  const [state, formAction, isPending] = useActionState(submitReviewAction, {
    error: null,
    success: false,
  });
  const [rating, setRating] = useState(5);

  if (!isLoggedIn) {
    return (
      <p className="text-muted-foreground border-border rounded-lg border border-dashed p-4 text-sm">
        <Link href="/login" className="text-primary-600 font-medium">
          Sign in
        </Link>{" "}
        to leave a review.
      </p>
    );
  }

  if (state.success) {
    return (
      <p className="text-primary-700 bg-primary-50 rounded-lg p-4 text-sm">
        Thanks for your review!
      </p>
    );
  }

  return (
    <form action={formAction} className="border-border space-y-4 rounded-lg border p-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />
      <div>
        <Label>Your rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
            >
              <Star
                size={20}
                className={value <= rating ? "fill-accent-500 text-accent-500" : "text-muted-foreground"}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="title">Title (optional)</Label>
        <Input id="title" name="title" />
      </div>
      <div>
        <Label htmlFor="comment">Review</Label>
        <Textarea id="comment" name="comment" rows={3} required />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
