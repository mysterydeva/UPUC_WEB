"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardAlerts(businessId?: string) {
    try {
        const inventory = await prisma.inventoryItem.findMany({
            where: businessId ? { businessId } : undefined,
            select: { name: true, stock: true, minStock: true, unit: true }
        });
        const lowStock = inventory.filter((i: any) => i.stock <= i.minStock);

        const invoices = await prisma.invoice.findMany({
            where: {
                dueDate: { lt: new Date() },
                status: { not: "Paid" },
                ...(businessId ? { businessId } : {})
            },
            select: { invoiceId: true, client: true, dueDate: true }
        });

        return { success: true, lowStock, overdueInvoices: invoices };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to fetch alerts" };
    }
}
