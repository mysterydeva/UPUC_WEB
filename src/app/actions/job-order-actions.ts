"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function convertToJobOrder(quotationId: string) {
    try {
        const qtn = await prisma.quotation.findUnique({ where: { id: quotationId } });
        if (!qtn) return { success: false, error: "Quotation not found" };

        // Update quotation status
        await prisma.quotation.update({
            where: { id: quotationId },
            data: { status: "Approved" }
        });

        // Create Job Order
        const jobOrder = await prisma.jobOrder.create({
            data: {
                jobOrderId: `JO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                quotationId: qtn.id,
                name: `Windows/Doors for ${qtn.client}`,
                client: qtn.client,
                status: "Pending",
                deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
            }
        });

        revalidatePath("/dashboard/quotations");
        revalidatePath("/dashboard/job-orders");
        return { success: true, jobOrder };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to convert to Job Order" };
    }
}

export async function getJobOrders() {
    try {
        const jobOrders = await prisma.jobOrder.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, jobOrders };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to fetch job orders" };
    }
}
