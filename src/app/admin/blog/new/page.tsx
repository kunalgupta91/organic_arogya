import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { createBlogAction } from "../actions";
import { BlogForm } from "../blog-form";

export const metadata: Metadata = {
  title: "Write Post",
};

export default async function NewBlogPage() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Write post</h1>
      <BlogForm action={createBlogAction} categories={categories} />
    </div>
  );
}
