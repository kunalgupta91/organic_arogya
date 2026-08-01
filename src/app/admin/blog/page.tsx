import type { Metadata } from "next";
import Link from "next/link";
import { listBlogs } from "@/services/blog-service";
import { Button } from "@/components/ui/button";
import { DeleteBlogButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Blog",
};

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SCHEDULED: "bg-accent-50 text-accent-700",
  PUBLISHED: "bg-primary-50 text-primary-700",
};

export default async function AdminBlogPage() {
  const posts = await listBlogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-primary-900 text-2xl">Blog</h1>
        <div className="flex gap-2">
          <Link href="/admin/blog-categories">
            <Button size="sm" variant="outline">
              Categories
            </Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button size="sm">Write post</Button>
          </Link>
        </div>
      </div>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${post.id}/edit`} className="font-medium hover:underline">
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{post.author.name ?? "—"}</td>
                <td className="px-4 py-3">{post.category?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[post.status]}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteBlogButton id={post.id} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
