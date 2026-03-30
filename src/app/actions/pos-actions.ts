"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPOSProducts(businessId: string) {
    return prisma.inventoryItem.findMany({
        where: { businessId, stock: { gt: 0 } },
        select: {
            id: true,
            name: true,
            category: true,
            stock: true,
            price: true,
            taxRate: true,
            barcode: true,
        }
    });
}

export async function processPOSCheckout(businessId: string, cart: any[], paymentMethod: string) {
    try {
        // 1. Calculate totals
        const subTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        const taxAmount = cart.reduce((acc, item) => acc + ((item.product.price * item.quantity) * (item.product.taxRate / 100)), 0);
        const totalAmount = subTotal + taxAmount;

        // 2. Create Invoice
        const counter = await prisma.invoice.count({ where: { businessId } });
        const invoiceId = `POS-${new Date().getFullYear()}-${String(counter + 1).padStart(4, '0')}`;

        const invoice = await prisma.invoice.create({
            data: {
                invoiceId,
                businessId,
                client: "Walk-in Customer",
                subTotal,
                taxAmount,
                taxRate: 18,
                totalAmount,
                status: "Paid",
                method: paymentMethod,
                dueDate: new Date()
            }
        });

        // 3. Deduct Stock and log movements
        for (const item of cart) {
            await prisma.inventoryItem.update({
                where: { id: item.product.id },
                data: { stock: { decrement: item.quantity } }
            });

            await prisma.stockMovement.create({
                data: {
                    inventoryItemId: item.product.id,
                    quantity: item.quantity,
                    type: "OUT",
                    reference: `POS Checkout: ${invoiceId}`,
                }
            });
        }

        revalidatePath("/dashboard/pos");
        revalidatePath("/dashboard/inventory");
        revalidatePath("/dashboard/finance");

        return { success: true, invoiceId };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to complete POS checkout" };
    }
}
