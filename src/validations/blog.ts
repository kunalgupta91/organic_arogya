import { z } from "zod";

const commaList = z
  .string()
  .optional()
  .transform((val) =>
    (val ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

export const blogSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "Content is required"),
  coverImage: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).default("DRAFT"),
  scheduledAt: z.string().trim().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  seoKeywords: commaList,
  tags: commaList,
});

export type BlogInput = z.infer<typeof blogSchema>;

export const blogCategorySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
});

export type BlogCategoryInput = z.infer<typeof blogCategorySchema>;

export const commentSchema = z.object({
  blogId: z.string().trim().min(1),
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().email(),
  content: z.string().trim().min(3, "Comment is required"),
});

export type CommentInput = z.infer<typeof commentSchema>;
