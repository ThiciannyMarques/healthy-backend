"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL não está definida nas variáveis de ambiente.');
}
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
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
//# sourceMappingURL=seed.js.map