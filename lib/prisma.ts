// Import PrismaClient - this is the main class that lets us talk to our database

import { PrismaClient } from "@/app/generated/prisma/client"




const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}


export const prisma = globalForPrisma.prisma ?? new PrismaClient()


if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma