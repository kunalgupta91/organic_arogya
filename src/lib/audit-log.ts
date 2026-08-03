import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/client-ip";
import type { Prisma } from "@/generated/prisma/client";

export async function logAuditEvent(params: {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  const ipAddress = await getClientIp().catch(() => undefined);
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata as Prisma.InputJsonValue | undefined,
      ipAddress,
    },
  });
}
