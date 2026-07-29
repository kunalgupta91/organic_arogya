import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { isPublished: true, productId: null },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-primary-900 text-3xl">Frequently Asked Questions</h1>
      {faqs.length === 0 ? (
        <p className="text-muted-foreground mt-8">No FAQs published yet — check back soon.</p>
      ) : (
        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.id} className="border-border group rounded-xl border bg-white p-5">
              <summary className="text-foreground cursor-pointer list-none font-medium">
                {faq.question}
              </summary>
              <p className="text-muted-foreground mt-3 text-sm">{faq.answer}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
