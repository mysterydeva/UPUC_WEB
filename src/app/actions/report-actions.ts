"use server";

import { prisma } from "@/lib/prisma";

export async function generateGSTR1JSON(businessId: string, month: number, year: number) {
    const invoices = await prisma.invoice.findMany({
        where: {
            businessId,
            date: {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1)
            }
        }
    });

    const b2b = invoices.map((inv: any) => ({
        ctin: "29AAAAA0000A1Z5", // Mock counterparty
        inv: [{
            inum: inv.invoiceId,
            idt: new Date(inv.date).toLocaleDateString("en-GB").replace(/\//g, "-"),
            val: inv.totalAmount,
            pos: "29",
            inv_typ: "R",
            itms: [{
                num: 1,
                itm_det: {
                    rt: inv.taxRate,
                    txval: inv.subTotal,
                    iamt: inv.taxAmount,
                    camt: 0,
                    samt: 0
                }
            }]
        }]
    }));

    return JSON.stringify({
        gstinv: "29BBBBB0000B1Z5",
        fp: `${month.toString().padStart(2, '0')}${year}`,
        version: "1.1",
        hash: "hash",
        b2b
    }, null, 2);
}

export async function exportTallyCSV(businessId: string) {
    const invoices = await prisma.invoice.findMany({
        where: { businessId },
        orderBy: { date: "desc" }
    });

    // Generate raw CSV string
    let csv = "Voucher Date,Voucher Type,Voucher No,Party Name,Sales Ledger,GST Rate,Total Amount\n";
    invoices.forEach((inv: any) => {
        csv += `${new Date(inv.date).toLocaleDateString("en-GB")},Sales,${inv.invoiceId},${inv.client},Local Sales,${inv.taxRate},${inv.totalAmount}\n`;
    });
    return csv;
}

export async function getFinancialStatements(businessId: string) {
    const revenue = await prisma.invoice.aggregate({
        where: { businessId, status: "Paid" },
        _sum: { totalAmount: true }
    });

    const expenses = await prisma.expense.aggregate({
        where: { businessId },
        _sum: { amount: true }
    });

    const receivables = await prisma.invoice.aggregate({
        where: { businessId, status: "Pending" },
        _sum: { totalAmount: true }
    });

    const cash = await prisma.bankAccount.aggregate({
        where: { businessId },
        _sum: { balance: true }
    });

    return {
        revenue: revenue._sum.totalAmount || 0,
        expenses: expenses._sum.amount || 0,
        netProfit: (revenue._sum.totalAmount || 0) - (expenses._sum.amount || 0),
        assets: (cash._sum.balance || 0),
        liabilities: (receivables._sum.totalAmount || 0),
    };
}
