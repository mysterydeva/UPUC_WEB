"use server";

import { prisma } from "@/lib/prisma";
import { calculateGst, GstType } from "@/lib/gst-utils";
import { revalidatePath } from "next/cache";
import { logActivity } from "./audit-actions";

export async function createInvoice(formData: FormData) {
    const businessId = formData.get("businessId") as string;
    const client = formData.get("client") as string;
    const subTotal = parseFloat(formData.get("subTotal") as string);
    const taxRate = parseFloat(formData.get("taxRate") as string) || 18;
    const discount = parseFloat(formData.get("discount") as string) || 0;
    const gstType = formData.get("gstType") as GstType || "CGST_SGST";
    const dueDateStr = formData.get("dueDate") as string;

    // Calculate GST and Total
    const { taxAmount, totalAmount } = calculateGst(subTotal - discount, taxRate, gstType);

    // Generate a simple Invoice ID if not provided
    const invoiceId = `INV-${Date.now().toString().slice(-6)}`;

    try {
        const invoice = await prisma.invoice.create({
            data: {
                invoiceId,
                businessId: businessId || null,
                client,
                subTotal,
                taxRate,
                taxAmount,
                discount,
                totalAmount,
                gstType,
                status: "Pending",
                dueDate: new Date(dueDateStr),
            },
        });

        // Award Loyalty Points (10% of totalAmount)
        if (client) {
            const party = await prisma.party.findFirst({ where: { name: client } });
            if (party) {
                await prisma.party.update({
                    where: { id: party.id },
                    data: { loyaltyPoints: { increment: Math.floor(totalAmount / 10) } }
                });
            }
        }

        // Log Activity
        await logActivity(
            businessId || "default",
            "system-user",
            "CREATE",
            "INVOICE",
            invoice.id,
            { amount: totalAmount, client: client }
        );

        revalidatePath("/dashboard/finance");
        return { success: true, invoice };
    } catch (error) {
        console.error("Failed to create invoice:", error);
        return { success: false, error: "Failed to create invoice" };
    }
}

export async function getInvoices(businessId?: string) {
    try {
        const invoices = await prisma.invoice.findMany({
            where: businessId ? { businessId } : undefined,
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        return { success: true, invoices };
    } catch (error) {
        console.error("Failed to fetch invoices:", error);
        return { success: false, error: "Failed to fetch invoices" };
    }
}
