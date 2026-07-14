import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(): Promise<void> {
  // A senha real será hasheada na Etapa 2. Para o seed inicial, usamos um hash mockado.
  const user = await prisma.user.upsert({
    where: { email: 'thicianny@healthy.app' },
    update: {},
    create: {
      email: 'thicianny@healthy.app',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$mockedhash', // Mock
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
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
