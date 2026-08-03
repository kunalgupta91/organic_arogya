"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { productSchema } from "@/validations/product";
import { createProduct, deleteProduct, updateProduct } from "@/services/product-service";
import { logAuditEvent } from "@/lib/audit-log";

async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Unauthorized");
  }
  return session;
}

export type ProductFormState = { error: string | null };

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await requireStaff();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const product = await createProduct(parsed.data);
  await logAuditEvent({
    userId: session.user.id,
    action: "PRODUCT_CREATED",
    entityType: "Product",
    entityId: product.id,
    metadata: { name: product.name, sku: product.sku },
  });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await requireStaff();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await updateProduct(id, parsed.data);
  await logAuditEvent({
    userId: session.user.id,
    action: "PRODUCT_UPDATED",
    entityType: "Product",
    entityId: id,
  });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string) {
  const session = await requireStaff();
  await deleteProduct(id);
  await logAuditEvent({
    userId: session.user.id,
    action: "PRODUCT_DELETED",
    entityType: "Product",
    entityId: id,
  });
  revalidatePath("/admin/products");
}
