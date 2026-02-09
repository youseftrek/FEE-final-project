// Import PrismaClient - this is the main class that lets us talk to our database
import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Create Neon adapter with the pooled connection string
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize PrismaClient with the Neon adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
