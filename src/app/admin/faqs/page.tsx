import type { Metadata } from "next";
import Link from "next/link";
import { listFaqs } from "@/services/faq-service";
import { Button } from "@/components/ui/button";
import { DeleteFaqButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage FAQs",
};

export default async function AdminFaqsPage() {
  const faqs = await listFaqs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-primary-900 text-2xl">FAQs</h1>
        <Link href="/admin/faqs/new">
          <Button size="sm">Add FAQ</Button>
        </Link>
      </div>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Question</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td className="max-w-sm truncate px-4 py-3">
                  <Link href={`/admin/faqs/${faq.id}/edit`} className="font-medium hover:underline">
                    {faq.question}
                  </Link>
                </td>
                <td className="px-4 py-3">{faq.category}</td>
                <td className="px-4 py-3">{faq.product?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  {faq.isPublished ? (
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
                  <DeleteFaqButton id={faq.id} />
                </td>
              </tr>
            ))}
            {faqs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                  No FAQs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
