"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getQuotations() {
    try {
        const quotations = await prisma.quotation.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, quotations };
    } catch (error) {
        console.error("Failed to fetch quotations:", error);
        return { success: false, error: "Failed to fetch quotations" };
    }
}

export async function createQuotation(data: any) {
    try {
        // Find or create lead
        let lead = await prisma.lead.findFirst({ where: { clientName: data.clientName } });
        if (!lead) {
            lead = await prisma.lead.create({
                data: {
                    leadId: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
                    clientName: data.clientName,
                    contact: data.contactNumber,
                    status: "Quoted"
                }
            });
        }

        const qtn = await prisma.quotation.create({
            data: {
                quotationId: `QTN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                leadId: lead.id,
                client: data.clientName,
                amount: data.totalAmount || 0,
                status: "Draft",
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days valid
            }
        });

        revalidatePath("/dashboard/quotations");
        return { success: true, quotation: qtn };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create quotation" };
    }
}

export async function updateQuotationStatus(id: string, status: string) {
    try {
        await prisma.quotation.update({
            where: { id },
            data: { status }
        });
        revalidatePath("/dashboard/quotations");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to update status" };
    }
}
