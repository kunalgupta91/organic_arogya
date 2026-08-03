"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/validations/blog";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RateLimitError } from "@/lib/rate-limit";

export type CommentFormState = { error: string | null; success: boolean };

export async function submitCommentAction(
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  try {
    rateLimit(`comment:${await getClientIp()}`, 10, 15 * 60 * 1000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { error: "Too many comments. Please try again later.", success: false };
    }
    throw error;
  }

  const session = await auth();
  const parsed = commentSchema.safeParse({
    blogId: formData.get("blogId"),
    name: session?.user?.name ?? formData.get("name"),
    email: session?.user?.email ?? formData.get("email"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input.", success: false };
  }

  const blog = await prisma.blog.findUnique({ where: { id: parsed.data.blogId } });
  if (!blog) return { error: "Post not found.", success: false };

  await prisma.comment.create({
    data: {
      blogId: parsed.data.blogId,
      userId: session?.user?.id,
      name: parsed.data.name,
      email: parsed.data.email,
      content: parsed.data.content,
      isApproved: false,
    },
  });

  revalidatePath(`/blog/${blog.slug}`);
  return { error: null, success: true };
}
