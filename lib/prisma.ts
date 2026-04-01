import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString =
    process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('PRISMA_DATABASE_URL or DATABASE_URL is not set')
  }

  const adapter = new PrismaNeon({ connectionString })

  return new PrismaClient({ adapter } as any)
}

export const prisma: any =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma
