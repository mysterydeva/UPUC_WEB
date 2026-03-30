"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBankAccounts(businessId: string) {
    return prisma.bankAccount.findMany({
        where: { businessId },
        include: {
            transactions: { orderBy: { date: "desc" }, take: 10 }
        },
        orderBy: { createdAt: "desc" }
    });
}

export async function getTransactions(businessId: string) {
    return prisma.transaction.findMany({
        where: { businessId },
        include: {
            bankAccount: true,
            linkedInvoice: true,
        },
        orderBy: { date: "desc" },
        take: 50
    });
}

export async function addBankAccount(data: {
    name: string;
    accountNo: string;
    ifscCode: string;
    branchName: string;
    businessId: string;
    openingBalance: number;
}) {
    try {
        const account = await prisma.bankAccount.create({
            data: {
                name: data.name,
                accountNo: data.accountNo,
                ifscCode: data.ifscCode,
                branchName: data.branchName,
                businessId: data.businessId,
                balance: data.openingBalance,
            }
        });
        revalidatePath("/dashboard/banking");
        return { success: true, account };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to add bank account" };
    }
}

export async function addTransaction(data: {
    bankAccountId: string;
    type: string;
    amount: number;
    reference: string;
    businessId: string;
    linkedInvoiceId?: string;
}) {
    try {
        const transaction = await prisma.transaction.create({
            data: {
                bankAccountId: data.bankAccountId,
                type: data.type,
                amount: data.amount,
                reference: data.reference,
                businessId: data.businessId,
                linkedInvoiceId: data.linkedInvoiceId || undefined,
            }
        });

        // Update Bank Balance automatically
        const account = await prisma.bankAccount.findUnique({ where: { id: data.bankAccountId } });
        if (account) {
            const newBalance = data.type === "Payment In" ? account.balance + data.amount : account.balance - data.amount;
            await prisma.bankAccount.update({
                where: { id: account.id },
                data: { balance: newBalance }
            });
        }

        revalidatePath("/dashboard/banking");
        return { success: true, transaction };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to add transaction" };
    }
}
