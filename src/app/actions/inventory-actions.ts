"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInventoryItem(formData: FormData) {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const stock = parseFloat(formData.get("stock") as string) || 0;
    const unit = formData.get("unit") as string;
    const minStock = parseFloat(formData.get("minStock") as string) || 10;
    const sku = formData.get("sku") as string;
    const batchNumber = formData.get("batchNumber") as string;
    const price = parseFloat(formData.get("price") as string) || 0;

    try {
        const item = await prisma.inventoryItem.create({
            data: {
                name,
                category,
                stock,
                unit,
                minStock,
                status: stock <= 0 ? "Out of Stock" : stock <= minStock ? "Low Stock" : "In Stock",
            },
        });

        // Log initial stock movement
        if (stock > 0) {
            await prisma.stockMovement.create({
                data: {
                    inventoryItemId: item.id,
                    type: "IN",
                    quantity: stock,
                },
            });
        }

        revalidatePath("/dashboard/inventory");
        return { success: true, item };
    } catch (error) {
        console.error("Failed to create inventory item:", error);
        return { success: false, error: "Failed to create inventory item" };
    }
}

export async function getStockMovements(businessId?: string) {
    try {
        const movements = await prisma.stockMovement.findMany({
            where: businessId ? { inventoryItem: { businessId } } : undefined,
            include: { inventoryItem: { select: { name: true, unit: true } } },
            orderBy: { date: 'desc' },
            take: 50
        });
        return { success: true, movements };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to fetch logs" };
    }
}

export async function getInventoryItems(businessId: string) {
    return prisma.inventoryItem.findMany({
        where: { businessId },
        orderBy: { name: "asc" }
    });
}
