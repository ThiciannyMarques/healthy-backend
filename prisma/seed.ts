import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Lemos a variável de ambiente garantindo que ela existe
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não está definida nas variáveis de ambiente.');
}

// 2. Criamos o pool de conexão nativo do PostgreSQL
const pool = new Pool({ connectionString });

// 3. Passamos o pool para o adapter do Prisma
const adapter = new PrismaPg(pool);

// 4. Instanciamos o PrismaClient fornecendo o adapter (isso preenche o PrismaClientOptions)
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
