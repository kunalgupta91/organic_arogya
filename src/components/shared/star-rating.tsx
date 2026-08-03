import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden="true"
          className={cn(i < rating ? "fill-accent-500 text-accent-500" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  );
}
