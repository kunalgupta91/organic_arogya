import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm",
            p === page
              ? "bg-primary-600 text-white"
              : "border-border text-foreground border hover:bg-white",
          )}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
