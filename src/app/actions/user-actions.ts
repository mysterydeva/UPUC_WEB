"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers(businessId: string) {
    return prisma.user.findMany({
        where: { businessId }
    });
}

export async function updateUserRole(userId: string, role: string, permissions: string) {
    try {
        await (prisma.user as any).update({
            where: { id: userId },
            data: { role, permissions }
        });
        revalidatePath("/dashboard/settings/users");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to update user role" };
    }
}

export async function inviteUser(data: {
    name: string;
    email: string;
    role: string;
    permissions: string;
    businessId: string;
}) {
    try {
        const user = await (prisma.user as any).create({
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
                permissions: data.permissions,
                businessId: data.businessId
            }
        });
        revalidatePath("/dashboard/settings/users");
        return { success: true, user };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to invite user or email already exists" };
    }
}

