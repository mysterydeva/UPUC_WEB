"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createExpense(formData: FormData) {
    const category = formData.get("category") as string;
    const amount = parseFloat(formData.get("amount") as string) || 0;
    const dateStr = formData.get("date") as string;
    const note = formData.get("note") as string;
    const businessId = formData.get("businessId") as string;

    try {
        const expense = await prisma.expense.create({
            data: {
                category,
                amount,
                date: new Date(dateStr),
                description: note,
                businessId: businessId || null,
            },
        });

        revalidatePath("/dashboard/finance");
        return { success: true, expense };
    } catch (error) {
        console.error("Failed to create expense:", error);
        return { success: false, error: "Failed to create expense" };
    }
}
