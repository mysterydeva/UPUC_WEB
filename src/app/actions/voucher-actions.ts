"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVouchers(businessId: string) {
    return prisma.voucher.findMany({
        where: { businessId },
        include: { party: true },
        orderBy: { createdAt: "desc" }
    });
}

export async function createVoucher(data: {
    type: string;
    partyId?: string;
    amount: number;
    referenceType?: string;
    referenceId?: string;
    businessId: string;
}) {
    try {
        const counter = await prisma.voucher.count({ where: { type: data.type, businessId: data.businessId } });
        const prefix = data.type === 'Credit Note' ? 'CN' : data.type === 'Debit Note' ? 'DN' : data.type === 'Proforma Invoice' ? 'PRO' : 'DC';
        const voucherId = `${prefix}-${new Date().getFullYear()}-${String(counter + 1).padStart(3, '0')}`;

        const voucher = await prisma.voucher.create({
            data: {
                voucherId,
                type: data.type,
                amount: data.amount,
                partyId: data.partyId,
                referenceType: data.referenceType,
                referenceId: data.referenceId,
                businessId: data.businessId
            }
        });
        revalidatePath("/dashboard/vouchers");
        return { success: true, voucher };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create voucher" };
    }
}
