import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import { envSchema } from '@/infra/env/env';
import { PrismaPg } from '@prisma/adapter-pg';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);

let prisma: PrismaClient;

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId: string = randomUUID();

beforeAll(() => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  const adapter = new PrismaPg({ connectionString: databaseURL });
  prisma = new PrismaClient({ adapter });

  execSync('pnpm prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
