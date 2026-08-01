"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { blogSchema, blogCategorySchema } from "@/validations/blog";
import { createBlog, deleteBlog, updateBlog } from "@/services/blog-service";
import {
  createBlogCategory,
  deleteBlogCategory,
} from "@/services/blog-category-service";

async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Unauthorized");
  }
  return session;
}

export type BlogFormState = { error: string | null };

export async function createBlogAction(
  _prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const session = await requireStaff();
  const parsed = blogSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createBlog(parsed.data, session.user.id);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogAction(
  id: string,
  _prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  await requireStaff();
  const parsed = blogSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await updateBlog(id, parsed.data);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogAction(id: string) {
  await requireStaff();
  await deleteBlog(id);
  revalidatePath("/admin/blog");
}

export type BlogCategoryFormState = { error: string | null };

export async function createBlogCategoryAction(
  _prevState: BlogCategoryFormState,
  formData: FormData,
): Promise<BlogCategoryFormState> {
  await requireStaff();
  const parsed = blogCategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createBlogCategory(parsed.data.name);
  revalidatePath("/admin/blog-categories");
  return { error: null };
}

export async function deleteBlogCategoryAction(id: string) {
  await requireStaff();
  await deleteBlogCategory(id);
  revalidatePath("/admin/blog-categories");
}
