import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não está definida nas variáveis de ambiente.');
}

const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: 'thicianny@healthy.app',
    },
    update: {},
    create: {
      email: 'thicianny@healthy.app',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$mockedhash',
      profile: {
        create: {
          name: 'Thicianny',
          timezone: 'America/Sao_Paulo',
        },
      },
    },
  });

  console.log('Seed executado com sucesso:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
