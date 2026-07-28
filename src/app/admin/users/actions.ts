"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/(auth)/actions";

export async function updateUserRoleAction(userId: string, role: "CUSTOMER" | "STAFF" | "ADMIN") {
  const session = await requireAdmin();
  if (session.user.role !== "ADMIN") {
    throw new Error("Only admins can change roles.");
  }
  if (session.user.id === userId) {
    throw new Error("You cannot change your own role.");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}
