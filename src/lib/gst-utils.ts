/**
 * Utility functions for GST calculations
 */

export type GstType = "CGST_SGST" | "IGST";

export interface GstResult {
    subTotal: number;
    taxRate: number;
    taxAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalAmount: number;
}

/**
 * Calculate GST breakdown based on subtotal and rate
 */
export function calculateGst(
    subTotal: number,
    taxRate: number,
    type: GstType = "CGST_SGST"
): GstResult {
    const taxAmount = (subTotal * taxRate) / 100;
    const totalAmount = subTotal + taxAmount;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (type === "CGST_SGST") {
        cgst = taxAmount / 2;
        sgst = taxAmount / 2;
    } else {
        igst = taxAmount;
    }

    return {
        subTotal,
        taxRate,
        taxAmount,
        cgst,
        sgst,
        igst,
        totalAmount,
    };
}

/**
 * Calculate subtotal from total amount (reverse GST)
 */
export function reverseGst(totalAmount: number, taxRate: number): number {
    return totalAmount / (1 + taxRate / 100);
}
