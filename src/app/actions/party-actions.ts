"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getParties(businessId: string) {
    return (prisma.party as any).findMany({
        where: { businessId },
        include: { _count: { select: { vouchers: true } } },
        orderBy: { name: "asc" }
    });
}

export async function createParty(data: { name: string; mobile: string; gstin: string; businessId: string }) {
    try {
        await prisma.party.create({ data });
        revalidatePath("/dashboard/parties");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create party" };
    }
}
