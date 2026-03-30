"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWarehouses(businessId: string) {
    return prisma.warehouse.findMany({
        where: { businessId },
        include: {
            inventory: {
                select: { id: true, name: true, stock: true, unit: true }
            }
        }
    });
}

export async function createWarehouse(data: { name: string; location: string; businessId: string }) {
    try {
        await prisma.warehouse.create({ data });
        revalidatePath("/dashboard/inventory/warehouses");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create warehouse" };
    }
}
