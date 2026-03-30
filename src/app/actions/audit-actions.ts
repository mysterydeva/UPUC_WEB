"use server";

import { prisma } from "@/lib/prisma";

export async function logActivity(
    businessId: string,
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    details?: any
) {
    try {
        await prisma.auditLog.create({
            data: {
                businessId,
                userId,
                action,
                entity,
                entityId,
                details: details ? JSON.stringify(details) : null,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to log activity:", error);
        return { success: false };
    }
}

export async function getAuditLogs(businessId: string) {
    return prisma.auditLog.findMany({
        where: { businessId },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { timestamp: "desc" },
        take: 100
    });
}
