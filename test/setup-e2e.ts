import { envSchema } from '@/infra/env/env';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

config({ path: '.env', override: true });

const env = envSchema.parse(process.env);
const tempDbName = `test_${randomUUID().replace(/-/g, '')}`;

const dbUrl = new URL(env.DATABASE_URL);
dbUrl.pathname = `/${tempDbName}`;
const testDatabaseUrl = dbUrl.toString();

process.env.DATABASE_URL = testDatabaseUrl;

const rootClient = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});

let prisma: PrismaClient;

beforeAll(async () => {
  await rootClient.$executeRawUnsafe(`CREATE DATABASE "${tempDbName}"`);
  await rootClient.$disconnect();

  execSync('pnpm prisma migrate deploy', { stdio: 'inherit' });

  prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: testDatabaseUrl }),
  });

  await prisma.$connect();
});

afterAll(async () => {
  try {
    if (prisma) await prisma.$disconnect();

    await rootClient.$connect();
    await rootClient.$executeRawUnsafe(
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${tempDbName}' AND pid <> pg_backend_pid()`,
    );
    await rootClient.$executeRawUnsafe(
      `DROP DATABASE IF EXISTS "${tempDbName}"`,
    );
  } catch (err) {
    console.error('Error dropping test database:', err);
  } finally {
    await rootClient.$disconnect();
  }
});
