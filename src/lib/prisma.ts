import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

console.log('🗄️ Initializing Prisma client...');

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaBetterSqlite3({
    url: "file:dev.db"
});

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

console.log('✅ Prisma client initialized');

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
