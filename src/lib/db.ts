import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("⚠️ DATABASE_URL não está definida");
}

// Cria client apenas se tiver URL
// Configura connection pool maior para Vercel serverless
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  datasources: databaseUrl
    ? undefined
    : { db: { url: "postgresql://placeholder:placeholder@placeholder:5432/placeholder" } },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
