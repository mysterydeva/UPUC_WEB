"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function bulkImportInventory(businessId: string, items: any[]) {
    try {
        const createData = items.map(item => ({
            businessId,
            name: item.name || "Unknown Item",
            category: item.category || "General",
            stock: parseInt(item.stock) || 0,
            unit: item.unit || "pcs",
            price: parseFloat(item.price) || 0,
            taxRate: parseFloat(item.taxRate) || 18,
            barcode: item.barcode || null,
            status: parseInt(item.stock) > 0 ? "In Stock" : "Out of Stock"
        }));

        await prisma.inventoryItem.createMany({
            data: createData
        });

        revalidatePath("/dashboard/inventory");
        revalidatePath("/dashboard/pos");
        return { success: true, count: createData.length };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Bulk import failed" };
    }
}
