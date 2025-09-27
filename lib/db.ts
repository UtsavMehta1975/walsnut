import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.MYSQL_URL,
      },
    },
    // Performance optimizations
    transactionOptions: {
      timeout: 10000, // 10 seconds
    },
    // Add error formatting for better serialization
    errorFormat: 'minimal',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

