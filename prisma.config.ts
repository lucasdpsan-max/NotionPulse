import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Fallback keeps `prisma generate` working during builds where no DB URL is
    // set (e.g. a no-DB Vercel deploy). generate doesn't connect to the DB.
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
});
