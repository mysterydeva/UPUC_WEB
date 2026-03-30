"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "./audit-actions";

export async function getLeads(businessId?: string) {
    try {
        const leads = await prisma.lead.findMany({
            where: businessId ? { businessId } : undefined,
            include: {
                measurements: true,
                quotations: {
                    select: { id: true, status: true, amount: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, leads };
    } catch (error) {
        console.error("Failed to fetch leads:", error);
        return { success: false, error: "Failed to fetch leads" };
    }
}

export async function createLead(formData: FormData) {
    const clientName = formData.get("clientName") as string;
    const contact = formData.get("contact") as string;
    const projectType = formData.get("projectType") as string;
    const source = formData.get("source") as string;
    const businessId = formData.get("businessId") as string;

    try {
        // Generate unique lead ID
        const leadCount = await prisma.lead.count({ where: { businessId } });
        const leadId = `LD-${new Date().getFullYear()}-${String(leadCount + 1).padStart(3, '0')}`;

        const lead = await prisma.lead.create({
            data: {
                leadId,
                clientName,
                contact,
                projectType,
                source,
                businessId: businessId || null,
                status: "Enquiry"
            }
        });

        // Log activity
        await logActivity(
            businessId || "default",
            "system-user",
            "CREATE",
            "LEAD",
            lead.id,
            { clientName, contact }
        );

        revalidatePath("/dashboard/leads");
        return { success: true, lead };
    } catch (error) {
        console.error("Failed to create lead:", error);
        return { success: false, error: "Failed to create lead" };
    }
}

export async function updateLeadStatus(id: string, status: string, businessId?: string) {
    try {
        const lead = await prisma.lead.update({
            where: { id },
            data: { status }
        });

        // Log activity
        await logActivity(
            businessId || "default",
            "system-user",
            "UPDATE",
            "LEAD",
            id,
            { oldStatus: lead.status, newStatus: status }
        );

        revalidatePath("/dashboard/leads");
        return { success: true, lead };
    } catch (error) {
        console.error("Failed to update lead status:", error);
        return { success: false, error: "Failed to update lead status" };
    }
}

export async function addMeasurement(leadId: string, formData: FormData) {
    const width = parseFloat(formData.get("width") as string);
    const height = parseFloat(formData.get("height") as string);
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;

    try {
        const measurement = await prisma.measurement.create({
            data: {
                leadId,
                width,
                height,
                location,
                type
            }
        });

        revalidatePath("/dashboard/leads");
        return { success: true, measurement };
    } catch (error) {
        console.error("Failed to add measurement:", error);
        return { success: false, error: "Failed to add measurement" };
    }
}

export async function deleteLead(id: string, businessId?: string) {
    try {
        // Check if lead has quotations or job orders
        const lead = await prisma.lead.findUnique({
            where: { id },
            include: {
                quotations: true,
                _count: {
                    select: {
                        quotations: true,
                        measurements: true
                    }
                }
            }
        });

        if (!lead) {
            return { success: false, error: "Lead not found" };
        }

        if (lead._count.quotations > 0) {
            return { success: false, error: "Cannot delete lead with existing quotations" };
        }

        // Delete lead and measurements
        await prisma.lead.delete({
            where: { id }
        });

        // Log activity
        await logActivity(
            businessId || "default",
            "system-user",
            "DELETE",
            "LEAD",
            id,
            { clientName: lead.clientName }
        );

        revalidatePath("/dashboard/leads");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete lead:", error);
        return { success: false, error: "Failed to delete lead" };
    }
}
