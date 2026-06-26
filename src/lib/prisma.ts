import type { PrismaClient } from '@prisma/client';

const url = process.env.DATABASE_URL ?? '';

/**
 * Picks the data backend from DATABASE_URL:
 *  - postgres → Prisma + pg adapter (Vercel / production)
 *  - file:    → Prisma + better-sqlite3 adapter (local dev)
 *  - anything else / unset → in-memory store (demo, e.g. a no-DB Vercel deploy)
 */
export const dbMode: 'pg' | 'sqlite' | 'memory' = url.startsWith('postgres')
  ? 'pg'
  : url.startsWith('file:')
    ? 'sqlite'
    : 'memory';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined;
};

export async function getPrisma(): Promise<PrismaClient | null> {
  if (globalForPrisma.prisma !== undefined) return globalForPrisma.prisma;

  if (dbMode === 'memory') {
    globalForPrisma.prisma = null;
    return null;
  }

  const { PrismaClient } = await import('@prisma/client');

  if (dbMode === 'sqlite') {
    const { PrismaBetterSqlite3 } = await import('@prisma/adapter-better-sqlite3');
    const adapter = new PrismaBetterSqlite3({ url: url.slice('file:'.length) });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  } else {
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const adapter = new PrismaPg({ connectionString: url });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}
