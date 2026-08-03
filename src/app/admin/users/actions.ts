"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/(auth)/actions";
import { logAuditEvent } from "@/lib/audit-log";

export async function updateUserRoleAction(userId: string, role: "CUSTOMER" | "STAFF" | "ADMIN") {
  const session = await requireAdmin();
  if (session.user.role !== "ADMIN") {
    throw new Error("Only admins can change roles.");
  }
  if (session.user.id === userId) {
    throw new Error("You cannot change your own role.");
  }

  const target = await prisma.user.update({ where: { id: userId }, data: { role } });
  await logAuditEvent({
    userId: session.user.id,
    action: "USER_ROLE_CHANGED",
    entityType: "User",
    entityId: userId,
    metadata: { newRole: role, targetEmail: target.email },
  });
  revalidatePath("/admin/users");
}
