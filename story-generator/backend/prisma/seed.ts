import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Test1234', 12);

  const user = await prisma.user.upsert({
    where: { email: 'lars_joss@bluewin.ch' },
    update: { passwordHash },
    create: {
      email: 'lars_joss@bluewin.ch',
      passwordHash,
    },
  });

  console.log(`Seed-User bereit: ${user.email} (id: ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
