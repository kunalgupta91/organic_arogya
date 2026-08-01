import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBlogForEdit } from "@/services/blog-service";
import { updateBlogAction } from "../../actions";
import { BlogForm } from "../../blog-form";

export const metadata: Metadata = {
  title: "Edit Post",
};

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getBlogForEdit(id),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!post) notFound();

  const boundAction = updateBlogAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Edit post</h1>
      <BlogForm action={boundAction} defaults={post} categories={categories} />
    </div>
  );
}
