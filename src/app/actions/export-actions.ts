"use server";

import { prisma } from "@/lib/prisma";

export async function exportGSTR1(month: number, year: number) {
    try {
        const invoices = await prisma.invoice.findMany({
            where: {
                date: {
                    gte: new Date(year, month - 1, 1),
                    lt: new Date(year, month, 1),
                },
                status: "Paid",
            },
        });

        // Mock GSTR-1 JSON structure
        const report = {
            gstin: "27AAAAA0000A1Z5",
            fp: `${month}${year}`,
            b2b: invoices.map((inv: any) => ({
                ctin: "27BBBBB0000B1Z6", // Mock client GSTIN
                inv: [{
                    inum: inv.invoiceId,
                    idt: inv.date.toISOString().split('T')[0],
                    val: inv.totalAmount,
                    pos: "27",
                    rt: inv.taxRate,
                    txval: inv.subTotal,
                    iamt: inv.gstType === "IGST" ? inv.taxAmount : 0,
                    camt: inv.gstType === "CGST_SGST" ? inv.taxAmount / 2 : 0,
                    samt: inv.gstType === "CGST_SGST" ? inv.taxAmount / 2 : 0,
                }]
            }))
        };

        return { success: true, report };
    } catch (error) {
        console.error("GSTR-1 Export failed:", error);
        return { success: false, error: "Report generation failed" };
    }
}

export async function exportTallyData() {
    // Simple CSV export for Tally
    try {
        const invoices = await prisma.invoice.findMany();
        const csvContent = [
            "Date,Invoice No,Party Name,GSTIN,Voucher Type,Amount",
            ...invoices.map((inv: any) => `${inv.date.toISOString().split('T')[0]},${inv.invoiceId},${inv.client},MockGSTIN,Sales,${inv.totalAmount}`)
        ].join("\n");

        return { success: true, csv: csvContent };
    } catch (error) {
        console.error("Tally Export failed:", error);
        return { success: false, error: "Tally export failed" };
    }
}
