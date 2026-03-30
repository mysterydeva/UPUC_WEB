"use server";

import { prisma } from "@/lib/prisma";

export async function testConnection() {
    try {
        const count = await prisma.lead.count();
        return { success: true, count };
    } catch (error) {
        console.error("Database connection error:", error);
        return { success: false, error: "Database connection failed" };
    }
}
