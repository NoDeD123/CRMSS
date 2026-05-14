import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import 'dotenv/config';

// Tworzymy nową instancję specjalnie pod zbuildowany ESModule by nie powodować konfliktów
const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@strefastartu.pl' },
  });

  if (existingAdmin) {
    console.log('✅ Użytkownik admin@strefastartu.pl już istnieje, pomijam seedowanie.');
    return;
  }

  const hashedPassword = await bcrypt.hash('testoweAdmin123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@strefastartu.pl',
      password: hashedPassword,
      firstName: 'Główny',
      lastName: 'Administrator',
      role: 'ADMIN',
      ownAffiliation: `1000_ADMIN`,
    },
  });

  console.log(`🎉 Zseedowano konto administratora: ${admin.email}`);
  console.log(`Hasło logowania: testoweAdmin123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
